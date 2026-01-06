import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
 
className={cn(
  "flex w-full h-12 px-4 py-2 rounded-md text-sm",
  "border border-gray-300 bg-white text-gray-900",
  "placeholder:text-gray-400",
  "focus:outline-none focus:border-gray-400",
  "transition-colors duration-150",

  
  "read-only:bg-gray-100 read-only:text-gray-700",
  "read-only:cursor-default read-only:border-gray-300",

 
  "read-only:focus:border-gray-300",

  
  "disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70",

  className
)}


      {...props}
    />
  )
}

export { Input }
