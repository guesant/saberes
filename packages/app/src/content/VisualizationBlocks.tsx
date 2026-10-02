// @ts-nocheck -- migração incremental das visualizações editoriais legadas.
import { Alert, Box, Paper, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export function ChartBlock({ block }) {
    const { t } = useTranslation();
    const containerRef = useRef(null);
    useEffect(() => {
        let chart = null;
        let resize = null;
        let active = true;
        import("echarts").then(({ init }) => {
            if (!active || !containerRef.current) return;
            chart = init(containerRef.current, undefined, {
                renderer: "canvas",
            });
            chart.setOption(block.option);
            resize = () => chart?.resize();
            window.addEventListener("resize", resize);
        });
        return () => {
            active = false;
            if (resize) window.removeEventListener("resize", resize);
            chart?.dispose();
        };
    }, [block.option]);
    return (
        <Paper variant="outlined" sx={{ p: 2, my: 3 }}>
            <Typography fontWeight={700}>
                {block.title || t("content.visualization")}
            </Typography>
            <Box
                ref={containerRef}
                role="img"
                aria-label={block.title || t("content.editorialChart")}
                sx={{ height: 300, mt: 1 }}
            />
        </Paper>
    );
}

export function KnowledgeMapBlock({ block }) {
    const { t } = useTranslation();
    const containerRef = useRef(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        let cy = null;
        let active = true;
        Promise.all([import("cytoscape"), import("graphology")])
            .then(([cytoscapeModule, graphologyModule]) => {
                if (!active || !containerRef.current) return;
                const cytoscape = cytoscapeModule.default;
                const Graph = graphologyModule.default;
                const graph = new Graph();
                block.nodes.forEach((node) => {
                    graph.addNode(node.id, node);
                });
                block.edges.forEach((edge) => {
                    if (
                        graph.hasNode(edge.source) &&
                        graph.hasNode(edge.target)
                    )
                        graph.addEdge(edge.source, edge.target);
                });
                cy = cytoscape({
                    container: containerRef.current,
                    elements: {
                        nodes: graph.nodes().map((id) => ({
                            data: {
                                id,
                                label: graph.getNodeAttribute(id, "label"),
                            },
                        })),
                        edges: graph.edges().map((id) => {
                            const [source, target] = graph.extremities(id);
                            return { data: { id, source, target } };
                        }),
                    },
                    style: [
                        {
                            selector: "node",
                            style: {
                                label: "data(label)",
                                "background-color": "#375de7",
                                color: "#172033",
                                "text-valign": "bottom",
                                "text-margin-y": 8,
                                width: 20,
                                height: 20,
                            },
                        },
                        {
                            selector: "edge",
                            style: {
                                width: 2,
                                "line-color": "#b9c4e8",
                                "target-arrow-color": "#b9c4e8",
                                "target-arrow-shape": "triangle",
                                "curve-style": "bezier",
                            },
                        },
                    ],
                    layout: {
                        name: "breadthfirst",
                        directed: true,
                        padding: 24,
                    },
                });
            })
            .catch((reason) => {
                if (active) setError(reason);
            });
        return () => {
            active = false;
            cy?.destroy();
        };
    }, [block]);
    if (error) return <Alert severity="info">{t("content.mapFallback")}</Alert>;
    return (
        <Paper variant="outlined" sx={{ p: 2, my: 3 }}>
            <Typography fontWeight={700}>
                {block.title || t("content.knowledgeMap")}
            </Typography>
            <Box
                ref={containerRef}
                role="img"
                aria-label={block.title || t("content.knowledgeMap")}
                sx={{ height: 360, mt: 1 }}
            />
        </Paper>
    );
}

export function ParametricSceneBlock({ block }) {
    const { t } = useTranslation();
    const canvasRef = useRef(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        let renderer = null;
        let frame = null;
        let active = true;
        import("three")
            .then((THREE) => {
                if (!active || !canvasRef.current) return;
                const width = canvasRef.current.clientWidth || 640;
                const height = 300;
                const scene = new THREE.Scene();
                scene.background = new THREE.Color("#f7f8fb");
                const camera = new THREE.PerspectiveCamera(
                    45,
                    width / height,
                    0.1,
                    100,
                );
                camera.position.z = 4;
                renderer = new THREE.WebGLRenderer({
                    antialias: true,
                    canvas: canvasRef.current,
                });
                renderer.setSize(width, height, false);
                let geometry = null;
                if (block.shape === "sphere") {
                    geometry = new THREE.SphereGeometry(1, 32, 20);
                } else if (block.shape === "torus") {
                    geometry = new THREE.TorusGeometry(1, 0.35, 16, 48);
                } else {
                    geometry = new THREE.BoxGeometry(1.6, 1.6, 1.6);
                }
                const material = new THREE.MeshStandardMaterial({
                    color: block.color || "#375de7",
                    roughness: 0.45,
                    metalness: 0.05,
                });
                const mesh = new THREE.Mesh(geometry, material);
                mesh.scale.setScalar(
                    Math.max(0.35, Math.min(2, Number(block.scale || 1))),
                );
                scene.add(mesh);
                scene.add(new THREE.HemisphereLight("#ffffff", "#8ba0c7", 2));
                const animate = () => {
                    if (!active) return;
                    mesh.rotation.y += Number(block.rotationSpeed || 0.01);
                    mesh.rotation.x += Number(block.rotationSpeed || 0.005);
                    renderer.render(scene, camera);
                    frame = requestAnimationFrame(animate);
                };
                animate();
            })
            .catch((reason) => {
                if (active) setError(reason);
            });
        return () => {
            active = false;
            cancelAnimationFrame(frame);
            renderer?.dispose();
        };
    }, [block]);
    if (error)
        return <Alert severity="info">{t("content.sceneFallback")}</Alert>;
    return (
        <Paper variant="outlined" sx={{ p: 2, my: 3 }}>
            <Typography fontWeight={700}>
                {block.title || t("content.interactiveExperience")}
            </Typography>
            <Box
                component="canvas"
                ref={canvasRef}
                role="img"
                aria-label={block.title || t("content.scene3d")}
                sx={{ display: "block", width: "100%", height: 300, mt: 1 }}
            />
        </Paper>
    );
}
