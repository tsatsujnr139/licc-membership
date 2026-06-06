import { useUser } from "@clerk/clerk-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type SessionDebugInfo = {
  configuredAdminEmails: string[];
  configuredAdminUserIds: string[];
  identityEmail: string | null;
  identityName: string | null;
  identitySubject: string | null;
  isAuthenticated: boolean;
};

type AccessDeniedAlertProps = {
  debug?: SessionDebugInfo;
  message: string;
};

export const AccessDeniedAlert = ({
  debug,
  message,
}: AccessDeniedAlertProps) => {
  const { user } = useUser();

  return (
    <Alert variant="destructive">
      <AlertTitle>Access denied</AlertTitle>
      <AlertDescription>
        <div className="flex flex-col gap-3">
          <p>{message}</p>
          <div className="flex flex-col gap-1 text-sm">
            <p className="font-medium">Clerk account</p>
            <p>Email: {user?.primaryEmailAddress?.emailAddress ?? "Unknown"}</p>
            <p>User ID: {user?.id ?? "Unknown"}</p>
          </div>
          {debug ? (
            <div className="flex flex-col gap-1 text-sm">
              <p className="font-medium">Convex session</p>
              <p>
                Authenticated: {debug.isAuthenticated ? "Yes" : "No"}
              </p>
              <p>Email claim: {debug.identityEmail ?? "Missing"}</p>
              <p>Clerk user ID: {debug.identitySubject ?? "Missing"}</p>
              <p>
                Allowed emails:{" "}
                {debug.configuredAdminEmails.length > 0
                  ? debug.configuredAdminEmails.join(", ")
                  : "None configured"}
              </p>
              <p>
                Allowed user IDs:{" "}
                {debug.configuredAdminUserIds.length > 0
                  ? debug.configuredAdminUserIds.join(", ")
                  : "None configured"}
              </p>
            </div>
          ) : null}
          <p className="text-sm">
            Quick fix: copy your Clerk user ID above into{" "}
            <code className="rounded bg-muted px-1 py-0.5">ADMIN_CLERK_USER_IDS</code>{" "}
            in the Convex dashboard, or add the email claim in Clerk Sessions
            custom claims.
          </p>
        </div>
      </AlertDescription>
    </Alert>
  );
};
