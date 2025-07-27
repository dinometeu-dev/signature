import React from 'react'
import { cn } from '@/utils/functions/mergeClasses'

const ProfileCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        `bg-white shadow-lg rounded-lg p-6 flex flex-col items-center`,
        className
      )}
      {...props}
    >
      <h2 className="text-2xl font-bold mb-4">Profile Card</h2>
      <p className="text-gray-600">This is a profile card component.</p>
    </div>
  )
})

ProfileCard.displayName = 'ProfileCard'

export { ProfileCard }
