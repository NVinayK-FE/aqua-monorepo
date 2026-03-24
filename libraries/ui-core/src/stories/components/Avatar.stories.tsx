import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, AvatarImage, AvatarFallback } from '@/ui/avatar';

const meta = {
    title: 'Components/Avatar',
    component: Avatar,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
    render: () => (
        <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
    ),
};

export const WithFallback: Story = {
    render: () => (
        <Avatar>
            <AvatarImage src="https://invalid-url.example.com/avatar.png" />
            <AvatarFallback>JD</AvatarFallback>
        </Avatar>
    ),
};

export const Multiple: Story = {
    render: () => (
        <div className="flex gap-4">
            <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <Avatar>
                <AvatarImage src="https://api.github.com/users/vercel.png" />
                <AvatarFallback>VRL</AvatarFallback>
            </Avatar>
            <Avatar>
                <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Avatar>
                <AvatarFallback>AB</AvatarFallback>
            </Avatar>
        </div>
    ),
};

export const Sizes: Story = {
    render: () => (
        <div className="flex gap-6 items-center">
            <Avatar className="h-8 w-8">
                <AvatarFallback>SM</AvatarFallback>
            </Avatar>
            <Avatar className="h-10 w-10">
                <AvatarFallback>MD</AvatarFallback>
            </Avatar>
            <Avatar className="h-12 w-12">
                <AvatarFallback>LG</AvatarFallback>
            </Avatar>
            <Avatar className="h-16 w-16">
                <AvatarFallback>XL</AvatarFallback>
            </Avatar>
        </div>
    ),
};
