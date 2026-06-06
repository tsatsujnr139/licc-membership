import { v } from "convex/values";

import { mutation } from "./_generated/server";

const titleValidator = v.union(
  v.literal("Ms"),
  v.literal("Mrs"),
  v.literal("Mr"),
  v.literal("Master"),
  v.literal("Dr"),
  v.literal("Prof")
);

const loveForChildrenValidator = v.union(
  v.literal("Very Good"),
  v.literal("Good"),
  v.literal("Fair"),
  v.literal("Poor")
);

const yesNoValidator = v.union(v.literal("yes"), v.literal("no"));

const maritalStatusValidator = v.union(
  v.literal("Single"),
  v.literal("Married")
);

const christKnownDurationValidator = v.union(
  v.literal("Less than 1 year"),
  v.literal("1-3 years"),
  v.literal("4-10 years"),
  v.literal("More than 10 years")
);

export const submit = mutation({
  args: {
    acceptedChrist: yesNoValidator,
    area: v.string(),
    availableMonths: v.optional(v.string()),
    availableYearRound: yesNoValidator,
    bibleKnowledgeLevel: v.number(),
    childrenAgeGroup: v.optional(v.string()),
    christKnownDuration: v.optional(christKnownDurationValidator),
    discipleshipLeader: v.string(),
    email: v.string(),
    finishedDiscipleship: yesNoValidator,
    finishedOrientation: yesNoValidator,
    firstName: v.string(),
    houseNumber: v.string(),
    loveForChildren: loveForChildrenValidator,
    maritalStatus: maritalStatusValidator,
    phoneNumbers: v.string(),
    profession: v.string(),
    registeredLicMember: yesNoValidator,
    street: v.string(),
    sundaySchoolChurches: v.optional(v.string()),
    sundaySchoolDuration: v.optional(v.string()),
    sundaySchoolTraining: yesNoValidator,
    surname: v.string(),
    taughtSundaySchool: yesNoValidator,
    title: titleValidator,
    trainingDate: v.optional(v.string()),
    trainingDuration: v.optional(v.string()),
    trainingKind: v.optional(v.string()),
    whatsappPhoneNumber: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const createdAt = Date.now();

    return await ctx.db.insert("memberApplications", {
      ...args,
      clerkUserId: identity?.subject,
      createdAt,
      status: "pending",
    });
  },
});
