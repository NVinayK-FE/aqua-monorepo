import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';

type TabsStoryArgs = {
    listVariant?: 'default' | 'outline' | 'ghost';
    listSize?: 'sm' | 'default' | 'lg';
    triggerVariant?: 'default' | 'underline';
    triggerSize?: 'sm' | 'default' | 'lg';
};

const meta = {
    title: 'Components/Tabs',
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
    argTypes: {
        listVariant: {
            control: 'select',
            options: ['default', 'outline', 'ghost'],
        },
        listSize: {
            control: 'select',
            options: ['sm', 'default', 'lg'],
        },
        triggerVariant: {
            control: 'select',
            options: ['default', 'underline'],
        },
        triggerSize: {
            control: 'select',
            options: ['sm', 'default', 'lg'],
        },
    },
    args: {
        listVariant: 'default',
        listSize: 'default',
        triggerVariant: 'default',
        triggerSize: 'default',
    },
} satisfies Meta<TabsStoryArgs>;

export default meta;
type Story = StoryObj<TabsStoryArgs>;

export const Default: Story = {
    render: ({ listVariant, listSize, triggerVariant, triggerSize }) => (
        <Tabs defaultValue="tab1" className="w-100">
            <TabsList variant={listVariant} size={listSize}>
                <TabsTrigger value="tab1" variant={triggerVariant} size={triggerSize}>Tab 1</TabsTrigger>
                <TabsTrigger value="tab2" variant={triggerVariant} size={triggerSize}>Tab 2</TabsTrigger>
                <TabsTrigger value="tab3" variant={triggerVariant} size={triggerSize}>Tab 3</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">Content for Tab 1</TabsContent>
            <TabsContent value="tab2">Content for Tab 2</TabsContent>
            <TabsContent value="tab3">Content for Tab 3</TabsContent>
        </Tabs>
    ),
};

export const manyTabs: Story = {
    render: () => (
        <Tabs defaultValue="home" className="w-100">
            <TabsList>
                <TabsTrigger value="home">Home</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="help">Help</TabsTrigger>
            </TabsList>
            <TabsContent value="home">This is the home tab content.</TabsContent>
            <TabsContent value="profile">This is the profile tab content.</TabsContent>
            <TabsContent value="settings">This is the settings tab content.</TabsContent>
            <TabsContent value="help">This is the help tab content.</TabsContent>
        </Tabs>
    ),
};

export const WithDescriptions: Story = {
    render: () => (
        <Tabs defaultValue="account" className="w-100">
            <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="account" className="space-y-3">
                <div className="space-y-1">
                    <p className="font-semibold">Username</p>
                    <p className="text-sm text-muted-foreground">john_doe</p>
                </div>
                <div className="space-y-1">
                    <p className="font-semibold">Email</p>
                    <p className="text-sm text-muted-foreground">john@example.com</p>
                </div>
            </TabsContent>
            <TabsContent value="password" className="space-y-3">
                <p className="text-sm">Update your password here.</p>
            </TabsContent>
        </Tabs>
    ),
};
