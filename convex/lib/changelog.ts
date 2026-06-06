import { v } from "convex/values";

export const changelogEntryValidator = v.object({
  description: v.string(),
  timestamp: v.number(),
  userId: v.string(),
});

export type ChangelogEntry = {
  description: string;
  timestamp: number;
  userId: string;
};

export const appendChangelogEntry = (
  existing: ChangelogEntry[] | undefined,
  entry: ChangelogEntry
): ChangelogEntry[] => [...(existing ?? []), entry];
