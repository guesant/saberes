import { UIAlert, UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
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

  const descriptor = actionFeedbackDescriptors[props.state];

  if (descriptor.state === "idle") {
    return null;
  }

  return (
    <UIAlert severity={descriptor.severity} role={descriptor.state === "error" ? "alert" : "status"}>
      <UIContentGroup variant="content">
        <UITypography>{t(descriptor.messageKey)}</UITypography>
        <UITypography variant="body2">{props.error?.message || ""}</UITypography>
      </UIContentGroup>
    </UIAlert>
  );
}
