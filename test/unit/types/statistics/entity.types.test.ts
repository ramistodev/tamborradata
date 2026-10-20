import { describe, expect, it } from 'vitest';
import { entityType } from '@/app/types/statistics';

describe('entity types', () => {
  it('declares the entity types', () => {
    expect(entityType).toEqual({ school: 'school', name: 'name', surname: 'surname' });
  });
});
