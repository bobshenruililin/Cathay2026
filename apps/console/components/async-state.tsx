import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingBlock({ label }: { label: string }) {
  return (
    <div className="flex flex-col gap-2 p-4" role="status" aria-live="polite">
      <p className="text-sm text-muted-foreground">{label}</p>
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-5/6" />
      <Skeleton className="h-8 w-4/6" />
    </div>
  );
}

export function EmptyBlock({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-1 p-6 text-center">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-sm text-muted-foreground">{detail}</p>
    </div>
  );
}

export function ErrorBlock({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
      <p className="text-sm font-medium text-destructive">Something went wrong</p>
      <p className="text-sm text-muted-foreground">{message}</p>
      {onRetry ? (
        <Button type="button" variant="outline" onClick={onRetry}>
          Retry
        </Button>
      ) : null}
    </div>
  );
}
