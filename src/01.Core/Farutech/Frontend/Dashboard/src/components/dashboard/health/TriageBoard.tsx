import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '../StatusBadge';
import { Patient } from '@/types/dashboard';
import { Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TriageBoardProps {
  patients: Patient[];
}

export function TriageBoard({ patients }: TriageBoardProps) {
  const sortedPatients = [...patients].sort((a, b)
        => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <Card className="animate-slide-up" style={{ animationDelay: '200ms' }}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-destructive animate-pulse-soft" />
          Triage Board
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedPatients.map((patient)
        => (
            <div 
              key={patient.id} 
              className={cn(
                "flex items-center justify-between p-4 rounded-xl border transition-all hover:shadow-md",
                patient.priority === 'high' && "border-l-4 border-l-destructive bg-destructive/5",
                patient.priority === 'medium' && "border-l-4 border-l-warning bg-warning/5",
                patient.priority === 'low' && "border-l-4 border-l-success bg-success/5"
              )}
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{patient.name}</p>
                  <p className="text-sm text-muted-foreground">{patient.condition}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {patient.waitTime}
                  </div>
                  <p className="text-xs text-muted-foreground">{patient.doctor}</p>
                </div>
                <StatusBadge status={patient.priority} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
