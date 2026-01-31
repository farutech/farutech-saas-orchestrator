// ============================================================================
// CUSTOMERS PAGE - Gestión de clientes
// ============================================================================

import { useState } from 'react';
import { useCustomers, useCreateCustomer } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Users, Plus, Search, Building2, Mail, Phone } from 'lucide-react';
import type { CreateCustomerRequest } from '@/types/api';

export default function CustomersPage() {
  const { data: customers, isLoading } = useCustomers();
  const createMutation = useCreateCustomer();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<CreateCustomerRequest>({
    companyName: '',
    email: '',
    phone: '',
    address: '',
    taxId: '',
  });

  const handleCreate = async () => {
    await createMutation.mutateAsync(formData);
    setIsDialogOpen(false);
    setFormData({ companyName: '', email: '', phone: '', address: '', taxId: '' });
  };

  const filteredCustomers = customers?.filter((customer) =>
    customer.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Users className="mr-3 h-8 w-8" />
            Gestión de Clientes
          </h1>
          <p className="text-white/60 mt-2">
            Administra tus clientes y organizaciones
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Cliente
        </Button>
      </div>

      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800 border-white/10 text-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-white/80">Empresa</TableHead>
                <TableHead className="text-white/80">Email</TableHead>
                <TableHead className="text-white/80">Teléfono</TableHead>
                <TableHead className="text-white/80">Código</TableHead>
                <TableHead className="text-white/80">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers?.map((customer) => (
                <TableRow key={customer.id} className="border-white/10">
                  <TableCell className="text-white font-medium">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-primary" />
                      {customer.companyName}
                    </div>
                  </TableCell>
                  <TableCell className="text-white/80">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {customer.email}
                    </div>
                  </TableCell>
                  <TableCell className="text-white/80">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {customer.phone || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell className="text-white/80">
                    <Badge variant="outline">{customer.code}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={customer.isActive ? 'default' : 'secondary'}>
                      {customer.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-900 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Nuevo Cliente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-white">Nombre de la Empresa</Label>
              <Input
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="bg-slate-800 border-white/10 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-slate-800 border-white/10 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Teléfono</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-slate-800 border-white/10 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Tax ID</Label>
              <Input
                value={formData.taxId}
                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                className="bg-slate-800 border-white/10 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate}>Crear Cliente</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
