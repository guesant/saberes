import { UIBox, UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { QuestionStimulusTitle } from "./question-stimulus-title.component";
import type { QuestionContextReadModel } from "@guesant/saberes-application";

export type QuestionStimulusItemProps = {
    context: QuestionContextReadModel;
};

export function QuestionStimulusItem(props: QuestionStimulusItemProps) {
    const assets = props.context.assets || [];

    return (
        <UIBox
            aria-label={
                props.context.title || `Contexto ${props.context.position + 1}`
            }
            component="section"
            inset="none"
        >
            <UIContentGroup variant="content">
                <QuestionStimulusTitle title={props.context.title} />
                <UITypography component="p">
                    <span style={{ whiteSpace: "pre-line" }}>
                        {props.context.content}
                    </span>
                </UITypography>
                {assets.map((asset) => (
                    <img
                        alt={asset.altText}
                        decoding="async"
                        key={asset.id}
                        loading="lazy"
                        src={`${import.meta.env.BASE_URL}data/${asset.path}`}
                        style={{
                            display: "block",
                            height: "auto",
                            maxWidth: "100%",
                        }}
                    />
                ))}
            </UIContentGroup>
        </UIBox>
    );
}
