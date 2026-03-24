import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from '@/ui/label';
import { Input } from '@/ui/input';

const meta = {
    title: 'Components/Label',
    component: Label,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { children: 'Label' },
};

export const WithInput: Story = {
    render: () => (
        <div className="flex flex-col space-y-2 w-64">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" />
        </div>
    ),
};

export const Required: Story = {
    render: () => (
        <div className="flex flex-col space-y-2 w-64">
            <Label htmlFor="name">
                Name <span className="text-red-500">*</span>
            </Label>
            <Input id="name" placeholder="Enter your name" />
        </div>
    ),
};

export const Disabled: Story = {
    render: () => (
        <div className="flex flex-col space-y-2 w-64">
            <Label htmlFor="disabled" className="opacity-50">
                Disabled Field
            </Label>
            <Input id="disabled" placeholder="This is disabled" disabled />
        </div>
    ),
};

export const Multiple: Story = {
    render: () => (
        <div className="flex flex-col space-y-4 w-80">
            <div className="flex flex-col space-y-2">
                <Label htmlFor="first">First Name</Label>
                <Input id="first" placeholder="John" />
            </div>
            <div className="flex flex-col space-y-2">
                <Label htmlFor="last">Last Name</Label>
                <Input id="last" placeholder="Doe" />
            </div>
            <div className="flex flex-col space-y-2">
                <Label htmlFor="email2">Email</Label>
                <Input id="email2" type="email" placeholder="john@example.com" />
            </div>
        </div>
    ),
};
