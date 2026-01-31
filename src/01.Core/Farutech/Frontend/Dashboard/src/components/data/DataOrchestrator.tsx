// ============================================================================
// DATA ORCHESTRATOR - Universal Data Management Component with Render Props
// ============================================================================

import { useState, useEffect, useCallback } from "react";
import { Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// ============================================================================
// Types
// ============================================================================

export interface FetchParams {
  pageNumber: number;
  pageSize: number;
  filter?: string;
}

export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface DataOrchestratorProps<T> {
  fetchData: (params: FetchParams) => Promise<PagedResponse<T>>;
  renderItem: (item: T, index: number) => React.ReactNode;
  renderSkeleton?: () => React.ReactNode;
  skeletonCount?: number;
  defaultPageSize?: number;
  searchPlaceholder?: string;
  searchDebounce?: number;
  emptyMessage?: string;
  containerClassName?: string;
  refreshTrigger?: number;
}

// ============================================================================
// Component
// ============================================================================

export function DataOrchestrator<T>({
  fetchData,
  renderItem,
  renderSkeleton,
  skeletonCount = 6,
  defaultPageSize = 10,
  searchPlaceholder = "Buscar...",
  searchDebounce = 500,
  emptyMessage = "No se encontraron resultados",
  containerClassName = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
  refreshTrigger = 0,
}: DataOrchestratorProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Debounce searchTerm
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPageNumber(1);
    }, searchDebounce);

    return () => clearTimeout(timer);
  }, [searchTerm, searchDebounce]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetchData({ pageNumber, pageSize: defaultPageSize, filter: debouncedSearch || undefined });
      setData(res.items);
      setTotalPages(res.totalPages);
      setTotalCount(res.totalCount);
    } catch (err) {
      console.error("[DataOrchestrator] Error fetching data:", err);
      setError(err instanceof Error ? err.message : "Error al cargar datos");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [fetchData, pageNumber, defaultPageSize, debouncedSearch]);

  useEffect(() => {
    loadData();
  }, [loadData, refreshTrigger]);

  const handlePrevPage = () => {
    setPageNumber((p) => Math.max(1, p - 1));
  };

  const handleNextPage = () => {
    setPageNumber((p) => Math.min(totalPages, p + 1));
  };

  const defaultSkeleton = () => (
    <div className="space-y-3 p-6 bg-white rounded-xl border border-slate-200">
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-20 w-full" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm((e.target as HTMLInputElement).value)}
            className="pl-10 bg-white border-slate-200 focus-visible:ring-[#8B5CF6]"
          />
        </div>

        {debouncedSearch && (
          <Button variant="ghost" size="sm" onClick={() => setSearchTerm("")} className="text-slate-500">
            Limpiar
          </Button>
        )}
      </div>

      {!loading && (
        <div className="text-sm text-slate-500">
          {totalCount > 0 ? (
            <>
              Mostrando <span className="font-semibold text-slate-900">{data.length}</span> de{' '}
              <span className="font-semibold text-slate-900">{totalCount}</span> resultados
            </>
          ) : (
            <span>Sin resultados</span>
          )}
        </div>
      )}

      {loading ? (
        <div className={containerClassName}>
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <div key={i}>{renderSkeleton ? renderSkeleton() : defaultSkeleton()}</div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <div className="bg-red-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <Loader2 className="h-10 w-10 text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">Error al cargar datos</h3>
          <p className="text-slate-500 mt-2">{error}</p>
          <Button variant="link" onClick={loadData} className="text-[#8B5CF6] mt-2">
            Reintentar
          </Button>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-20">
          <div className="bg-slate-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <Search className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">{emptyMessage}</h3>
          {debouncedSearch && (
            <Button variant="link" onClick={() => setSearchTerm("")} className="text-[#8B5CF6] mt-2">
              Limpiar filtros
            </Button>
          )}
        </div>
      ) : (
        <div className={containerClassName}>
          {data.map((item, index) => (
            <div key={index}>{renderItem(item, index)}</div>
          ))}
        </div>
      )}

      {data.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-6">
          <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={pageNumber === 1} className="gap-1">
            <ChevronLeft className="h-4 w-4" /> Anterior
          </Button>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">Página</span>
            <span className="font-semibold text-slate-900">{pageNumber}</span>
            <span className="text-slate-500">de</span>
            <span className="font-semibold text-slate-900">{totalPages}</span>
          </div>

          <Button variant="outline" size="sm" onClick={handleNextPage} disabled={pageNumber === totalPages} className="gap-1">
            Siguiente <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
