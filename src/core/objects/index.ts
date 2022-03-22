import { CircleObject, CircleObjectInitializationParam } from './CircleObject';
export interface MetaObjectConstructorMap {
	CircleObject: CircleObjectInitializationParam;
}
export interface MetaObjectClassMap {
	CircleObject: CircleObject;
}

export const MetaObjectClassMap = {
	CircleObject: CircleObject,
};
