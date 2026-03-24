import type { Meta, StoryObj } from '@storybook/react-vite';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';

const meta = {
    title: 'Components/Table',
    component: Table,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell>John Doe</TableCell>
                    <TableCell>john@example.com</TableCell>
                    <TableCell>Active</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Jane Smith</TableCell>
                    <TableCell>jane@example.com</TableCell>
                    <TableCell>Active</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Bob Johnson</TableCell>
                    <TableCell>bob@example.com</TableCell>
                    <TableCell>Inactive</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    ),
};

export const WithStriped: Story = {
    render: () => (
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent border-b">
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Total</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow className="hover:bg-muted/50">
                    <TableCell>Laptop</TableCell>
                    <TableCell>$999</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>$999</TableCell>
                </TableRow>
                <TableRow className="hover:bg-muted/50">
                    <TableCell>Mouse</TableCell>
                    <TableCell>$29</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell>$58</TableCell>
                </TableRow>
                <TableRow className="hover:bg-muted/50">
                    <TableCell>Keyboard</TableCell>
                    <TableCell>$79</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>$79</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    ),
};

export const LargeTable: Story = {
    render: () => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell>{String(i + 1).padStart(3, '0')}</TableCell>
                        <TableCell>Employee {i + 1}</TableCell>
                        <TableCell>Department {String.fromCharCode(65 + (i % 3))}</TableCell>
                        <TableCell>emp{i + 1}@company.com</TableCell>
                        <TableCell>{i % 2 === 0 ? 'Active' : 'Inactive'}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    ),
};
