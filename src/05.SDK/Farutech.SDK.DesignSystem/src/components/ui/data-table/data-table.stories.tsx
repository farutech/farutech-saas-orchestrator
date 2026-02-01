import type { Meta, StoryObj } from '@storybook/react';

const VIEWPORTS = {
  mobile: {
    name: 'Mobile',
    styles: {
      width: '375px',
      height: '667px',
    },
  },
  tablet: {
    name: 'Tablet',
    styles: {
      width: '768px',
      height: '1024px',
    },
  },
  desktop: {
    name: 'Desktop',
    styles: {
      width: '1440px',
      height: '900px',
    },
  },
};
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from './data-table';
import { Badge } from '../badge/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '../avatar/Avatar';


// Sample data types
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
  lastLogin: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

// Sample data
const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'active',
    avatar: 'https://github.com/shadcn.png',
    lastLogin: '2024-01-15',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'User',
    status: 'active',
    lastLogin: '2024-01-14',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'Moderator',
    status: 'inactive',
    lastLogin: '2024-01-10',
  },
  {
    id: '4',
    name: 'Alice Brown',
    email: 'alice@example.com',
    role: 'User',
    status: 'pending',
    lastLogin: '2024-01-12',
  },
  {
    id: '5',
    name: 'Charlie Wilson',
    email: 'charlie@example.com',
    role: 'User',
    status: 'active',
    lastLogin: '2024-01-16',
  },
];

const products: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: 99.99,
    stock: 25,
    status: 'in-stock',
  },
  {
    id: '2',
    name: 'Bluetooth Speaker',
    category: 'Electronics',
    price: 49.99,
    stock: 5,
    status: 'low-stock',
  },
  {
    id: '3',
    name: 'USB Cable',
    category: 'Accessories',
    price: 9.99,
    stock: 0,
    status: 'out-of-stock',
  },
  {
    id: '4',
    name: 'Laptop Stand',
    category: 'Accessories',
    price: 29.99,
    stock: 15,
    status: 'in-stock',
  },
];

const meta: Meta<typeof DataTable> = {
  title: 'UI/DataTable',
  component: DataTable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A powerful data table component built on TanStack Table with sorting, filtering, pagination, and customizable columns. Perfect for displaying tabular data with advanced features.',
      },
    },
    viewport: {
      viewports: VIEWPORTS,
    },
  },
  tags: ['autodocs', 'ui', 'table', 'data', 'tanstack'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => {
    const columns: ColumnDef<User>[] = [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={row.original.avatar} alt={row.original.name} />
              <AvatarFallback>
                {row.original.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{row.original.name}</span>
          </div>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'role',
        header: 'Role',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <Badge
            variant={
              row.original.status === 'active' ? 'default' :
              row.original.status === 'inactive' ? 'secondary' :
              'outline'
            }
          >
            {row.original.status}
          </Badge>
        ),
      },
      {
        accessorKey: 'lastLogin',
        header: 'Last Login',
      },
    ];

    return (
      <DataTable
        columns={columns}
        data={users}
        searchable
        searchPlaceholder="Search users..."
      />
    );
  },
};

export const WithActions: Story = {
  render: () => {
    const columns: ColumnDef<User>[] = [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={row.original.avatar} alt={row.original.name} />
              <AvatarFallback>
                {row.original.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{row.original.name}</span>
          </div>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'role',
        header: 'Role',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <Badge
            variant={
              row.original.status === 'active' ? 'default' :
              row.original.status === 'inactive' ? 'secondary' :
              'outline'
            }
          >
            {row.original.status}
          </Badge>
        ),
      },
    ];

    return (
      <DataTable
        columns={columns}
        data={users}
        searchable
        searchPlaceholder="Search users..."
        selectable
        rowActions={[
          {
            label: 'Edit',
            onClick: (row) => console.log('Edit user:', row.name),
          },
          {
            label: 'Delete',
            onClick: (row) => console.log('Delete user:', row.name),
            variant: 'destructive',
          },
        ]}
        bulkActions={[
          {
            label: 'Delete Selected',
            onClick: (selectedRows) => console.log('Delete users:', selectedRows.map(r => r.name)),
            variant: 'destructive',
          },
        ]}
        onAdd={() => console.log('Add new user')}
        addLabel="Add User"
        onRefresh={() => console.log('Refresh data')}
        onExport={() => console.log('Export data')}
      />
    );
  },
};

