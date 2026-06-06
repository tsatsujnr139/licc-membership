import { createFileRoute } from "@tanstack/react-router";

import { PersonalDetailsForm } from "@/components/personal-details-form";
import { SiteLogo } from "@/components/site-logo";

const ApplyPage = () => (
  <main className="page-wrap flex flex-col gap-8 py-10">
    <div className="flex flex-col items-center gap-4 text-center">
      <SiteLogo />
      <p className="island-kicker">
        Legon Interdenominational Church Children&apos;s Ministry
      </p>
      <h1 className="display-title text-3xl font-bold tracking-tight md:text-4xl">
        Membership Form
      </h1>
      <p className="text-muted-foreground">
        Complete the form to submit your membership application.
      </p>
    </div>
    <PersonalDetailsForm />
  </main>
);

export const Route = createFileRoute("/apply")({
  component: ApplyPage,
});
