import { cn } from "../utils/cn"
export default function LoadingSpinner({
  className,
  fullPage = false,
}: {
  className?: string
  fullPage?: boolean
}) {
  const spinner = (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  )

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        {spinner}
      </div>
    )
  }

  return spinner
}