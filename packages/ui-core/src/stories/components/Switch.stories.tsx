import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from '@/ui/switch';
import { Label } from '@/ui/label';

const meta = {
    title: 'Components/Switch',
    component: Switch,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => <Switch />,
};

export const Checked: Story = {
    render: () => <Switch defaultChecked />,
};

export const Disabled: Story = {
    render: () => <Switch disabled />,
};

export const DisabledChecked: Story = {
    render: () => <Switch disabled defaultChecked />,
};

export const WithLabel: Story = {
    render: () => (
        <div className="flex items-center space-x-2">
            <Switch id="airplane-mode" />
            <Label htmlFor="airplane-mode">Airplane Mode</Label>
        </div>
    ),
};

export const Multiple: Story = {
    render: () => (
        <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
                <Switch id="notifications" defaultChecked />
                <Label htmlFor="notifications">Notifications</Label>
            </div>
            <div className="flex items-center space-x-2">
                <Switch id="emails" />
                <Label htmlFor="emails">Email Updates</Label>
            </div>
            <div className="flex items-center space-x-2">
                <Switch id="marketing" disabled />
                <Label htmlFor="marketing">Marketing (Disabled)</Label>
            </div>
        </div>
    ),
};
