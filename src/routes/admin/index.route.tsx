import { RedirectToSignIn, SignedIn, UserButton } from "@clerk/clerk-react";
import { createFileRoute } from "@tanstack/react-router";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { Loader2Icon } from "lucide-react";

import { ApplicationsDashboard } from "@/components/admin/applications-dashboard";
import { SiteLogo } from "@/components/site-logo";

const isBoneyardBuild =
  typeof window !== "undefined" &&
  (window as Window & { __BONEYARD_BUILD?: boolean }).__BONEYARD_BUILD === true;

const AdminApplicationsPage = () => (
  <main className="page-wrap flex flex-col gap-8 py-10">
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col items-start gap-3">
        <SiteLogo className="size-12" />
        <p className="island-kicker">
          Legon Interdenominational Church Children&apos;s Ministry
        </p>
      </div>
      {isBoneyardBuild ? null : (
        <SignedIn>
          <UserButton />
        </SignedIn>
      )}
    </div>

    {isBoneyardBuild ? (
      <ApplicationsDashboard />
    ) : (
      <>
        <Unauthenticated>
          <RedirectToSignIn />
        </Unauthenticated>
        <AuthLoading>
          <div
            aria-label="Connecting to Convex"
            className="flex items-center justify-center py-8"
            role="status"
          >
            <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
          </div>
        </AuthLoading>
        <Authenticated>
          <ApplicationsDashboard />
        </Authenticated>
      </>
    )}
  </main>
);

export const Route = createFileRoute("/admin/")({
  component: AdminApplicationsPage,
});
