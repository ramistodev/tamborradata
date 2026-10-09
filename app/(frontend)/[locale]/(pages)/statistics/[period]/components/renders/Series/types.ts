/** One drawn line: an entity (name, school...) and its value in each edition. */
export type Line = {
  key: string;
  label: string;
  color: string;
  values: Map<string, number>;
};

/** One position of the x axis (an edition); `order` keeps the real distance between editions. */
export type Dimension = { key: string; order: number };

export type Chart = {
  dimensions: Dimension[];
  lines: Line[];
};

export type Point = { x: number; y: number };

export type Scales = {
  /** x position, in viewBox units, of every dimension (same order as `dimensions`). */
  positions: number[];
  y: (value: number) => number;
  ticks: number[];
  /** y of the zero line, where areas close. */
  baseY: number;
  /** One x label out of `labelStep` is shown so they do not overlap. */
  labelStep: number;
};
