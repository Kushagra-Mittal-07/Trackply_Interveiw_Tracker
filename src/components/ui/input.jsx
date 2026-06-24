import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  ...props
}) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-lg border border-border bg-card px-2.5 py-1 text-sm text-foreground placeholder:text-[#606060] transition-colors outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-[#1a1a1a]/50 disabled:opacity-50 aria-invalid:border-destructive md:text-sm",
        className
      )}
      {...props} />
  );
}

export { Input }
