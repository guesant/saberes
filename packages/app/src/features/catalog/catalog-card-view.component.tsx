import {
    UIAutoStoriesIcon,
    UIAccentIcon,
    UIFullHeightCard,
    UICardContent,
    UIChip,
    UIQuizIcon,
    UIBox,
    UITypography,
} from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getCatalogCardPath } from "../../components/get-catalog-card-path.function";
import type { CatalogCard } from "@guesant/saberes-application";

export type CatalogCardViewProps = {
    item: CatalogCard;
};

export function CatalogCardView(props: CatalogCardViewProps) {
    const { item } = props;

    const { t } = useTranslation();

    const typeLabel = t(`catalog.type.${item.type}`, {
        defaultValue: item.type,
    });

    const path = getCatalogCardPath(item);

    const icon =
        item.type === "lesson" ? <UIAutoStoriesIcon /> : <UIQuizIcon />;

    const action =
        item.type === "resource" && item.href ? (
            <a
                aria-label={`${t("common.open")}: ${String(item.title)}`}
                href={item.href}
                rel={/^https?:\/\//u.test(item.href) ? "noreferrer" : undefined}
                target={
                    /^https?:\/\//u.test(item.href) ||
                    item.href.startsWith("/data/")
                        ? "_blank"
                        : undefined
                }
            />
        ) : (
            <Link
                aria-label={`${t("common.open")}: ${String(item.title)}`}
                to={path}
            />
        );

    return (
        <UIFullHeightCard action={action}>
            <UICardContent
                sx={{ display: "flex", flexDirection: "column", gap: 1 }}
            >
                <UIAccentIcon>{icon}</UIAccentIcon>

                <UIBox
                    gap="xs"
                    inset="none"
                    layout="row"
                    sx={{ flexWrap: "wrap" }}
                >
                    <UIChip label={typeLabel} size="small" variant="outlined" />

                    {item.availabilityMode ? (
                        <UIChip
                            color={
                                item.availabilityMode === "consultation_only"
                                    ? "warning"
                                    : "default"
                            }
                            label={t(
                                `editorial.availability.${item.availabilityMode}`,
                            )}
                            size="small"
                            variant="outlined"
                        />
                    ) : null}

                    {item.editorialStatus ? (
                        <UIChip
                            color={
                                item.editorialStatus === "published"
                                    ? "success"
                                    : item.editorialStatus === "draft"
                                      ? "default"
                                      : "warning"
                            }
                            label={t(
                                `editorial.status.${item.editorialStatus}`,
                            )}
                            size="small"
                            variant="outlined"
                        />
                    ) : null}
                </UIBox>

                <UITypography variant="h6">{String(item.title)}</UITypography>

                <UITypography variant="body2" color="text.secondary">
                    {String(item.description || "")}
                </UITypography>

                {item.editorialNote ? (
                    <UITypography variant="caption" color="text.secondary">
                        {item.editorialNote}
                    </UITypography>
                ) : null}
                <UITypography color="primary" variant="button">
                    {t("common.open")} →
                </UITypography>
            </UICardContent>
        </UIFullHeightCard>
    );
}
