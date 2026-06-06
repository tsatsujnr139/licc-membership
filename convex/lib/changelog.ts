import type { UserIdentity } from "convex/server";
import { v } from "convex/values";

export const changelogEntryValidator = v.object({
  description: v.string(),
  timestamp: v.number(),
  userId: v.string(),
  userName: v.optional(v.string()),
});

export type ChangelogEntry = {
  description: string;
  timestamp: number;
  userId: string;
  userName?: string;
};

export const getChangelogUserName = (
  identity: UserIdentity | null | undefined,
  userId: string
): string => {
  if (userId === "anonymous") {
    return "Anonymous";
  }

  if (identity) {
    const name =
      typeof identity.name === "string" && identity.name.length > 0
        ? identity.name
        : undefined;
    const email =
      typeof identity.email === "string" && identity.email.length > 0
        ? identity.email
        : undefined;

    return name ?? email ?? identity.subject;
  }

  return userId || "Unknown user";
};

export const formatChangelogActorLabel = (entry: ChangelogEntry): string =>
  entry.userName ??
  (entry.userId === "anonymous" ? "Anonymous" : entry.userId || "Unknown user");

export const appendChangelogEntry = (
  existing: ChangelogEntry[] | undefined,
  entry: ChangelogEntry
): ChangelogEntry[] => [...(existing ?? []), entry];
