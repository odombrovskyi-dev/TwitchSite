import React from "react"

interface BadgeProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Badge = React.forwardRef<HTMLButtonElement, BadgeProps>(
  ({ className = "", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}
      {...props}
    />
  )
)
Badge.displayName = "Badge"

export { Badge }
