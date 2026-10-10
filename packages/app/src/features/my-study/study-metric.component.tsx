import { UICard, UICardContent, UITypography } from "@guesant/saberes-ui";

export type StudyMetricProps = {
    label: string;
    value: number;
};

export function StudyMetric(props: StudyMetricProps) {
    return (
        <UICard sx={{ height: "100%" }}>
            <UICardContent
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    height: "100%",
                }}
            >
                <UITypography variant="h5">{props.value}</UITypography>
                <UITypography color="text.secondary">
                    {props.label}
                </UITypography>
            </UICardContent>
        </UICard>
    );
}
