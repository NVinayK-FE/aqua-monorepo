import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/ui/button';
import { Toaster } from '@/ui/sonner';
import { toast } from 'sonner';

const meta = {
    title: 'Components/Sonner',
    component: Toaster,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <div className="space-y-4">
            <Toaster />
            <Button onClick={() => toast('Default Toast')}>
                Show Toast
            </Button>
        </div>
    ),
};

export const Success: Story = {
    render: () => (
        <div className="space-y-4">
            <Toaster />
            <Button
                onClick={() => toast.success('Operation successful!')}
                className="bg-green-600 hover:bg-green-700"
            >
                Show Success
            </Button>
        </div>
    ),
};

export const Error: Story = {
    render: () => (
        <div className="space-y-4">
            <Toaster />
            <Button
                onClick={() => toast.error('An error occurred!')}
                variant="destructive"
            >
                Show Error
            </Button>
        </div>
    ),
};

export const Warning: Story = {
    render: () => (
        <div className="space-y-4">
            <Toaster />
            <Button
                onClick={() => toast('Please be careful!', { description: 'This is a warning.' })}
                variant="outline"
            >
                Show Warning
            </Button>
        </div>
    ),
};

export const WithDescription: Story = {
    render: () => (
        <div className="space-y-4">
            <Toaster />
            <Button
                onClick={() => toast('Hello!', {
                    description: 'This toast has a description text below the title.'
                })}
            >
                Show with Description
            </Button>
        </div>
    ),
};

export const AllTypes: Story = {
    render: () => (
        <div className="space-y-4">
            <Toaster />
            <div className="flex gap-2">
                <Button onClick={() => toast('Default')}>Default</Button>
                <Button onClick={() => toast.success('Success!')}>Success</Button>
                <Button onClick={() => toast.error('Error!')}>Error</Button>
                <Button onClick={() => toast.loading('Loading...')}>Loading</Button>
            </div>
        </div>
    ),
};
