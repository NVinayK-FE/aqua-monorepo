import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from '@/ui/input';

const meta = {
    title: 'Components/Input',
    component: Input,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
    argTypes: {
        type: {
            control: 'select',
            options: ['text', 'email', 'password', 'number', 'tel', 'url', 'date', 'time'],
        },
        variant: {
            control: 'select',
            options: ['default', 'filled', 'ghost'],
        },
        inputSize: {
            control: 'select',
            options: ['sm', 'default', 'lg'],
        },
    },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { placeholder: 'Enter text...' },
};

export const Email: Story = {
    args: { type: 'email', placeholder: 'Enter email...' },
};

export const Password: Story = {
    args: { type: 'password', placeholder: 'Enter password...' },
};

export const Number: Story = {
    args: { type: 'number', placeholder: 'Enter number...' },
};

export const Tel: Story = {
    args: { type: 'tel', placeholder: 'Enter phone...' },
};

export const URL: Story = {
    args: { type: 'url', placeholder: 'Enter URL...' },
};

export const Date: Story = {
    args: { type: 'date' },
};

export const Time: Story = {
    args: { type: 'time' },
};

export const Disabled: Story = {
    args: { placeholder: 'Disabled input', disabled: true },
};

export const AllTypes: Story = {
    render: () => (
        <div className="flex flex-col gap-4 w-64">
            <Input placeholder="Text" />
            <Input type="email" placeholder="Email" />
            <Input type="password" placeholder="Password" />
            <Input type="number" placeholder="Number" />
            <Input type="tel" placeholder="Phone" />
            <Input type="url" placeholder="URL" />
            <Input type="date" />
            <Input type="time" />
            <Input placeholder="Disabled" disabled />
        </div>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-4 w-64">
            <Input variant="default" placeholder="Default" />
            <Input variant="filled" placeholder="Filled" />
            <Input variant="ghost" placeholder="Ghost" />
        </div>
    ),
};

export const AllSizes: Story = {
    render: () => (
        <div className="flex flex-col gap-4 w-72">
            <Input inputSize="sm" placeholder="Small" />
            <Input inputSize="default" placeholder="Default" />
            <Input inputSize="lg" placeholder="Large" />
        </div>
    ),
};
