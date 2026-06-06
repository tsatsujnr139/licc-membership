import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

import { changelogEntryValidator } from "./lib/changelog";

export default defineSchema({
  memberApplications: defineTable({
    acceptedChrist: v.union(v.literal("yes"), v.literal("no")),
    area: v.string(),
    availableMonths: v.optional(v.string()),
    availableYearRound: v.optional(
      v.union(v.literal("yes"), v.literal("no"))
    ),
    bibleKnowledgeLevel: v.number(),
    childrenAgeGroup: v.optional(v.string()),
    christKnownDuration: v.optional(
      v.union(
        v.literal("Less than 1 year"),
        v.literal("1-3 years"),
        v.literal("4-10 years"),
        v.literal("More than 10 years")
      )
    ),
    approvedAt: v.optional(v.number()),
    approvedBy: v.optional(v.string()),
    changelog: v.optional(v.array(changelogEntryValidator)),
    clerkUserId: v.optional(v.string()),
    createdAt: v.number(),
    discipleshipLeader: v.string(),
    email: v.string(),
    finishedDiscipleship: v.union(v.literal("yes"), v.literal("no")),
    finishedOrientation: v.union(v.literal("yes"), v.literal("no")),
    firstName: v.string(),
    houseNumber: v.string(),
    loveForChildren: v.union(
      v.literal("Very Good"),
      v.literal("Good"),
      v.literal("Fair"),
      v.literal("Poor")
    ),
    maritalStatus: v.union(v.literal("Single"), v.literal("Married")),
    phoneNumbers: v.string(),
    profession: v.string(),
    registeredLicMember: v.union(v.literal("yes"), v.literal("no")),
    rejectedAt: v.optional(v.number()),
    rejectedBy: v.optional(v.string()),
    reviewNotes: v.optional(v.string()),
    reviewedAt: v.optional(v.number()),
    reviewedBy: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("approved"),
        v.literal("rejected")
      )
    ),
    street: v.string(),
    sundaySchoolChurches: v.optional(v.string()),
    sundaySchoolDuration: v.optional(v.string()),
    sundaySchoolTraining: v.union(v.literal("yes"), v.literal("no")),
    surname: v.string(),
    taughtSundaySchool: v.union(v.literal("yes"), v.literal("no")),
    title: v.union(
      v.literal("Ms"),
      v.literal("Mrs"),
      v.literal("Mr"),
      v.literal("Master"),
      v.literal("Dr"),
      v.literal("Prof")
    ),
    trainingDate: v.optional(v.string()),
    trainingDuration: v.optional(v.string()),
    trainingKind: v.optional(v.string()),
    whatsappPhoneNumber: v.string(),
  })
    .index("by_email", ["email"])
    .index("by_status", ["status"]),
});
