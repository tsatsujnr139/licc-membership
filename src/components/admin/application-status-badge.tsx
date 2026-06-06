import { Badge } from "@/components/ui/badge";
import { applicationStatusLabels } from "@/lib/application-status";
import type { ApplicationStatus } from "@/lib/application-status";
import { cn } from "@/lib/utils";

const statusClassName: Record<ApplicationStatus, string> = {
  approved:
    "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200",
  pending:
    "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
  rejected:
    "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200",
};

export const ApplicationStatusBadge = ({
  status,
}: {
  status: ApplicationStatus;
}) => (
  <Badge className={cn(statusClassName[status])} variant="outline">
    {applicationStatusLabels[status]}
  </Badge>
);
