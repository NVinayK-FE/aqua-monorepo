import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '@/ui/badge';

const meta = {
    title: 'Components/Badge',
    component: Badge,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'secondary', 'destructive', 'outline'],
        },
        size: {
            control: 'select',
            options: ['sm', 'default', 'lg'],
        },
    },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { children: 'Badge' },
};

export const Secondary: Story = {
    args: { variant: 'secondary', children: 'Secondary' },
};

export const Destructive: Story = {
    args: { variant: 'destructive', children: 'Destructive' },
};

export const Outline: Story = {
    args: { variant: 'outline', children: 'Outline' },
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex gap-3">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
        </div>
    ),
};

export const AllSizes: Story = {
    render: () => (
        <div className="flex items-center gap-3">
            <Badge size="sm">Small</Badge>
            <Badge size="default">Default</Badge>
            <Badge size="lg">Large</Badge>
        </div>
    ),
};
