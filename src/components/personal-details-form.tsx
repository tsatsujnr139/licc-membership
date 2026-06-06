"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { FormStepper } from "@/components/form-stepper";
import { ResponsiveOptionGroup } from "@/components/responsive-option-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  bibleKnowledgeOptions,
  christKnownDurationOptions,
  defaultFormValues,
  formSteps,
  loveForChildrenOptions,
  maritalStatusOptions,
  personalDetailsSchema,
  titleOptions,
  yesNoOptions,
} from "@/lib/personal-details-schema";
import type {
  PersonalDetailsFormValues,
  YesNoFieldName,
} from "@/lib/personal-details-schema";
import { formatPhoneNumberForSubmit } from "@/lib/phone";
import { cn } from "@/lib/utils";

import { api } from "../../convex/_generated/api";

const yesNoOptionsList = yesNoOptions.map((option) => ({
  label: option === "yes" ? "Yes" : "No",
  value: option,
}));

const YesNoField = ({
  name,
  label,
  control,
}: {
  name: YesNoFieldName;
  label: string;
  control: ReturnType<typeof useForm<PersonalDetailsFormValues>>["control"];
}) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <ResponsiveOptionGroup
            idPrefix={name}
            onValueChange={field.onChange}
            options={yesNoOptionsList}
            value={field.value}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export const PersonalDetailsForm = () => {
  const submitForm = useMutation(api.membershipApplications.submit);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<PersonalDetailsFormValues>({
    defaultValues: defaultFormValues,
    mode: "onTouched",
    resolver: zodResolver(personalDetailsSchema),
  });

  const activeStep = formSteps[currentStep - 1];
  const acceptedChrist = form.watch("acceptedChrist");
  const availableYearRound = form.watch("availableYearRound");
  const taughtSundaySchool = form.watch("taughtSundaySchool");
  const sundaySchoolTraining = form.watch("sundaySchoolTraining");

  const goToNextStep = async () => {
    const fields = [...activeStep.fields];
    const isValid = await form.trigger(fields);

    if (!isValid) {
      return;
    }

    if (currentStep === 1) {
      const values = form.getValues();

      if (values.acceptedChrist === "yes" && !values.christKnownDuration) {
        form.setError("christKnownDuration", {
          message: "Please select how long you have known Christ",
        });
        return;
      }

      if (values.availableYearRound === "no" && !values.availableMonths?.trim()) {
        form.setError("availableMonths", {
          message: "Please indicate your availability",
        });
        return;
      }
    }

    setCurrentStep((step) => Math.min(step + 1, formSteps.length));
  };

  const goToPreviousStep = () => {
    setCurrentStep((step) => Math.max(step - 1, 1));
  };

  const onSubmit = async (values: PersonalDetailsFormValues) => {
    setIsSubmitting(true);

    try {
      await submitForm({
        ...values,
        availableMonths:
          values.availableYearRound === "yes"
            ? undefined
            : values.availableMonths,
        phoneNumbers: formatPhoneNumberForSubmit(values.phoneNumbers),
        whatsappPhoneNumber: formatPhoneNumberForSubmit(
          values.whatsappPhoneNumber
        ),
      });
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="mx-auto w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Application Submitted</CardTitle>
          <CardDescription>
            Thank you for completing the LIC Children&apos;s Ministry personal
            details form. We have received your information.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader className="flex flex-col gap-6">
        <FormStepper
          currentStep={currentStep}
          steps={formSteps.map((step) => ({
            id: step.id,
            label: step.stepperLabel,
          }))}
        />
        <div className="flex flex-col gap-1">
          <CardTitle>{activeStep.title}</CardTitle>
          <CardDescription>{activeStep.description}</CardDescription>
        </div>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="flex flex-col gap-6 pb-8">
            {currentStep === 1 ? (
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="surname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Surname</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your surname" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select title" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            {titleOptions.map((title) => (
                              <SelectItem key={title} value={title}>
                                {title}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maritalStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marital Status</FormLabel>
                      <FormControl>
                        <ResponsiveOptionGroup
                          idPrefix="marital-status"
                          onValueChange={field.onChange}
                          options={maritalStatusOptions.map((option) => ({
                            label: option,
                            value: option,
                          }))}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Residential Area</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your residential area"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="houseNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>House Number</FormLabel>
                      <FormControl>
                        <Input placeholder="House number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street</FormLabel>
                      <FormControl>
                        <Input placeholder="Street name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="profession"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profession</FormLabel>
                      <FormControl>
                        <Input placeholder="Your profession" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email address"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumbers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <PhoneInput
                          defaultCountry="GH"
                          onChange={field.onChange}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="whatsappPhoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp Phone Number</FormLabel>
                      <FormControl>
                        <PhoneInput
                          defaultCountry="GH"
                          onChange={field.onChange}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="loveForChildren"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>
                        How would you rank your personal love for children?
                      </FormLabel>
                      <FormControl>
                        <ResponsiveOptionGroup
                          idPrefix="love-for-children"
                          onValueChange={field.onChange}
                          options={loveForChildrenOptions.map((option) => ({
                            label: option,
                            value: option,
                          }))}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-6 md:col-span-2">
                  <YesNoField
                    control={form.control}
                    label="Have you accepted Christ as your personal Saviour?"
                    name="acceptedChrist"
                  />
                  {acceptedChrist === "yes" ? (
                    <FormField
                      control={form.control}
                      name="christKnownDuration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            How long have you known Christ as your personal
                            saviour?
                          </FormLabel>
                          <FormControl>
                            <ResponsiveOptionGroup
                              idPrefix="christ-known-duration"
                              onValueChange={field.onChange}
                              options={christKnownDurationOptions.map(
                                (option) => ({
                                  label: option,
                                  value: option,
                                })
                              )}
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : null}
                </div>
                <FormField
                  control={form.control}
                  name="bibleKnowledgeLevel"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>
                        Assess your level of knowledge of the Bible on a scale of 1 - 10 (10 being the most knowledgeable)
                      </FormLabel>
                      <FormControl>
                        <ResponsiveOptionGroup
                          idPrefix="bible-knowledge"
                          onValueChange={(value) => {
                            field.onChange(Number(value));
                          }}
                          options={bibleKnowledgeOptions.map((level) => ({
                            label: String(level),
                            value: String(level),
                          }))}
                          value={String(field.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <YesNoField
                  control={form.control}
                  label="Are you available to serve throughout the year?"
                  name="availableYearRound"
                />
                {availableYearRound === "no" ? (
                  <FormField
                    control={form.control}
                    name="availableMonths"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Please share your availability</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Jan–Jun, school holidays only"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : null}
              </div>
            ) : null}

            {currentStep === 2 ? (
              <div className="flex flex-col gap-6">
                <YesNoField
                  control={form.control}
                  label="Are you a registered member of LIC?"
                  name="registeredLicMember"
                />
                <YesNoField
                  control={form.control}
                  label="Have you finished the LIC membership orientation?"
                  name="finishedOrientation"
                />
                <YesNoField
                  control={form.control}
                  label="Have you finished the LIC discipleship training programme?"
                  name="finishedDiscipleship"
                />
                <FormField
                  control={form.control}
                  name="discipleshipLeader"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Who was the leader of your Discipleship Training Group?
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter leader's name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ) : null}

            {currentStep === 3 ? (
              <div className="flex flex-col gap-6">
                <YesNoField
                  control={form.control}
                  label="Have you ever taught Sunday School?"
                  name="taughtSundaySchool"
                />
                {taughtSundaySchool === "yes" ? (
                  <>
                    <FormField
                      control={form.control}
                      name="sundaySchoolDuration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>If yes, for how long?</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 2 years" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="childrenAgeGroup"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Which age group of children?</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 6–8 years" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sundaySchoolChurches"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            In which church(es) did you teach Sunday School?
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="List the church(es)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                ) : null}
                <YesNoField
                  control={form.control}
                  label="Have you ever undergone any Sunday School training?"
                  name="sundaySchoolTraining"
                />
                {sundaySchoolTraining === "yes" ? (
                  <>
                    <FormField
                      control={form.control}
                      name="trainingDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>If yes, when?</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="trainingKind"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Which kind of training was it?</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Describe the training"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="trainingDuration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            What was the duration of the training?
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 3 days" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                ) : null}
                <Alert>
                  <AlertDescription>
                    Please note that only registered church members are allowed
                    to teach Sunday School in LIC.
                  </AlertDescription>
                </Alert>
              </div>
            ) : null}
          </CardContent>

          <CardFooter
            className={cn(
              "flex gap-3 border-t pt-6",
              currentStep === 1 ? "justify-end" : "justify-between"
            )}
          >
            {currentStep > 1 ? (
              <Button
                onClick={goToPreviousStep}
                type="button"
                variant="outline"
              >
                <ChevronLeftIcon data-icon="inline-start" />
                Back
              </Button>
            ) : null}
            {currentStep < formSteps.length ? (
              <Button onClick={goToNextStep} type="button">
                Next
                <ChevronRightIcon data-icon="inline-end" />
              </Button>
            ) : (
              <Button disabled={isSubmitting} type="submit">
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
