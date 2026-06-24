import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({
  className,
  ...props
}) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg border border-border bg-card px-2.5 py-2 text-sm text-foreground transition-colors outline-none placeholder:text-[#606060] focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:bg-[#1a1a1a]/50 disabled:opacity-50 aria-invalid:border-destructive md:text-sm",
        className
      )}
      {...props} />
  );
}

export { Textarea }
