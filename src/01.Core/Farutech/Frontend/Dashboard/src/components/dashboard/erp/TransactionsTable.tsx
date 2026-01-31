import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '../StatusBadge';
import { Transaction } from '@/types/dashboard';
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TransactionsTableProps {
  transactions: Transaction[];
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  return (
    <Card className="animate-slide-up" style={{ animationDelay: '300ms' }}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Últimas Transacciones</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary">
          Ver todas
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction)
        => (
            <div 
              key={transaction.id} 
              className="flex items-center justify-between py-3 border-b border-border last:border-0 hover:bg-muted/50 -mx-2 px-2 rounded-lg transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{transaction.description}</p>
                <p className="text-sm text-muted-foreground">{transaction.customer}</p>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <div className="text-right">
                  <p className="font-semibold">${transaction.amount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{transaction.date}</p>
                </div>
                <StatusBadge status={transaction.status} />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      Ver detalles
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
