import { ApplicationStatusBadge } from "@/components/admin/application-status-badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { normalizeApplicationStatus } from "@/lib/application-status";
import type { ApplicationStatus } from "@/lib/application-status";
import { formatApplicationDate, formatApplicationDateString } from "@/lib/format-application-date";
import { formatAvailability } from "@/lib/format-availability";

import { formatChangelogActorLabel } from "../../../convex/lib/changelog";
import type { Doc } from "../../../convex/_generated/dataModel";

type Application = Doc<"memberApplications"> & {
  status: ApplicationStatus;
};

interface DetailItemProps {
  label: string;
  value: string | number | undefined;
}

const DetailItem = ({ label, value }: DetailItemProps) => {
  if (!value) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  );
};

const formatYesNo = (value: "yes" | "no") => (value === "yes" ? "Yes" : "No");

interface ApplicationDetailSheetProps {
  application: Application | null;
  onApprove: () => void;
  onClose: () => void;
  onReject: () => void;
  open: boolean;
}

export const ApplicationDetailSheet = ({
  application,
  onApprove,
  onClose,
  onReject,
  open,
}: ApplicationDetailSheetProps) => {
  if (!application) {
    return null;
  }

  const status = normalizeApplicationStatus(application.status);
  const fullName = `${application.title} ${application.firstName} ${application.surname}`;
  const canReview = status === "pending";

  return (
    <Sheet
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
      open={open}
    >
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{fullName}</SheetTitle>
          <SheetDescription>
            Submitted on {formatApplicationDate(application.createdAt)}
          </SheetDescription>
          <ApplicationStatusBadge status={status} />
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 pb-4">
          <section className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold">Personal information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <DetailItem
                label="Marital status"
                value={application.maritalStatus}
              />
              <DetailItem
                label="Address"
                value={`${application.houseNumber} ${application.street}, ${application.area}`}
              />
              <DetailItem label="Profession" value={application.profession} />
              <DetailItem label="Email" value={application.email} />
              <DetailItem label="Phone" value={application.phoneNumbers} />
              <DetailItem
                label="WhatsApp"
                value={application.whatsappPhoneNumber}
              />
              <DetailItem
                label="Love for children"
                value={application.loveForChildren}
              />
              <DetailItem
                label="Accepted Christ"
                value={formatYesNo(application.acceptedChrist)}
              />
              <DetailItem
                label="Known Christ for"
                value={application.christKnownDuration}
              />
              <DetailItem
                label="Bible knowledge"
                value={`${application.bibleKnowledgeLevel}/10`}
              />
              <DetailItem
                label="Availability"
                value={formatAvailability(application)}
              />
            </div>
          </section>

          <Separator />

          <section className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold">LIC membership</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <DetailItem
                label="Registered LIC member"
                value={formatYesNo(application.registeredLicMember)}
              />
              <DetailItem
                label="Finished orientation"
                value={formatYesNo(application.finishedOrientation)}
              />
              <DetailItem
                label="Finished discipleship"
                value={formatYesNo(application.finishedDiscipleship)}
              />
              <DetailItem
                label="Discipleship leader"
                value={application.discipleshipLeader}
              />
            </div>
          </section>

          <Separator />

          <section className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold">Sunday school experience</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <DetailItem
                label="Taught Sunday school"
                value={formatYesNo(application.taughtSundaySchool)}
              />
              <DetailItem
                label="Sunday school duration"
                value={application.sundaySchoolDuration}
              />
              <DetailItem
                label="Children age group"
                value={application.childrenAgeGroup}
              />
              <DetailItem
                label="Churches"
                value={application.sundaySchoolChurches}
              />
              <DetailItem
                label="Sunday school training"
                value={formatYesNo(application.sundaySchoolTraining)}
              />
              <DetailItem
                label="Training date"
                value={formatApplicationDateString(application.trainingDate)}
              />
              <DetailItem
                label="Training kind"
                value={application.trainingKind}
              />
              <DetailItem
                label="Training duration"
                value={application.trainingDuration}
              />
            </div>
          </section>

          {application.approvedAt ||
          application.approvedBy ||
          application.rejectedAt ||
          application.rejectedBy ||
          application.reviewNotes ||
          application.reviewedAt ||
          application.reviewedBy ? (
            <>
              <Separator />

              <section className="flex flex-col gap-4">
                <h3 className="text-sm font-semibold">Review</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {application.approvedAt ? (
                    <DetailItem
                      label="Approved on"
                      value={formatApplicationDate(application.approvedAt)}
                    />
                  ) : null}
                  {application.approvedBy ? (
                    <DetailItem
                      label="Approved by"
                      value={application.approvedBy}
                    />
                  ) : null}
                  {application.rejectedAt ? (
                    <DetailItem
                      label="Rejected on"
                      value={formatApplicationDate(application.rejectedAt)}
                    />
                  ) : null}
                  {application.rejectedBy ? (
                    <DetailItem
                      label="Rejected by"
                      value={application.rejectedBy}
                    />
                  ) : null}
                  {!application.approvedAt && !application.rejectedAt &&
                  application.reviewedAt ? (
                    <DetailItem
                      label="Reviewed on"
                      value={formatApplicationDate(application.reviewedAt)}
                    />
                  ) : null}
                  {application.reviewNotes ? (
                    <DetailItem
                      label="Review notes"
                      value={application.reviewNotes}
                    />
                  ) : null}
                  {!application.approvedBy &&
                  !application.rejectedBy &&
                  application.reviewedBy ? (
                    <DetailItem
                      label="Reviewed by"
                      value={application.reviewedBy}
                    />
                  ) : null}
                </div>
              </section>
            </>
          ) : null}

          {application.changelog && application.changelog.length > 0 ? (
            <>
              <Separator />

              <section className="flex flex-col gap-4">
                <h3 className="text-sm font-semibold">Activity</h3>
                <ol className="flex flex-col gap-3">
                  {[...application.changelog]
                    .sort((left, right) => right.timestamp - left.timestamp)
                    .map((entry, index) => (
                      <li
                        className="flex flex-col gap-1 rounded-md border border-border/60 bg-muted/30 px-3 py-2"
                        key={`${entry.timestamp}-${entry.userId}-${index}`}
                      >
                        <p className="text-sm">{entry.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatApplicationDate(entry.timestamp)} ·{" "}
                          {formatChangelogActorLabel(entry)}
                        </p>
                      </li>
                    ))}
                </ol>
              </section>
            </>
          ) : null}
        </div>

        {canReview ? (
          <SheetFooter className="border-t px-4 py-4">
            <Button onClick={onReject} variant="outline">
              Reject
            </Button>
            <Button onClick={onApprove}>Approve</Button>
          </SheetFooter>
        ) : null}
      </SheetContent>
    </Sheet>
  );
};
