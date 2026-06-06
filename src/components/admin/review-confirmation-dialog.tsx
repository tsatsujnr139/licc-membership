import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import type { ApplicationStatus } from "@/lib/application-status";

export type ReviewAction = Extract<ApplicationStatus, "approved" | "rejected">;

interface ReviewConfirmationDialogProps {
  action: ReviewAction | null;
  applicantName: string;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: (notes: string) => Promise<void>;
  open: boolean;
}

export const ReviewConfirmationDialog = ({
  action,
  applicantName,
  isSubmitting,
  onClose,
  onConfirm,
  open,
}: ReviewConfirmationDialogProps) => {
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setNotes("");
      setError(null);
      onClose();
    }
  };

  const handleConfirm = async () => {
    if (action === "rejected" && !notes.trim()) {
      setError("A reason is required when rejecting an application.");
      return;
    }

    setError(null);
    await onConfirm(notes.trim());
    setNotes("");
  };

  const title =
    action === "approved"
      ? "Approve application"
      : (action === "rejected"
        ? "Reject application"
        : "Review application");

  const description =
    action === "approved" ? (
      <>
        Approve <span className="font-semibold text-foreground">{applicantName}</span>
        &apos;s membership application. You can add optional notes for the record.
      </>
    ) : action === "rejected" ? (
      <>
        Reject <span className="font-semibold text-foreground">{applicantName}</span>
        &apos;s membership application. Please provide a reason.
      </>
    ) : (
      "Review this membership application."
    );

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field data-invalid={error ? true : undefined}>
            <FieldLabel htmlFor="review-notes">
              {action === "rejected" ? "Reason" : "Notes (optional)"}
            </FieldLabel>
            <Textarea
              aria-invalid={error ? true : undefined}
              id="review-notes"
              onChange={(event) => setNotes(event.target.value)}
              placeholder={
                action === "rejected"
                  ? "Explain why this application is being rejected"
                  : "Add any notes for this decision"
              }
              rows={4}
              value={notes}
            />
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </Field>
        </FieldGroup>
        <DialogFooter>
          <Button disabled={isSubmitting} onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button
            disabled={isSubmitting || !action}
            onClick={handleConfirm}
            variant={action === "rejected" ? "destructive" : "default"}
          >
            {action === "approved" ? "Approve" : "Reject"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
