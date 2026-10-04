import { UITextField } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export interface QuestionSessionOptionsProps {
  maxQuantity: number;
  quantity: string;
  durationMinutes: string;
  onQuantityChange(value: string): void;

  onDurationChange(value: string): void;
}

export function QuestionSessionOptions(props: QuestionSessionOptionsProps) {
  const { t } = useTranslation();

  return (
    <>
      <UITextField
        label={t("exercise.sessionQuantity")}
        inputProps={{ min: 1, max: props.maxQuantity }}
        onChange={(event) => {
          return props.onQuantityChange(event.target.value);
        }}
        type="number"
        value={props.quantity}
      />
      <UITextField
        label={t("exercise.sessionDuration")}
        inputProps={{ min: 1 }}
        onChange={(event) => {
          return props.onDurationChange(event.target.value);
        }}
        type="number"
        value={props.durationMinutes}
      />
    </>
  );
}
