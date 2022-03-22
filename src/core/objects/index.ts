import { CircleObject, CircleObjectConstructorOptions } from './CircleObject';

/**
 * 메타 오브젝트 클래스를 등록하는 맵입니다.
 */
export const MetaObjectClassMap = {
	CircleObject: CircleObject,
};
export type MetaObjectClassMap =
	typeof MetaObjectClassMap[keyof typeof MetaObjectClassMap];

/**
 * 메타 오브젝트 생성자 파라미터 인터페이스입니다.
 */
export interface MetaObjectConstructorMap {
	CircleObject: CircleObjectConstructorOptions;
}
