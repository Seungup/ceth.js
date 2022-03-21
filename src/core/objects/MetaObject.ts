import { BufferGeometry, Object3D } from 'three';

export class MetaObjectCache {
	private static _class = new Map<string, { new (): IMetaObject }>();
	static add(target: { new (): IMetaObject }) {
		this._class.set(target.name, target);
	}

	static get(key: string) {
		return this._class.get(key);
	}

	static has(key: string) {
		return this._class.has(key);
	}
}
export function isIMetaObject(object: any): object is IMetaObject {
	return (<IMetaObject>object).isMetaObject !== undefined;
}

export interface IMetaObject extends Object3D {
	/**
	 * 메타 오브젝트인지 검증하기 위한 값
	 */
	isMetaObject: boolean;

	/**
	 * 오브젝트가 초기화 될 때 호출됩니다.
	 *
	 * @param parma 업데이트 파라미터
	 */
	onInitialization(parma: any): void;

	/**
	 * 자신의 클래스 명을 가져옵니다.
	 */
	getClassName(): string;
}
