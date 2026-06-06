import { v } from "convex/values";

import type { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { appendChangelogEntry, getChangelogUserName } from "./lib/changelog";
import { checkAdminAccess, requireAdmin } from "./lib/auth";

type ApplicationStatus = "pending" | "approved" | "rejected";

type MemberApplication = Doc<"memberApplications">;

type MemberApplicationWithStatus = MemberApplication & {
  status: ApplicationStatus;
};

const statusOrder: Record<ApplicationStatus, number> = {
  approved: 2,
  pending: 0,
  rejected: 1,
};

const normalizeStatus = (
  status: ApplicationStatus | undefined
): ApplicationStatus => status ?? "pending";

export const canAccess = query({
  args: {},
  handler: async (ctx) => {
    const access = await checkAdminAccess(ctx);

    if (!access.allowed) {
      return {
        allowed: false as const,
        debug: access.debug,
        message: access.message,
      };
    }

    return { allowed: true as const };
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const submissions = await ctx.db
      .query("memberApplications")
      .order("desc")
      .collect();

    return submissions
      .map(
        (submission): MemberApplicationWithStatus => ({
          ...submission,
          status: normalizeStatus(submission.status),
        })
      )
      .sort((left, right) => {
        const statusDiff = statusOrder[left.status] - statusOrder[right.status];

        if (statusDiff !== 0) {
          return statusDiff;
        }

        return right.createdAt - left.createdAt;
      });
  },
});

export const stats = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const submissions = await ctx.db.query("memberApplications").collect();

    let pending = 0;
    let approved = 0;
    let rejected = 0;

    for (const submission of submissions) {
      const status = normalizeStatus(submission.status);

      if (status === "pending") {
        pending += 1;
      } else if (status === "approved") {
        approved += 1;
      } else {
        rejected += 1;
      }
    }

    return {
      approved,
      pending,
      rejected,
      total: submissions.length,
    };
  },
});

export const review = mutation({
  args: {
    applicationId: v.id("memberApplications"),
    notes: v.optional(v.string()),
    status: v.union(v.literal("approved"), v.literal("rejected")),
  },
  handler: async (ctx, args) => {
    const identity = await requireAdmin(ctx);

    if (args.status === "rejected" && !args.notes?.trim()) {
      throw new Error("A reason is required when rejecting an application.");
    }

    const application = await ctx.db.get(args.applicationId);

    if (!application) {
      throw new Error("Application not found.");
    }

    const now = Date.now();
    const actorId = identity.subject;
    const actorLabel = identity.email ?? identity.subject;
    const trimmedNotes = args.notes?.trim();

    const description =
      args.status === "approved"
        ? trimmedNotes
          ? `Application approved. Notes: ${trimmedNotes}`
          : "Application approved"
        : trimmedNotes
          ? `Application rejected. Reason: ${trimmedNotes}`
          : "Application rejected";

    const changelog = appendChangelogEntry(application.changelog, {
      description,
      timestamp: now,
      userId: actorId,
      userName: getChangelogUserName(identity, actorId),
    });

    if (args.status === "approved") {
      await ctx.db.patch(args.applicationId, {
        approvedAt: now,
        approvedBy: actorLabel,
        changelog,
        reviewNotes: trimmedNotes || undefined,
        status: "approved",
      });
      return args.applicationId;
    }

    await ctx.db.patch(args.applicationId, {
      changelog,
      rejectedAt: now,
      rejectedBy: actorLabel,
      reviewNotes: trimmedNotes,
      status: "rejected",
    });

    return args.applicationId;
  },
});
