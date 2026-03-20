import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioGroup, RadioGroupItem } from '@/ui/radio-group';
import { Label } from '@/ui/label';

const meta = {
    title: 'Components/RadioGroup',
    component: RadioGroup,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <RadioGroup defaultValue="option1">
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="option1" id="option1" />
                <Label htmlFor="option1">Option 1</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="option2" id="option2" />
                <Label htmlFor="option2">Option 2</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="option3" id="option3" />
                <Label htmlFor="option3">Option 3</Label>
            </div>
        </RadioGroup>
    ),
};

export const Vertical: Story = {
    render: () => (
        <RadioGroup defaultValue="yes">
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">No</Label>
            </div>
        </RadioGroup>
    ),
};

export const Disabled: Story = {
    render: () => (
        <RadioGroup defaultValue="option1">
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="option1" id="opt1" />
                <Label htmlFor="opt1">Option 1</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="option2" id="opt2" disabled />
                <Label htmlFor="opt2">Option 2 (Disabled)</Label>
            </div>
        </RadioGroup>
    ),
};
