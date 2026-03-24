import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/ui/card';
import { Button } from '@/ui/button';

const meta = {
    title: 'Components/Card',
    component: Card,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
                <p>This is the main content of the card.</p>
            </CardContent>
            <CardFooter>
                <Button>Action</Button>
            </CardFooter>
        </Card>
    ),
};

export const Simple: Story = {
    render: () => (
        <Card className="w-[350px]">
            <CardContent className="pt-6">
                <p>Simple card with just content.</p>
            </CardContent>
        </Card>
    ),
};

export const NoFooter: Story = {
    render: () => (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Title Only</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Content area without footer.</p>
            </CardContent>
        </Card>
    ),
};
