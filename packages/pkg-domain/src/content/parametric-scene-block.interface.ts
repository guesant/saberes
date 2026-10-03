export interface ParametricSceneBlock {
  type: "parametric_scene";
  title?: string;
  shape: "cube" | "sphere" | "torus";
  color?: string;
  scale?: number;
  rotationSpeed?: number;
}
