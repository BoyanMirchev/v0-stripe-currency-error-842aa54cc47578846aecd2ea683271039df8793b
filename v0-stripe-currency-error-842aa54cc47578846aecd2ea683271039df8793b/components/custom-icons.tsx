import React from "react"

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string
}

export const LockIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M17.5 9V7a5.5 5.5 0 1 0-11 0v2H4v12.5h16V9zM7.5 7a4.5 4.5 0 0 1 9 0v2h-9zM19 20.5H5V10h14z" />
    <path d="M11.5 14v3h1v-3h-1z" />
  </svg>
)

export const ShoppingCartIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M20 17H8.52L5 3.38H2v1h2.19l3.51 13.62H20v-1zM9.91 20a1.41 1.41 0 1 0 0 2.82 1.41 1.41 0 0 0 0-2.82zM17.41 20a1.41 1.41 0 1 0 .01 2.82A1.41 1.41 0 0 0 17.4 20zM8.09 16l-.39-1.53L20 11.89V6H7.23l-.65-2.53H5v1h.82L9.08 17H20v-1H8.09z" />
  </svg>
)

export const PlusIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M19 12h-6V6h-1v6H6v1h6v6h1v-6h6v-1z" />
  </svg>
)

export const MinusIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M6 12h13v1H6v-1z" />
  </svg>
)

export const CloseIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M18.01 7.01l-.71-.71-5.3 5.3-5.29-5.3-.71.71 5.3 5.29-5.3 5.29.71.71 5.29-5.3 5.3 5.3.71-.71-5.3-5.29 5.3-5.29z" />
  </svg>
)

export const ArrowRightIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M15.53 17a.5.5 0 0 1-.35-.85l3.14-3.15H4.53a.5.5 0 0 1 0-1h13.79l-3.14-3.15a.5.5 0 0 1 .71-.71l4 4a.5.5 0 0 1 0 .71l-4 4a.5.5 0 0 1-.36.15z" />
  </svg>
)

export const PhoneIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M19.42 15l-3-1a.49.49 0 0 0-.51.13L14 16.09a12.64 12.64 0 0 1-6-6l1.93-1.93a.49.49 0 0 0 .13-.51l-1-3A.5.5 0 0 0 8.57 4H5a.5.5 0 0 0-.5.54 15.5 15.5 0 0 0 15 14.95.5.5 0 0 0 .5-.5v-3.52a.5.5 0 0 0-.58-.47zM19 18.49a14.51 14.51 0 0 1-14-14h3.32l.81 2.41L7 9a.5.5 0 0 0-.14.35A13.67 13.67 0 0 0 14.61 17a.5.5 0 0 0 .35-.14l2.12-2.12 2.41.81z" />
  </svg>
)

export const ShieldCheckIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M12 21.35a.47.47 0 0 1-.22-.05C11.45 21.13 3 16.82 3 9.5V4.29l9-2.57 9 2.57V9.5c0 7.32-8.45 11.63-8.78 11.8a.47.47 0 0 1-.22.05zM4 4.94V9.5c0 6.22 6.77 10.14 8 10.82 1.23-.68 8-4.6 8-10.82V4.94l-8-2.29z" />
    <path d="M11 14.5l-2.85-2.85.71-.71L11 13.09l4.15-4.15.71.71L11 14.5z" />
  </svg>
)

export const ChevronDownIcon = ({ className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M12 15a.47.47 0 0 1-.35-.15l-5-5 .7-.7L12 13.79l4.65-4.64.7.7-5 5A.47.47 0 0 1 12 15z" />
  </svg>
)
