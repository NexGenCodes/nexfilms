import { Alert, AlertDescription } from "@/components/ui/alert";

interface Props {
  state?: {
    error?: string;
    success?: boolean;
  };
}

export function AlertMessage({ state }: Props) {
  if (!state) return null;

  if (state.error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription>{state.error}</AlertDescription>
      </Alert>
    );
  }

  if (state.success) {
    return (
      <Alert className="mb-4 bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-50">
        <AlertDescription>{state.success}</AlertDescription>
      </Alert>
    );
  }

  return null;
}
