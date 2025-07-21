import React from "react";
import {cn} from "@/utils/functions/mergeClasses";


interface SlideStackProps extends React.HTMLAttributes<HTMLDivElement>  {
  children: React.ReactNode
}

const SlideStack = React.forwardRef<HTMLDivElement, SlideStackProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('w-full h-full', className)} {...props}>{children}</div>
  )
)
SlideStack.displayName = 'SlideStack';

export {SlideStack}