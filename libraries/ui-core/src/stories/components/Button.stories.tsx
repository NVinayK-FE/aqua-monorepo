import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from '@/ui/button';

const meta = {
    title: 'Components/Button',
    component: Button,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
        },
        size: {
            control: 'select',
            options: ['default', 'sm', 'lg', 'icon'],
        },
    },
    args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { children: 'Default Button' },
};

export const Destructive: Story = {
    args: { variant: 'destructive', children: 'Delete' },
};

export const Outline: Story = {
    args: { variant: 'outline', children: 'Outline' },
};

export const Secondary: Story = {
    args: { variant: 'secondary', children: 'Secondary' },
};

export const Ghost: Story = {
    args: { variant: 'ghost', children: 'Ghost' },
};

export const Link: Story = {
    args: { variant: 'link', children: 'Link Button' },
};

export const Small: Story = {
    args: { size: 'sm', children: 'Small' },
};

export const Large: Story = {
    args: { size: 'lg', children: 'Large' },
};

export const Icon: Story = {
    args: { size: 'icon', children: '→' },
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-wrap gap-2">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
        </div>
    ),
};

export const AllSizes: Story = {
    render: () => (
        <div className="flex gap-2 items-center">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">→</Button>
        </div>
    ),
};

export const Disabled: Story = {
    args: { disabled: true, children: 'Disabled Button' },
};
