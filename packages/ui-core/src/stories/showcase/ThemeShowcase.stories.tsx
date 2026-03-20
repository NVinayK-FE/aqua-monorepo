import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "@/ui/button"
import { Badge } from "@/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card"
import { Input } from "@/ui/input"

const themes = [
    { name: "Base", attr: "" },
    { name: "Web", attr: "web" },
    { name: "Dashboard", attr: "dashboard" },
]

function AllThemes({ children }: { children: (theme: string) => React.ReactNode }) {
    return (
        <div className="flex gap-8 flex-wrap">
            {themes.map(({ name, attr }) => (
                <div key={name} data-theme={attr || undefined} className="p-6 rounded-xl border space-y-3 min-w-[200px] bg-background text-foreground">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{name}</p>
                    {children(attr)}
                </div>
            ))}
        </div>
    )
}

const meta: Meta = {
    title: "Showcase/All Themes",
    parameters: { layout: "fullscreen" },
}
export default meta

export const Buttons: StoryObj = {
    render: () => (
        <AllThemes>
            {() => (
                <div className="flex flex-col gap-2">
                    <Button>Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                </div>
            )}
        </AllThemes>
    ),
}

export const Cards: StoryObj = {
    render: () => (
        <AllThemes>
            {() => (
                <Card>
                    <CardHeader><CardTitle>Card Title</CardTitle></CardHeader>
                    <CardContent>
                        <Input placeholder="Enter value..." />
                        <Button className="mt-2 w-full">Submit</Button>
                    </CardContent>
                </Card>
            )}
        </AllThemes>
    ),
}