import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from '@/ui/checkbox';
import { Label } from '@/ui/label';

const meta = {
    title: 'Components/Checkbox',
    component: Checkbox,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => <Checkbox />,
};

export const Checked: Story = {
    render: () => <Checkbox defaultChecked />,
};

export const Disabled: Story = {
    render: () => <Checkbox disabled />,
};

export const DisabledChecked: Story = {
    render: () => <Checkbox disabled defaultChecked />,
};

export const WithLabel: Story = {
    render: () => (
        <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms">I agree to the terms and conditions</Label>
        </div>
    ),
};

export const Multiple: Story = {
    render: () => (
        <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
                <Checkbox id="option1" />
                <Label htmlFor="option1">Option 1</Label>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox id="option2" />
                <Label htmlFor="option2">Option 2</Label>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox id="option3" disabled />
                <Label htmlFor="option3">Option 3 (Disabled)</Label>
            </div>
        </div>
    ),
};
