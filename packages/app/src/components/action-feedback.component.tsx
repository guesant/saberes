import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ActionFeedbackErrorDetails } from "./action-feedback-error-details.component";
import { useActionToast } from "./use-action-toast.hook";
import type { ActionFeedbackDescriptor } from "./action-feedback-descriptor.interface";
import type { ActionFeedbackProps } from "./action-feedback-props.interface";

const actionFeedbackDescriptors: Record<
  ActionFeedbackDescriptor["state"],
  ActionFeedbackDescriptor
> = {
  cancelled: { messageKey: "common.cancelled", severity: "info", state: "cancelled" },
  error: { messageKey: "common.saveError", severity: "error", state: "error" },
  idle: { messageKey: "common.cancelled", severity: "info", state: "idle" },
  saved: { messageKey: "common.saved", severity: "success", state: "saved" },
  saving: { messageKey: "common.saving", severity: "info", state: "saving" },
};

export function ActionFeedback(props: ActionFeedbackProps) {
  const { t } = useTranslation();

  const toast = useActionToast();

  const previousState = useRef<ActionFeedbackProps["state"]>("idle");

  const descriptor = actionFeedbackDescriptors[props.state];

  useEffect(() => {
    if (previousState.current === props.state) {
      return;
    }

    previousState.current = props.state;

    if (descriptor.state === "idle" || descriptor.state === "saving") {
      return;
    }

    toast.enqueue(
      <UIContentGroup variant="content">
        <UITypography>{t(descriptor.messageKey)}</UITypography>
        <ActionFeedbackErrorDetails error={props.error} />
      </UIContentGroup>,
      descriptor.severity,
    );
  }, [descriptor, props.error, props.state, t, toast]);

  return null;
}