export const ProductsTable: Story = {
  render: () => {
    const columns: ColumnDef<Product>[] = [
      {
        accessorKey: 'name',
        header: 'Product Name',
      },
      {
        accessorKey: 'category',
        header: 'Category',
      },
      {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => `$${row.original.price.toFixed(2)}`,
      },
      {
        accessorKey: 'stock',
        header: 'Stock',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <Badge
            variant={
              row.original.status === 'in-stock' ? 'default' :
              row.original.status === 'low-stock' ? 'secondary' :
              'destructive'
            }
          >
            {row.original.status.replace('-', ' ')}
          </Badge>
        ),
      },
    ];

    return (
      <DataTable
        columns={columns}
        data={products}
        searchable
        searchPlaceholder="Search products..."
        filterable
        selectable
        rowActions={[
          {
            label: 'View Details',
            onClick: (row) => console.log('View product:', row.name),
          },
          {
            label: 'Edit',
            onClick: (row) => console.log('Edit product:', row.name),
          },
        ]}
        bulkActions={[
          {
            label: 'Export Selected',
            onClick: (selectedRows) => console.log('Export products:', selectedRows.map(r => r.name)),
          },
        ]}
        onAdd={() => console.log('Add new product')}
        addLabel="Add Product"
        pageSize={5}
        pageSizeOptions={[5, 10, 20]}
      />
    );
  },
};

export const Loading: Story = {
  render: () => {
    const columns: ColumnDef<User>[] = [
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'role',
        header: 'Role',
      },
      {
        accessorKey: 'status',
        header: 'Status',
      },
    ];

    return (
      <DataTable
        columns={columns}
        data={[]}
        isLoading
        emptyMessage="Loading users..."
        searchable
        searchPlaceholder="Search users..."
      />
    );
  },
};

export const Empty: Story = {
  render: () => {
    const columns: ColumnDef<User>[] = [
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'role',
        header: 'Role',
      },
      {
        accessorKey: 'status',
        header: 'Status',
      },
    ];

    return (
      <DataTable
        columns={columns}
        data={[]}
        emptyMessage="No users found. Try adjusting your search or add a new user."
        searchable
        searchPlaceholder="Search users..."
        onAdd={() => console.log('Add new user')}
        addLabel="Add User"
      />
    );
  },
};

export const Compact: Story = {
  render: () => {
    const columns: ColumnDef<Product>[] = [
      {
        accessorKey: 'name',
        header: 'Product',
      },
      {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => `$${row.original.price.toFixed(2)}`,
      },
      {
        accessorKey: 'stock',
        header: 'Stock',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <Badge
            variant={
              row.original.status === 'in-stock' ? 'default' :
              row.original.status === 'low-stock' ? 'secondary' :
              'destructive'
            }
            className="text-xs"
          >
            {row.original.status.replace('-', ' ')}
          </Badge>
        ),
      },
    ];

    return (
      <DataTable
        columns={columns}
        data={products}
        pageSize={3}
        pageSizeOptions={[3, 6, 9]}
      />
    );
  },
};

