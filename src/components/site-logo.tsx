import { cn } from "@/lib/utils";

interface SiteLogoProps {
  className?: string;
}

export const SiteLogo = ({ className }: SiteLogoProps) => (
  <img
    alt="Legon International Church Logo"
    className={cn("h-auto w-12 object-contain", className)}
    height={12}
    src="/lic-logo.png"
    width={12}
  />
);
