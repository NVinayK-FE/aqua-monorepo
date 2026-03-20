import type { Meta, StoryObj } from '@storybook/react-vite';
import { Popover, PopoverTrigger, PopoverContent } from '@/ui/popover';
import { Button } from '@/ui/button';

const meta = {
    title: 'Components/Popover',
    component: Popover,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">Open Popover</Button>
            </PopoverTrigger>
            <PopoverContent>
                <div className="space-y-2">
                    <h4 className="font-medium">Popover Title</h4>
                    <p className="text-sm text-muted-foreground">
                        This is a popover with some content.
                    </p>
                </div>
            </PopoverContent>
        </Popover>
    ),
};

export const LeftPosition: Story = {
    render: () => (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">Left</Button>
            </PopoverTrigger>
            <PopoverContent side="left" className="w-80">
                <div className="space-y-2">
                    <h4 className="font-medium">Popover on Left</h4>
                    <p className="text-sm">This popover is positioned to the left.</p>
                </div>
            </PopoverContent>
        </Popover>
    ),
};

export const RightPosition: Story = {
    render: () => (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">Right</Button>
            </PopoverTrigger>
            <PopoverContent side="right" className="w-80">
                <div className="space-y-2">
                    <h4 className="font-medium">Popover on Right</h4>
                    <p className="text-sm">This popover is positioned to the right.</p>
                </div>
            </PopoverContent>
        </Popover>
    ),
};

export const WithForm: Story = {
    render: () => (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">Open Settings</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Settings</h4>
                        <p className="text-sm text-muted-foreground">
                            Configure your preferences.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" id="notifications" defaultChecked />
                            <label htmlFor="notifications" className="text-sm">
                                Enable notifications
                            </label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" id="emails" />
                            <label htmlFor="emails" className="text-sm">
                                Receive emails
                            </label>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    ),
};
