export const entityType = {
  school: 'school',
  name: 'name',
  surname: 'surname',
} as const;

export type EntityType = (typeof entityType)[keyof typeof entityType];
