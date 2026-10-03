// @ts-nocheck
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Alert, Box, Button, Chip, Link as MuiLink, Paper, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { parseEditorialBlocks } from "./schema";
import { ChartBlock, KnowledgeMapBlock, ParametricSceneBlock } from "./VisualizationBlocks";

function parseBlocks(value) {
    return parseEditorialBlocks(value);
}

function safeExternalUrl(url) {
    if (!url || !/^https:\/\//i.test(url)) return null;
    return url;
}

function Block({ block, onQuestion }) {
    const { t } = useTranslation();
    if (!block?.type) return null;
    if (block.type === "callout")
        return (
            <Alert severity={block.severity || "info"} sx={{ my: 3 }}>
                <Typography fontWeight={700}>{block.title}</Typography>
                <Typography sx={{ mt: 0.5, whiteSpace: "pre-wrap" }}>{block.content}</Typography>
            </Alert>
        );
    if (block.type === "formula")
        return (
            <Paper
                variant="outlined"
                sx={{
                    p: 2,
                    my: 3,
                    overflowX: "auto",
                    bgcolor: "background.default",
                }}
            >
                <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex, rehypeSanitize]}
                >{`$$${block.formula || ""}$$`}</ReactMarkdown>
                {block.caption && (
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", textAlign: "center", mt: 1 }}
                    >
                        {block.caption}
                    </Typography>
                )}
            </Paper>
        );
    if (block.type === "image") {
        const src = safeExternalUrl(block.src) || (block.src?.startsWith("/") ? block.src : null);
        return src ? (
            <Box component="figure" sx={{ my: 3, mx: 0, textAlign: "center" }}>
                <Box
                    component="img"
                    src={src}
                    alt={block.alt || ""}
                    sx={{ maxWidth: "100%", borderRadius: 2 }}
                />
                {block.caption && (
                    <Typography
                        component="figcaption"
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        {block.caption}
                    </Typography>
                )}
            </Box>
        ) : null;
    }
    if (block.type === "video") {
        const url = safeExternalUrl(block.url);
        return url ? (
            <Paper variant="outlined" sx={{ p: 2, my: 3 }}>
                <Typography fontWeight={700}>
                    {block.title || t("content.recommendedVideo")}
                </Typography>
                <Button
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    endIcon={<OpenInNewIcon />}
                    sx={{ mt: 1 }}
                >
                    {t("content.openVideo")}
                </Button>
            </Paper>
        ) : null;
    }
    if (block.type === "question_link")
        return (
            <Paper variant="outlined" sx={{ p: 2, my: 3, bgcolor: "background.default" }}>
                <Typography fontWeight={700}>
                    {block.title || t("content.practiceConcept")}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {block.description}
                </Typography>
                <Button
                    onClick={() => onQuestion?.(block.questionId)}
                    endIcon={<ArrowForwardIcon />}
                    sx={{ mt: 1 }}
                >
                    {t("content.solveQuestion")}
                </Button>
            </Paper>
        );
    if (block.type === "summary")
        return (
            <Paper
                sx={{
                    p: 2.5,
                    my: 3,
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                }}
            >
                <Typography variant="h6">{block.title || t("content.summary")}</Typography>
                <Typography sx={{ mt: 1, whiteSpace: "pre-wrap", opacity: 0.9 }}>
                    {block.content}
                </Typography>
            </Paper>
        );
    if (block.type === "comparison_table")
        return (
            <Box sx={{ overflowX: "auto", my: 3 }}>
                <Box
                    component="table"
                    sx={{
                        width: "100%",
                        borderCollapse: "collapse",
                        "& th, & td": {
                            border: "1px solid",
                            borderColor: "divider",
                            p: 1.25,
                            textAlign: "left",
                        },
                        "& th": { bgcolor: "background.default" },
                    }}
                >
                    <thead>
                        <tr>
                            {(block.headers || []).map((header) => (
                                <th key={header}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {(block.rows || []).map((row) => {
                            const rowKey = row.join("\u0000");
                            return (
                                <tr key={rowKey}>
                                    {row.map((cell) => (
                                        <td key={`${rowKey}-${cell}`}>{cell}</td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </Box>
            </Box>
        );
    if (block.type === "chart") return <ChartBlock block={block} />;
    if (block.type === "knowledge_map") return <KnowledgeMapBlock block={block} />;
    if (block.type === "parametric_scene") return <ParametricSceneBlock block={block} />;
    return null;
}

export function ContentRenderer({ markdown = "", blocksJson = "[]", onQuestion }) {
    const { t } = useTranslation();
    const blocks = parseBlocks(blocksJson);
    return (
        <Stack className="content-renderer" spacing={1}>
            <Box
                sx={{
                    "& p": { lineHeight: 1.9, fontSize: "1.05rem" },
                    "& h1, & h2, & h3": { mt: 3, mb: 1.5 },
                    "& ul, & ol": { pl: 3, lineHeight: 1.9 },
                    "& blockquote": {
                        borderLeft: 4,
                        borderColor: "secondary.main",
                        pl: 2,
                        ml: 0,
                        color: "text.secondary",
                    },
                    "& code": {
                        bgcolor: "background.default",
                        px: 0.5,
                        borderRadius: 0.5,
                    },
                    "& pre": {
                        bgcolor: "#172033",
                        color: "#f4f6fb",
                        p: 2,
                        borderRadius: 2,
                        overflowX: "auto",
                    },
                    "& a": { color: "primary.main" },
                }}
            >
                <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex, rehypeSanitize]}
                    components={{
                        a: ({ href, children }) => {
                            const url = safeExternalUrl(href);
                            return (
                                <MuiLink
                                    href={url || undefined}
                                    target={url ? "_blank" : undefined}
                                    rel={url ? "noreferrer" : undefined}
                                >
                                    {children}
                                </MuiLink>
                            );
                        },
                        img: ({ src, alt }) => {
                            const url = safeExternalUrl(src) || (src?.startsWith("/") ? src : null);
                            return url ? (
                                <Box
                                    component="img"
                                    src={url}
                                    alt={alt || ""}
                                    sx={{
                                        maxWidth: "100%",
                                        borderRadius: 2,
                                        my: 2,
                                    }}
                                />
                            ) : null;
                        },
                    }}
                >
                    {markdown}
                </ReactMarkdown>
            </Box>
            {blocks.map((block) => (
                <Block
                    key={`${block.type}-${JSON.stringify(block)}`}
                    block={block}
                    onQuestion={onQuestion}
                />
            ))}
            <Chip
                size="small"
                label={t("content.reviewed")}
                variant="outlined"
                sx={{ alignSelf: "flex-start", mt: 2 }}
            />
        </Stack>
    );
}
