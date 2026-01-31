import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatusBadge } from '../StatusBadge';
import { Pet } from '@/types/dashboard';
import { Dog, Cat, MoreHorizontal, Calendar } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PetTableProps {
  pets: Pet[];
}

export function PetTable({ pets }: PetTableProps) {
  const getSpeciesIcon = (species: string) => {
    return species === 'Perro' ? Dog : Cat;
  };

  return (
    <Card className="animate-slide-up" style={{ animationDelay: '200ms' }}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Mascotas y Dueños</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary">
          Ver todas
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pets.map((pet) => {
            const SpeciesIcon = getSpeciesIcon(pet.species);
            return (
              <div 
                key={pet.id} 
                className="flex items-center justify-between py-3 border-b border-border last:border-0 hover:bg-muted/50 -mx-2 px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 bg-primary/10">
                    <AvatarFallback className="bg-primary/10">
                      <SpeciesIcon className="h-6 w-6 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{pet.name}</p>
                    <p className="text-sm text-muted-foreground">{pet.breed} • {pet.owner}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {pet.nextVaccine && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{pet.nextVaccine}</span>
                    </div>
                  )}
                  <StatusBadge status={pet.status} />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover">
                      <DropdownMenuItem>Ver ficha</DropdownMenuItem>
                      <DropdownMenuItem>Historial médico</DropdownMenuItem>
                      <DropdownMenuItem>Programar cita</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
