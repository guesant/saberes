export type UiBoxCustomDataRestriction = {
  [Attribute in `data-ui-${string}`]?: never;
};
