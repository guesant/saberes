import { Alert, Box, Paper, Typography } from "@guesant/saberes-ui";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { EditorialBlock } from "@guesant/saberes-application";
import type { WebGLRenderer } from "three";

type ParametricSceneBlockProps = {
  block: Extract<EditorialBlock, { type: "parametric_scene" }>;
};

export function ParametricSceneBlock(props: ParametricSceneBlockProps) {
  const { block } = props;

  const { t } = useTranslation();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let renderer: WebGLRenderer | null = null;

    let frame = 0;

    let active = true;

    import("three")
      .then((THREE) => {
        if (!active || !canvasRef.current) {
          return;
        }

        const width = canvasRef.current.clientWidth || 640;

        const height = 300;

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);

        camera.position.z = 4;

        renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvasRef.current });

        renderer.setSize(width, height, false);

        const geometry =
          block.shape === "sphere"
            ? new THREE.SphereGeometry(1, 32, 20)
            : block.shape === "torus"
              ? new THREE.TorusGeometry(1, 0.35, 16, 48)
              : new THREE.BoxGeometry(1.6, 1.6, 1.6);

        const material = new THREE.MeshStandardMaterial({ color: block.color || "#375de7" });

        const mesh = new THREE.Mesh(geometry, material);

        scene.add(mesh);

        const runAnimation = () => {
          if (!active || !renderer) {
            return;
          }

          renderer.render(scene, camera);

          frame = requestAnimationFrame(runAnimation);
        };

        runAnimation();
      })
      .catch(() => {
        if (active) {
          setHasError(true);
        }
      });

    return () => {
      active = false;

      cancelAnimationFrame(frame);

      renderer?.dispose();
    };
  }, [block]);

  if (hasError) {
    return <Alert severity="info">{t("content.sceneFallback")}</Alert>;
  }

  return (
    <Paper variant="outlined" sx={{ p: 2, my: 3 }}>
      <Typography fontWeight={700}>{block.title || t("content.interactiveExperience")}</Typography>

      <Box
        component="canvas"
        ref={canvasRef}
        role="img"
        aria-label={block.title || t("content.scene3d")}
      />
    </Paper>
  );
}
