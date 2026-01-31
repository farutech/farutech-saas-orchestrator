import type { Meta, StoryObj } from '@storybook/react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from './data-table';
import { Badge } from './badge';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';

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
  },
  tags: ['autodocs'],
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


