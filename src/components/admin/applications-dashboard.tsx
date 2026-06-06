import { Skeleton } from "boneyard-js/react";
import { useMutation, useQuery } from "convex/react";
import { useMemo, useState } from "react";

import { ApplicationDetailSheet } from "@/components/admin/application-detail-sheet";
import { ApplicationsTable } from '@/components/admin/applications-table';
import type { ApplicationRow } from '@/components/admin/applications-table';
import { ReviewConfirmationDialog } from '@/components/admin/review-confirmation-dialog';
import type { ReviewAction } from '@/components/admin/review-confirmation-dialog';
import { AccessDeniedAlert } from "@/components/admin/access-denied-alert";
import { StatsCards } from "@/components/admin/stats-cards";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { normalizeApplicationStatus } from "@/lib/application-status";

import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

export const ApplicationsDashboard = () => {
  const isBoneyardBuild =
    typeof window !== "undefined" &&
    (window as Window & { __BONEYARD_BUILD?: boolean }).__BONEYARD_BUILD ===
      true;

  const access = useQuery(
    api.adminApplications.canAccess,
    isBoneyardBuild ? "skip" : {}
  );
  const applications = useQuery(
    api.adminApplications.list,
    isBoneyardBuild || access?.allowed ? (isBoneyardBuild ? "skip" : {}) : "skip"
  );
  const stats = useQuery(
    api.adminApplications.stats,
    isBoneyardBuild || access?.allowed ? (isBoneyardBuild ? "skip" : {}) : "skip"
  );
  const reviewApplication = useMutation(api.adminApplications.review);

  const [selectedApplicationId, setSelectedApplicationId] =
    useState<Id<"memberApplications"> | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<ReviewAction | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const selectedApplication = useMemo(() => {
    if (!applications || !selectedApplicationId) {
      return null;
    }

    const application = applications.find(
      (item: ApplicationRow) => item._id === selectedApplicationId
    );

    if (!application) {
      return null;
    }

    return {
      ...application,
      status: normalizeApplicationStatus(application.status),
    };
  }, [applications, selectedApplicationId]);

  const tableApplications = useMemo<ApplicationRow[]>(() => {
    if (!applications) {
      return [];
    }

    return applications.map((application: ApplicationRow) => ({
      ...application,
      status: normalizeApplicationStatus(application.status),
    }));
  }, [applications]);

  const isLoading = isBoneyardBuild
    ? true
    : access === undefined ||
      (access.allowed && (applications === undefined || stats === undefined));

  if (!isBoneyardBuild && access && !access.allowed) {
    return (
      <AccessDeniedAlert
        debug={"debug" in access ? access.debug : undefined}
        message={
          access.message ??
          "Your account is not authorized to review membership applications."
        }
      />
    );
  }

  const openReviewSheet = (application: ApplicationRow) => {
    setSelectedApplicationId(application._id);
    setSheetOpen(true);
  };

  const openReviewDialog = (
    application: ApplicationRow,
    action: ReviewAction
  ) => {
    setSelectedApplicationId(application._id);
    setReviewAction(action);
    setReviewDialogOpen(true);
    setReviewError(null);
  };

  const handleConfirmReview = async (notes: string) => {
    if (!selectedApplicationId || !reviewAction) {
      return;
    }

    setIsSubmittingReview(true);
    setReviewError(null);

    try {
      await reviewApplication({
        applicationId: selectedApplicationId,
        notes,
        status: reviewAction,
      });
      setReviewDialogOpen(false);
      setReviewAction(null);
      setSheetOpen(false);
    } catch (error) {
      setReviewError(
        error instanceof Error ? error.message : "Failed to update application."
      );
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="display-title text-3xl font-bold tracking-tight">
          Applications
        </h1>
        <p className="text-muted-foreground">
          Review membership applications and approve or reject submissions.
        </p>
      </div>

      {reviewError ? (
        <Alert variant="destructive">
          <AlertTitle>Review failed</AlertTitle>
          <AlertDescription>{reviewError}</AlertDescription>
        </Alert>
      ) : null}

      <Skeleton
        fixture={<StatsCards approved={12} pending={5} total={24} />}
        loading={isLoading}
        name="admin-stats-cards"
      >
        {stats ? (
          <StatsCards
            approved={stats.approved}
            pending={stats.pending}
            total={stats.total}
          />
        ) : null}
      </Skeleton>

      <Skeleton
        fixture={
          <ApplicationsTable
            applications={[
              {
                _creationTime: Date.now(),
                _id: "fixture" as Id<"memberApplications">,
                acceptedChrist: "yes",
                approvedAt: undefined,
                approvedBy: undefined,
                area: "East Legon",
                availableMonths: undefined,
                availableYearRound: "yes",
                bibleKnowledgeLevel: 3,
                changelog: undefined,
                clerkUserId: undefined,
                createdAt: Date.now(),
                discipleshipLeader: "Pastor Example",
                email: "member@example.com",
                finishedDiscipleship: "no",
                finishedOrientation: "no",
                firstName: "Jane",
                houseNumber: "12",
                loveForChildren: "Good",
                maritalStatus: "Single",
                phoneNumbers: "233501234567",
                profession: "Teacher",
                registeredLicMember: "no",
                rejectedAt: undefined,
                rejectedBy: undefined,
                reviewNotes: undefined,
                reviewedAt: undefined,
                reviewedBy: undefined,
                status: "pending",
                street: "Main Street",
                sundaySchoolChurches: "",
                sundaySchoolDuration: "",
                sundaySchoolTraining: "no",
                surname: "Doe",
                taughtSundaySchool: "no",
                title: "Ms",
                trainingDate: "",
                trainingDuration: "",
                trainingKind: "",
                whatsappPhoneNumber: "233501234568",
              },
            ]}
            onApprove={() => {}}
            onReject={() => {}}
            onReview={() => {}}
          />
        }
        loading={isLoading}
        name="admin-applications-table"
      >
        {applications ? (
          <ApplicationsTable
            applications={tableApplications}
            onApprove={(application) =>
              openReviewDialog(application, "approved")
            }
            onReject={(application) =>
              openReviewDialog(application, "rejected")
            }
            onReview={openReviewSheet}
          />
        ) : null}
      </Skeleton>

      <ApplicationDetailSheet
        application={selectedApplication}
        onApprove={() => {
          if (selectedApplication) {
            openReviewDialog(selectedApplication, "approved");
          }
        }}
        onClose={() => {
          setSheetOpen(false);
          setSelectedApplicationId(null);
        }}
        onReject={() => {
          if (selectedApplication) {
            openReviewDialog(selectedApplication, "rejected");
          }
        }}
        open={sheetOpen}
      />

      <ReviewConfirmationDialog
        action={reviewAction}
        applicantName={
          selectedApplication
            ? `${selectedApplication.firstName} ${selectedApplication.surname}`
            : "this applicant"
        }
        isSubmitting={isSubmittingReview}
        onClose={() => {
          setReviewDialogOpen(false);
          setReviewAction(null);
        }}
        onConfirm={handleConfirmReview}
        open={reviewDialogOpen}
      />
    </div>
  );
};
