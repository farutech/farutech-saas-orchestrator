export * from './components/ui';
export * from './styles';
// UI Components
export { Button } from './components/ui/button';
export { Input } from './components/ui/input';
export { Textarea } from './components/ui/textarea';
export { Label } from './components/ui/label';
export { Checkbox } from './components/ui/checkbox';
export { Switch } from './components/ui/switch';
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components/ui/card';
export { Badge } from './components/ui/badge';
export { Alert, AlertTitle, AlertDescription } from './components/ui/alert';
export { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from './components/ui/dialog';
export { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
export { Separator } from './components/ui/separator';
export { Skeleton } from './components/ui/skeleton';
export { Progress } from './components/ui/progress';
export { Avatar, AvatarImage, AvatarFallback } from './components/ui/avatar';

// New UI Components (migrated from core/apps)
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './components/ui/accordion';
export { AlertDialog, AlertDialogPortal, AlertDialogOverlay, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from './components/ui/alert-dialog';
export { AspectRatio } from './components/ui/aspect-ratio';
export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis } from './components/ui/breadcrumb';
export { Calendar } from './components/ui/calendar';
export { Collapsible, CollapsibleTrigger, CollapsibleContent } from './components/ui/collapsible';
export { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut, CommandSeparator } from './components/ui/command';
export { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuCheckboxItem, ContextMenuRadioItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuShortcut, ContextMenuGroup, ContextMenuPortal, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuRadioGroup } from './components/ui/context-menu';
export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuGroup, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuRadioGroup } from './components/ui/dropdown-menu';
export { useFormField, Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField } from './components/ui/form';
export { HoverCard, HoverCardTrigger, HoverCardContent } from './components/ui/hover-card';
export { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator, MenubarLabel, MenubarCheckboxItem, MenubarRadioGroup, MenubarRadioItem, MenubarPortal, MenubarSubContent, MenubarSubTrigger, MenubarGroup, MenubarSub, MenubarShortcut } from './components/ui/menubar';
export { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuContent, NavigationMenuTrigger, NavigationMenuLink, NavigationMenuIndicator, NavigationMenuViewport } from './components/ui/navigation-menu';
export { Popover, PopoverTrigger, PopoverContent } from './components/ui/popover';
export { RadioGroup, RadioGroupItem } from './components/ui/radio-group';
export { ScrollArea, ScrollBar } from './components/ui/scroll-area';
export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator, SelectScrollUpButton, SelectScrollDownButton } from './components/ui/select';
export { Slider } from './components/ui/slider';
export { Toast, ToastAction, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from './components/ui/toast';
export { Toaster } from './components/ui/toaster';
export { Toggle, toggleVariants } from './components/ui/toggle';
export { ToggleGroup, ToggleGroupItem } from './components/ui/toggle-group';
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './components/ui/tooltip';

// New migrated components
export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from './components/ui/table';
export { DataTable, type DataTableAction, type DataTableBulkAction, type DataTableProps } from './components/ui/data-table';
export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle } from './components/ui/chart';
export { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './components/ui/pagination';
export { Drawer, DrawerPortal, DrawerOverlay, DrawerTrigger, DrawerClose, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription } from './components/ui/drawer';
export { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetOverlay, SheetPortal, SheetTitle, SheetTrigger } from './components/ui/sheet';
export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from './components/ui/input-otp';
export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from './components/ui/carousel';
export { Toaster as Sonner, toast } from './components/ui/sonner';
export { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './components/ui/resizable';
export { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInput, SidebarInset, SidebarMenu, SidebarMenuAction, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarMenuSkeleton, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider, SidebarRail, SidebarSeparator, SidebarTrigger, useSidebar } from './components/ui/sidebar';

// Farutech-specific Components
export { FarutechLogo } from './components/FarutechLogo';
export { ModuleCard } from './components/ModuleCard';
export { LoadingSpinner } from './components/LoadingSpinner';
export { ErrorBoundary } from './components/ErrorBoundary';

// Hooks
export { useIsMobile } from './hooks/use-mobile';
export { useToast } from './hooks/use-toast';
export { useLocalStorage } from './hooks/use-local-storage';
export { useDataTable, type UseDataTableOptions, type UseDataTableReturn } from './hooks/use-data-table';
export { useResponsive, type Breakpoint } from './hooks/use-responsive';
export { useDebounce } from './hooks/use-debounce';

// Utils
export { cn } from './utils/cn';

// Presets & Styles
export { farutechPreset } from './presets/tailwind-preset';

// Legacy exports (for backward compatibility)
export { SDKVersionDashboard } from './components/SDKVersionDashboard';
export { AnalyticsDashboard } from './components/AnalyticsDashboard';
export { useAuth } from './hooks/useAuth';
export { UrlBuilder, createUrl } from './utils/urlBuilder';