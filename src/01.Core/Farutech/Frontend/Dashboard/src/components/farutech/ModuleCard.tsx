import { motion } from 'framer-motion';
import { 
  Stethoscope, 
  PawPrint, 
  Building2, 
  ShoppingCart,
  ArrowRight,
  LucideIcon
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ModuleType, ModuleConfig } from '@/types/farutech';
import { cn } from '@/lib/utils';

const iconMap: Record<string, LucideIcon> = {
  Stethoscope,
  PawPrint,
  Building2,
  ShoppingCart,
};

interface ModuleCardProps {
  config: ModuleConfig;
  onClick: (module: ModuleType)
        => void;
  index: number;
}

export function ModuleCard({ config, onClick, index }: ModuleCardProps) {
  const Icon = iconMap[config.icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: "easeOut" 
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className={cn(
          "relative overflow-hidden cursor-pointer group",
          "bg-card border-2 border-transparent hover:border-primary/30",
          "transition-all duration-300 shadow-card hover:shadow-card-hover"
        )}
        onClick={()
        => onClick(config.id)}
      >
        {/* Gradient background overlay */}
        <div 
          className={cn(
            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
            config.gradient
          )}
          style={{ opacity: 0.05 }}
        />

        <CardContent className="p-6 relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div 
              className={cn(
                "p-3 rounded-xl",
                config.gradient
              )}
            >
              <Icon className="h-7 w-7 text-white" />
            </div>
            <motion.div
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              whileHover={{ x: 4 }}
            >
              <ArrowRight className="h-5 w-5 text-primary" />
            </motion.div>
          </div>

          <h3 className="text-xl font-bold mb-2">{config.name}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {config.description}
          </p>

          {/* Bottom accent line */}
          <div 
            className={cn(
              "absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100",
              "transition-transform duration-300 origin-left",
              config.gradient
            )}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
