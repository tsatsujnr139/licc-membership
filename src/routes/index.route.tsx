import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteLogo } from "@/components/site-logo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main className="page-wrap flex flex-col gap-8 py-16">
      <div className="island-shell rise-in flex flex-col items-center gap-6 rounded-2xl p-8 md:p-12">
        <SiteLogo className="w-32" />
        <p className="island-kicker">
          Legon Interdenominational Church Children&apos;s Ministry
        </p>
        <h1 className="display-title text-4xl font-bold tracking-tight md:text-5xl">
          Membership Application
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Complete the form to share a bit about your background and
          availability with the ministry leadership
        </p>
        <div>
          <Button asChild size="lg">
            <Link to="/apply">Start Application</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
