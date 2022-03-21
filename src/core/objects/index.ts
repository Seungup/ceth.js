import { CircleObject } from './CircleObject';

export const ObjectStore = {
	CircleObject,
} as const;

export type ObjectStore = typeof ObjectStore[keyof typeof ObjectStore];
