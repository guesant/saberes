export type PersonalRelationResolutionState =
  | "active"
  | "archived"
  | "imported-both"
  | "imported-source"
  | "imported-target"
  | "invalid-both"
  | "invalid-source"
  | "invalid-target"
  | "missing-both"
  | "missing-source"
  | "missing-target"
  | "partially-restored";
