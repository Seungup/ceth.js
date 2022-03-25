import { Box3, Object3D, ObjectLoader, Scene, Vector3 } from 'three';
import { CT_WGS84, IWGS84, WGS84_TYPE } from '../../../math';
import { isMetaObject } from '../../../meta';

interface IObjectCallbackFunction<T> {
	onSuccess(object: Object3D): T;
	onError?(): void;
}

export namespace SceneComponent {
	export const scene = new Scene();

	{
		scene.matrixAutoUpdate = false;
	}

	function getObject<T>(id: number, cb: IObjectCallbackFunction<T>) {
		const object = scene.getObjectById(id);
		if (object) {
			return cb.onSuccess(object);
		} else {
			if (cb.onError) {
				cb.onError();
			}
		}
	}

	export namespace API {
		/**
		 * 오브젝트의 유저 데이터를 가져옵니다.
		 * @param id
		 * @returns
		 */
		export const getUserData = (id: number) => {
			return getObject(id, {
				onSuccess(object) {
					return object.userData;
				},
			});
		};
		/**
		 * 오브젝트의 포지션을 가져옵니다.
		 * @param id
		 * @returns
		 */
		export const getObjectPosition = (id: number) => {
			return getObject(id, {
				onSuccess(object) {
					const wgs84: IWGS84 | undefined = object.userData.wgs84;
					if (wgs84) {
						return new CT_WGS84(
							wgs84,
							WGS84_TYPE.THREEJS
						).toIWGS84();
					}
				},
			});
		};

		/**
		 * 오브젝트의 포지션을 설정합니다.
		 * @param id
		 * @param position
		 */
		export const setObjectPosition = (
			id: number | Object3D,
			position: IWGS84
		) => {
			let object: Object3D | undefined;

			if (typeof id === 'number') {
				getObject(id, {
					onSuccess(result) {
						object = result;
					},
				});
			} else {
				object = id;
			}

			if (object && object.userData.original) {
				if (position.height === 0) {
					let box3: Vector3 | undefined = object.userData.box3;
					if (!box3) {
						box3 = new Box3().setFromObject(object).max;
						box3.setZ(box3.z + 1);
						object.userData.box3 = box3;
					}
					position.height = box3.z;
				}
				const wgs84 = new CT_WGS84(position, WGS84_TYPE.CESIUM);
				object.position.copy(object.userData.original.position);
				object.rotation.copy(object.userData.original.rotation);
				object.scale.copy(object.userData.original.scale);
				object.applyMatrix4(wgs84.getMatrix4());
				object.userData.wgs84 = wgs84.toIWGS84();
			}
		};

		/**
		 * 오브젝트를 추가합니다.
		 * @param json
		 * @param position
		 * @returns
		 */
		export const add = (json: any, position?: IWGS84) => {
			const object = new ObjectLoader().parse(json);

			object.userData.original = {
				position: object.position.clone(),
				rotation: object.rotation.clone(),
				scale: object.scale.clone(),
			};

			const box3 = new Box3().setFromObject(object).max;

			if (Math.abs(box3.x) === Infinity) {
				box3.setX(0);
			}

			if (Math.abs(box3.y) === Infinity) {
				box3.setY(0);
			}

			if (Math.abs(box3.z) === Infinity) {
				box3.setZ(0);
			}

			object.userData.box3 = box3;

			scene.add(object);

			if (position) {
				setObjectPosition(object, {
					height: position.height,
					latitude: position.longitude,
					longitude: position.latitude,
				});
			}

			return object.id;
		};

		/**
		 * 오브젝트를 제거합니다.
		 * @param id
		 */
		export function remove(id: number) {
			getObject(id, {
				onSuccess(object) {
					if (isMetaObject(object) && object.dispose) {
						object.dispose();
					}

					scene.remove(object);
				},
			});
		}

		/**
		 * 오브젝트의 JSON 데이터를 가져옵니다.
		 * @param id
		 * @returns
		 */
		export function getObjectJSON(id: number) {
			return getObject(id, {
				onSuccess(object) {
					return object.toJSON();
				},
			});
		}

		export function isExistObject(id: number) {
			return getObject(id, {
				onSuccess() {
					return true;
				},
			});
		}
	}
}
