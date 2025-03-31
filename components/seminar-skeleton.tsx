import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function SeminarSkeleton() {
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      {/* Skeleton for image */}
      <Skeleton className="h-56 w-full rounded-none" />

      {/* Skeleton for content */}
      <CardContent className="flex-grow p-6">
        <Skeleton className="h-6 w-3/4 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>

      {/* Skeleton for buttons */}
      <CardFooter className="p-6 pt-0 flex justify-end gap-3">
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-9 w-28" />
      </CardFooter>
    </Card>
  )
}

