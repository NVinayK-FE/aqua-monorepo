import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';

type SelectStoryArgs = {
    triggerVariant?: 'default' | 'filled' | 'ghost';
    triggerSize?: 'sm' | 'default' | 'lg';
};

const meta = {
    title: 'Components/Select',
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
    argTypes: {
        triggerVariant: {
            control: 'select',
            options: ['default', 'filled', 'ghost'],
        },
        triggerSize: {
            control: 'select',
            options: ['sm', 'default', 'lg'],
        },
    },
    args: {
        triggerVariant: 'default',
        triggerSize: 'default',
    },
} satisfies Meta<SelectStoryArgs>;

export default meta;
type Story = StoryObj<SelectStoryArgs>;

export const Default: Story = {
    render: ({ triggerVariant, triggerSize }) => (
        <Select>
            <SelectTrigger className="w-45" variant={triggerVariant} size={triggerSize}>
                <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
            </SelectContent>
        </Select>
    ),
};

export const FruitSelect: Story = {
    render: ({ triggerVariant, triggerSize }) => (
        <Select>
            <SelectTrigger className="w-50" variant={triggerVariant} size={triggerSize}>
                <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
                <SelectItem value="grape">Grape</SelectItem>
                <SelectItem value="strawberry">Strawberry</SelectItem>
            </SelectContent>
        </Select>
    ),
};

export const Disabled: Story = {
    render: ({ triggerVariant, triggerSize }) => (
        <Select disabled>
            <SelectTrigger className="w-45" variant={triggerVariant} size={triggerSize}>
                <SelectValue placeholder="Disabled select" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
            </SelectContent>
        </Select>
    ),
};

export const WithDefault: Story = {
    render: ({ triggerVariant, triggerSize }) => (
        <Select defaultValue="summer">
            <SelectTrigger className="w-45" variant={triggerVariant} size={triggerSize}>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="spring">Spring</SelectItem>
                <SelectItem value="summer">Summer</SelectItem>
                <SelectItem value="fall">Fall</SelectItem>
                <SelectItem value="winter">Winter</SelectItem>
            </SelectContent>
        </Select>
    ),
};

export const LargeList: Story = {
    render: ({ triggerVariant, triggerSize }) => (
        <Select>
            <SelectTrigger className="w-50" variant={triggerVariant} size={triggerSize}>
                <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
                <SelectItem value="fr">France</SelectItem>
                <SelectItem value="de">Germany</SelectItem>
                <SelectItem value="jp">Japan</SelectItem>
                <SelectItem value="cn">China</SelectItem>
                <SelectItem value="in">India</SelectItem>
                <SelectItem value="br">Brazil</SelectItem>
            </SelectContent>
        </Select>
    ),
};

export const AllTriggerVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-4 w-64">
            <Select>
                <SelectTrigger variant="default">
                    <SelectValue placeholder="Default" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="one">One</SelectItem>
                </SelectContent>
            </Select>
            <Select>
                <SelectTrigger variant="filled">
                    <SelectValue placeholder="Filled" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="one">One</SelectItem>
                </SelectContent>
            </Select>
            <Select>
                <SelectTrigger variant="ghost">
                    <SelectValue placeholder="Ghost" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="one">One</SelectItem>
                </SelectContent>
            </Select>
        </div>
    ),
};

export const AllTriggerSizes: Story = {
    render: () => (
        <div className="flex flex-col gap-4 w-64">
            <Select>
                <SelectTrigger size="sm">
                    <SelectValue placeholder="Small" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="one">One</SelectItem>
                </SelectContent>
            </Select>
            <Select>
                <SelectTrigger size="default">
                    <SelectValue placeholder="Default" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="one">One</SelectItem>
                </SelectContent>
            </Select>
            <Select>
                <SelectTrigger size="lg">
                    <SelectValue placeholder="Large" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="one">One</SelectItem>
                </SelectContent>
            </Select>
        </div>
    ),
};
