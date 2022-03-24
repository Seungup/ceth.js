import { IMetaObject } from './interface';

export * from './MetaGroup';
export * from './interface';
export * from './MetaMesh';
export * from './MetaObject3D';
export * from './MetaSVG';

/**
 * 오브젝트의 형이 MetaObject 인터페이스의 형태를 가지고 있는지 확인합니다.
 * @param object
 * @returns
 */
export function isMetaObject(object: any): object is IMetaObject {
	return (<IMetaObject>object).isMetaObject;
}
