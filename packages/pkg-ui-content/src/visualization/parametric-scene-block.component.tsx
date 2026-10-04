import { UIAlert, UIBox, UIContentSurface, UIContentText } from "@guesant/saberes-ui";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getVisualizationSupport } from "./get-visualization-support.function";
import { UIVisualizationTextSummary } from "./visualization-text-summary.component";
import type { ParametricSceneBlock } from "@guesant/saberes-application";
import type { WebGLRenderer } from "three";

type UIParametricSceneBlockProps = {
  block: ParametricSceneBlock;
};

export function UIParametricSceneBlock(props: UIParametricSceneBlockProps) {
  const { block } = props;

  const { t } = useTranslation();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [hasError, setHasError] = useState(false);

  const title = block.title || t("content.interactiveExperience");

  const textSummary = [
    `${t("content.sceneShape")}: ${t(`content.sceneShapes.${block.shape}`)}`,
    `${t("content.sceneColor")}: ${block.color || t("content.sceneDefaultColor")}`,
    `${t("content.sceneScale")}: ${block.scale || 1}`,
    `${t("content.sceneRotationSpeed")}: ${block.rotationSpeed || 0}`,
  ].join("\n");

  useEffect(() => {
    let renderer: WebGLRenderer | null = null;

    let frame = 0;

    let active = true;

    if (!getVisualizationSupport().webgl) {
      setHasError(true);

      return () => {
        active = false;
      };
    }

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

  return (
    <UIContentSurface mode="outlined">
      <UIContentText variant="title">{title}</UIContentText>

      {hasError ? <UIAlert severity="info">{t("content.sceneFallback")}</UIAlert> : null}

      <UIBox
        component="canvas"
        ref={canvasRef}
        role="img"
        aria-label={title || t("content.scene3d")}
      />

      <UIVisualizationTextSummary summary={textSummary} title={t("content.textualAlternative")} />
    </UIContentSurface>
  );
}
