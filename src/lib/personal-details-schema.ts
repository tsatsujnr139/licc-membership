import { z } from "zod";

import { isValidPhoneNumber } from "@/lib/phone";

export const titleOptions = [
  "Ms",
  "Mrs",
  "Mr",
  "Master",
  "Dr",
  "Prof",
] as const;

export const loveForChildrenOptions = [
  "Very Good",
  "Good",
  "Fair",
  "Poor",
] as const;

export const yesNoOptions = ["yes", "no"] as const;

export const maritalStatusOptions = ["Single", "Married"] as const;

export const bibleKnowledgeOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export const christKnownDurationOptions = [
  "Less than 1 year",
  "1-3 years",
  "4-10 years",
  "More than 10 years",
] as const;

const phoneNumberSchema = z
  .string()
  .min(1, "Phone number is required")
  .refine(isValidPhoneNumber, "Enter a valid phone number");

export const personalDetailsSchema = z
  .object({
    acceptedChrist: z.enum(yesNoOptions, {
      message: "Please answer this question",
    }),
    area: z.string().min(1, "Area is required"),
    availableMonths: z.string().optional(),
    availableYearRound: z.enum(yesNoOptions, {
      message: "Please answer this question",
    }),
    bibleKnowledgeLevel: z
      .number()
      .min(1, "Please select a rating")
      .max(10, "Maximum is 10"),
    childrenAgeGroup: z.string().optional(),
    christKnownDuration: z.enum(christKnownDurationOptions).optional(),
    discipleshipLeader: z.string().min(1, "Discipleship leader is required"),
    email: z.string().email("Enter a valid email address"),
    finishedDiscipleship: z.enum(yesNoOptions, {
      message: "Please answer this question",
    }),
    finishedOrientation: z.enum(yesNoOptions, {
      message: "Please answer this question",
    }),
    firstName: z.string().min(1, "First name is required"),
    houseNumber: z.string().min(1, "House number is required"),
    loveForChildren: z.enum(loveForChildrenOptions, {
      message: "Please rank your love for children",
    }),
    maritalStatus: z.enum(maritalStatusOptions, {
      message: "Marital status is required",
    }),
    phoneNumbers: phoneNumberSchema,
    profession: z.string().min(1, "Profession is required"),
    registeredLicMember: z.enum(yesNoOptions, {
      message: "Please answer this question",
    }),
    street: z.string().min(1, "Street is required"),
    sundaySchoolChurches: z.string().optional(),
    sundaySchoolDuration: z.string().optional(),
    sundaySchoolTraining: z.enum(yesNoOptions, {
      message: "Please answer this question",
    }),
    surname: z.string().min(1, "Surname is required"),
    taughtSundaySchool: z.enum(yesNoOptions, {
      message: "Please answer this question",
    }),
    title: z.enum(titleOptions, { message: "Title is required" }),
    trainingDate: z.string().optional(),
    trainingDuration: z.string().optional(),
    trainingKind: z.string().optional(),
    whatsappPhoneNumber: phoneNumberSchema,
  })
  .superRefine((data, ctx) => {
    if (data.acceptedChrist === "yes" && !data.christKnownDuration) {
      ctx.addIssue({
        code: "custom",
        message: "Please select how long you have known Christ",
        path: ["christKnownDuration"],
      });
    }

    if (data.taughtSundaySchool === "yes") {
      if (!data.sundaySchoolDuration?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Please indicate how long you taught",
          path: ["sundaySchoolDuration"],
        });
      }
      if (!data.childrenAgeGroup?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Please indicate the age group",
          path: ["childrenAgeGroup"],
        });
      }
      if (!data.sundaySchoolChurches?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Please indicate which church(es)",
          path: ["sundaySchoolChurches"],
        });
      }
    }

    if (data.availableYearRound === "no" && !data.availableMonths?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Please indicate your availability",
        path: ["availableMonths"],
      });
    }

    if (data.sundaySchoolTraining === "yes") {
      if (!data.trainingDate?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Please indicate when the training was",
          path: ["trainingDate"],
        });
      }
      if (!data.trainingKind?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Please indicate the kind of training",
          path: ["trainingKind"],
        });
      }
      if (!data.trainingDuration?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Please indicate the duration of training",
          path: ["trainingDuration"],
        });
      }
    }
  });

export type PersonalDetailsFormValues = z.infer<typeof personalDetailsSchema>;

export type YesNoFieldName = Extract<
  keyof PersonalDetailsFormValues,
  | "acceptedChrist"
  | "availableYearRound"
  | "registeredLicMember"
  | "finishedOrientation"
  | "finishedDiscipleship"
  | "taughtSundaySchool"
  | "sundaySchoolTraining"
>;

export const defaultFormValues: PersonalDetailsFormValues = {
  acceptedChrist: "yes",
  area: "",
  availableMonths: "",
  availableYearRound: "yes",
  bibleKnowledgeLevel: 3,
  childrenAgeGroup: "",
  christKnownDuration: undefined,
  discipleshipLeader: "",
  email: "",
  finishedDiscipleship: "no",
  finishedOrientation: "no",
  firstName: "",
  houseNumber: "",
  loveForChildren: "Good",
  maritalStatus: "Single",
  phoneNumbers: "",
  profession: "",
  registeredLicMember: "no",
  street: "",
  sundaySchoolChurches: "",
  sundaySchoolDuration: "",
  sundaySchoolTraining: "no",
  surname: "",
  taughtSundaySchool: "no",
  title: "Mr",
  trainingDate: "",
  trainingDuration: "",
  trainingKind: "",
  whatsappPhoneNumber: "",
};

export const formSteps = [
  {
    description: "Please provide your personal details for our records",
    fields: [
      "firstName",
      "surname",
      "title",
      "maritalStatus",
      "houseNumber",
      "street",
      "area",
      "profession",
      "phoneNumbers",
      "whatsappPhoneNumber",
      "email",
      "loveForChildren",
      "acceptedChrist",
      "christKnownDuration",
      "bibleKnowledgeLevel",
      "availableYearRound",
      "availableMonths",
    ] as const,
    id: 1,
    stepperLabel: "Personal",
    title: "Personal Information",
  },
  {
    description: "Tell us about your relationship with LIC",
    fields: [
      "registeredLicMember",
      "finishedOrientation",
      "finishedDiscipleship",
      "discipleshipLeader",
    ] as const,
    id: 2,
    stepperLabel: "Membership",
    title: "LIC Membership",
  },
  {
    description: "Share your teaching and training background",
    fields: [
      "taughtSundaySchool",
      "sundaySchoolDuration",
      "childrenAgeGroup",
      "sundaySchoolChurches",
      "sundaySchoolTraining",
      "trainingDate",
      "trainingKind",
      "trainingDuration",
    ] as const,
    id: 3,
    stepperLabel: "Experience",
    title: "Sunday School Experience",
  },
] as const;
