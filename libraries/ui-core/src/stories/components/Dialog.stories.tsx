import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/ui/dialog';
import { Button } from '@/ui/button';

const meta = {
    title: 'Components/Dialog',
    component: Dialog,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Dialog Title</DialogTitle>
                    <DialogDescription>
                        This is a dialog description. You can add content here.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <p>Your content goes here.</p>
                </div>
                <DialogFooter>
                    <Button type="submit">Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ),
};

export const ConfirmDialog: Story = {
    render: () => (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructive">Delete Item</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete the item
                        from our servers.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button variant="destructive">Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ),
};

export const FormDialog: Story = {
    render: () => (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Create Item</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Item</DialogTitle>
                    <DialogDescription>
                        Fill in the form below to create a new item.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <input
                        type="text"
                        placeholder="Item name"
                        className="w-full px-3 py-2 border rounded-md"
                    />
                    <textarea
                        placeholder="Description"
                        className="w-full px-3 py-2 border rounded-md"
                        rows={3}
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ),
};
