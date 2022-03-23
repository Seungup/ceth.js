import { Object3D } from 'three';

/**
 * 오브젝트의 형이 MetaObject 인터페이스의 형태를 가지고 있는지 확인합니다.
 * @param object
 * @returns
 */
export function isMetaObject(object: any): object is IMetaObject {
	return (<IMetaObject>object).isMetaObject === true;
}

/**
 * 오브젝트가 워커 스레드에서 관리 할 수 있도도록 정의된
 * 인터페이스입니다.
 */
export interface IMetaObject extends Object3D {
	readonly isMetaObject: boolean;

	/**
	 * 오브젝트를 더 이상 사용하지 않을 경우 이 함수가 자동으로 호출됩니다.
	 *
	 * geometry, material, texture 의 dispose 메소드를 호출하여,
	 * GC에서 메모리를 해제할 수 있도록합니다.
	 */
	dispose?(): void;
}
