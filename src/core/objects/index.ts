import { LineObject } from "./LineObject";

export const ObjectStore = {
    LineObject,
} as const;

export type ObjectStore = typeof ObjectStore[keyof typeof ObjectStore];
