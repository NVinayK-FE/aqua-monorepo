import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const textareaVariants = cva(
  "flex w-full rounded-md border ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input bg-background",
        filled: "border-transparent bg-muted",
        ghost: "border-transparent bg-transparent shadow-none",
      },
      size: {
        sm: "min-h-[70px] px-3 py-1.5 text-sm",
        default: "min-h-[80px] px-3 py-2 text-base md:text-sm",
        lg: "min-h-[110px] px-4 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface TextareaProps
  extends React.ComponentProps<"textarea">,
  VariantProps<typeof textareaVariants> { }

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(({ className, variant, size, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        textareaVariants({ variant, size }),
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea, textareaVariants }
