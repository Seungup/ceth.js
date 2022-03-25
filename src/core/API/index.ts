/**
 * API 는 메인 스레드로 노출할 함수를 작성하는 곳입니다.
 *
 * 메인 스레드와 워커 스레드간 데이터 통신은 기본적으로 Copy되어 이동됩니다.
 * 메인 스레드와 워커 스레드간 데이터는 오브젝트 형태만 가능하며, 함수의 형태는 불가능합니다.
 *
 * 콜백 함수 등을 받아야하는 경우, comlink 의 proxy 를 사용하여 작성해야합니다.
 * @link https://github.com/GoogleChromeLabs/comlink
 *
 * 단, comlink 라이브러리의 경우 마찬가지로 콜백에 오브젝트를 받더라도,
 * 함수가 포함되어있을 경우 메인스레드와 워커스레드간 통신이 되지 않습니다.
 */

import {
	CameraComponent,
	RendererComponent,
	SceneComponent,
} from './components';
import { Graphic } from './graphic';
/**
 * API MAP
 */
export const API_MAP = {
	CameraComponentAPI: CameraComponent.API,
	RendererComponentAPI: RendererComponent.API,
	SceneComponentAPI: SceneComponent.API,
	GraphicAPI: Graphic.API,
} as const;

export type API_MAP_Spec = typeof API_MAP;
export type API_MAP_APIKeys = keyof API_MAP_Spec;
export type API_MAP_APIFunctions<K extends API_MAP_APIKeys> =
	keyof API_MAP_Spec[K];

export type API_MAP_APIFuntion<
	K extends API_MAP_APIKeys,
	V extends API_MAP_APIFunctions<K>
> = API_MAP_Spec[K][V];

export type API_MAP_APIFunctionArgs<
	K extends API_MAP_APIKeys,
	V extends API_MAP_APIFunctions<K>
> = API_MAP_APIFuntion<K, V> extends (...args: infer argsType) => any
	? argsType
	: never;

export type API_MAP_APIFuntionReturnType<
	K extends API_MAP_APIKeys,
	V extends API_MAP_APIFunctions<K>
> = API_MAP_APIFuntion<K, V> extends (...args: any) => infer returnType
	? returnType
	: any;
