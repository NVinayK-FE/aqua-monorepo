import type { Meta, StoryObj } from '@storybook/react-vite';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { useForm } from 'react-hook-form';

const meta = {
    title: 'Components/Form',
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicForm: Story = {
    render: () => {
        const form = useForm({
            defaultValues: {
                username: '',
                email: '',
            },
        });

        return (
            <Form {...form}>
                <form className="w-64 space-y-4">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter username" {...field} />
                                </FormControl>
                                <FormDescription>This is your public display name.</FormDescription>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter email" type="email" {...field} />
                                </FormControl>
                                <FormDescription>We'll send confirmation to this email.</FormDescription>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full">
                        Submit
                    </Button>
                </form>
            </Form>
        );
    },
};

export const RegistrationForm: Story = {
    render: () => {
        const form = useForm({
            defaultValues: {
                firstName: '',
                lastName: '',
                email: '',
                password: '',
            },
        });

        return (
            <Form {...form}>
                <form className="w-80 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Doe" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="john@example.com" type="email" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="••••••••" type="password" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full">
                        Create Account
                    </Button>
                </form>
            </Form>
        );
    },
};
