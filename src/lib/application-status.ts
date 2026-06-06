export const applicationStatuses = ["pending", "approved", "rejected"] as const;

export type ApplicationStatus = (typeof applicationStatuses)[number];

export const applicationStatusLabels: Record<ApplicationStatus, string> = {
  approved: "Approved",
  pending: "Pending",
  rejected: "Rejected",
};

export const applicationStatusOrder: Record<ApplicationStatus, number> = {
  approved: 2,
  pending: 0,
  rejected: 1,
};

export function normalizeApplicationStatus(
  status: ApplicationStatus | undefined
): ApplicationStatus {
  return status ?? "pending";
}