export const TaskManagement: Story = {
  render: () => {
    const columns: ColumnDef<Task>[] = [
      {
        accessorKey: 'title',
        header: 'Task',
        cell: ({ row }) => (
          <div className="font-medium">{row.original.title}</div>
        ),
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        cell: ({ row }) => (
          <Badge
            variant={
              row.original.priority === 'high' ? 'destructive' :
              row.original.priority === 'medium' ? 'default' :
              'secondary'
            }
            className="text-xs"
          >
            {row.original.priority}
          </Badge>
        ),
      },
      {
        accessorKey: 'assignee',
        header: 'Assignee',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <Badge
            variant={
              row.original.status === 'done' ? 'default' :
              row.original.status === 'in-progress' ? 'secondary' :
              'outline'
            }
            className="text-xs"
          >
            {row.original.status.replace('-', ' ')}
          </Badge>
        ),
      },
      {
        accessorKey: 'dueDate',
        header: 'Due Date',
      },
    ];

    return (
      <DataTable
        columns={columns}
        data={tasks}
        pageSize={4}
        pageSizeOptions={[4, 8]}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Task management table with priority indicators and status badges.',
      },
    },
  },
};

export const CompactTable: Story = {
  render: () => {
    const columns: ColumnDef<User>[] = [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={row.original.avatar} alt={row.original.name} />
              <AvatarFallback className="text-xs">
                {row.original.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{row.original.name}</span>
          </div>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">{row.original.email}</span>
        ),
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => (
          <Badge variant="outline" className="text-xs">
            {row.original.role}
          </Badge>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <Badge
            variant={
              row.original.status === 'active' ? 'default' :
              row.original.status === 'pending' ? 'secondary' :
              'destructive'
            }
            className="text-xs"
          >
            {row.original.status}
          </Badge>
        ),
      },
    ];

    return (
      <DataTable
        columns={columns}
        data={users}
        pageSize={3}
        pageSizeOptions={[3, 6]}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact table design with smaller elements for dense data display.',
      },
    },
  },
};

export const ResponsiveTable: Story = {
  render: () => {
    const columns: ColumnDef<Product>[] = [
      {
        accessorKey: 'name',
        header: 'Product',
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="text-sm text-muted-foreground">{row.original.category}</div>
          </div>
        ),
      },
      {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => `$${row.original.price.toFixed(2)}`,
      },
      {
        accessorKey: 'stock',
        header: 'Stock',
        cell: ({ row }) => (
          <span className={`font-medium ${
            row.original.stock === 0 ? 'text-red-600' :
            row.original.stock < 10 ? 'text-orange-600' :
            'text-green-600'
          }`}>
            {row.original.stock}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <Badge
            variant={
              row.original.status === 'in-stock' ? 'default' :
              row.original.status === 'low-stock' ? 'secondary' :
              'destructive'
            }
            className="text-xs"
          >
            {row.original.status.replace('-', ' ')}
          </Badge>
        ),
      },
    ];

    return (
      <div className="w-full overflow-x-auto">
        <DataTable
          columns={columns}
          data={products}
          pageSize={3}
          pageSizeOptions={[3, 6]}
        />
      </div>
    );
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Responsive table with horizontal scrolling for mobile devices.',
      },
    },
  },
};

export const LargeDataset: Story = {
  render: () => {
    // Generate larger dataset
    const largeUsers = Array.from({ length: 50 }, (_, i) => ({
      id: (i + 1).toString(),
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: i % 3 === 0 ? 'Admin' : i % 3 === 1 ? 'User' : 'Moderator',
      status: (i % 4 === 0 ? 'pending' : i % 4 === 1 ? 'active' : 'inactive') as 'active' | 'inactive' | 'pending',
      lastLogin: `2024-01-${(i % 28 + 1).toString().padStart(2, '0')}`,
    }));

    const columns: ColumnDef<User>[] = [
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'role',
        header: 'Role',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <Badge
            variant={
              row.original.status === 'active' ? 'default' :
              row.original.status === 'pending' ? 'secondary' :
              'destructive'
            }
            className="text-xs"
          >
            {row.original.status}
          </Badge>
        ),
      },
      {
        accessorKey: 'lastLogin',
        header: 'Last Login',
      },
    ];

    return (
      <DataTable
        columns={columns}
        data={largeUsers}
        pageSize={10}
        pageSizeOptions={[5, 10, 25, 50]}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Data table handling a large dataset with pagination controls.',
      },
    },
  },
};



