import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/ui/tooltip';
import { Button } from '@/ui/button';

const meta = {
    title: 'Components/Tooltip',
    component: Tooltip,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline">Hover me</Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>This is a tooltip</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    ),
};

export const TopPosition: Story = {
    render: () => (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline">Top</Button>
                </TooltipTrigger>
                <TooltipContent side="top">Tooltip on top</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    ),
};

export const RightPosition: Story = {
    render: () => (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline">Right</Button>
                </TooltipTrigger>
                <TooltipContent side="right">Tooltip on right</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    ),
};

export const BottomPosition: Story = {
    render: () => (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline">Bottom</Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Tooltip on bottom</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    ),
};

export const LeftPosition: Story = {
    render: () => (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline">Left</Button>
                </TooltipTrigger>
                <TooltipContent side="left">Tooltip on left</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    ),
};

export const AllPositions: Story = {
    render: () => (
        <TooltipProvider>
            <div className="flex gap-8 items-center justify-center pt-8">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline">Top</Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Top tooltip</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline">Right</Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">Right tooltip</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline">Bottom</Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Bottom tooltip</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline">Left</Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">Left tooltip</TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    ),
};
