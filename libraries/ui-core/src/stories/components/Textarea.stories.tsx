import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from '@/ui/textarea';

const meta = {
    title: 'Components/Textarea',
    component: Textarea,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'filled', 'ghost'],
        },
        size: {
            control: 'select',
            options: ['sm', 'default', 'lg'],
        },
    },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { placeholder: 'Enter your message here...' },
};

export const WithValue: Story = {
    args: { defaultValue: 'This is a sample textarea with content.' },
};

export const Disabled: Story = {
    args: { placeholder: 'Disabled textarea', disabled: true },
};

export const Rows: Story = {
    render: () => (
        <div className="flex flex-col gap-4 w-96">
            <Textarea placeholder="Small (2 rows)" rows={2} />
            <Textarea placeholder="Medium (4 rows)" rows={4} />
            <Textarea placeholder="Large (6 rows)" rows={6} />
        </div>
    ),
};

export const WithContent: Story = {
    args: {
        defaultValue: `This textarea contains multiple lines of text.
You can enter as much content as needed.
It will automatically wrap to the next line.`,
    },
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-4 w-96">
            <Textarea variant="default" placeholder="Default textarea" />
            <Textarea variant="filled" placeholder="Filled textarea" />
            <Textarea variant="ghost" placeholder="Ghost textarea" />
        </div>
    ),
};

export const AllSizes: Story = {
    render: () => (
        <div className="flex flex-col gap-4 w-96">
            <Textarea size="sm" placeholder="Small" />
            <Textarea size="default" placeholder="Default" />
            <Textarea size="lg" placeholder="Large" />
        </div>
    ),
};
