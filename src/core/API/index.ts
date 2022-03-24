import { SceneAPI } from './scene-api';

const API_MAP = {
	SceneAPI: SceneAPI,
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
> = API_MAP_APIFuntion<K, V> extends (...args: infer A) => any ? A : never;

export type API_MAP_APIFuntionReturnType<
	K extends API_MAP_APIKeys,
	V extends API_MAP_APIFunctions<K>
> = API_MAP_APIFuntion<K, V> extends (...args: any) => infer R ? R : any;

export function excute<
	API_NAME extends API_MAP_APIKeys,
	API_METHOD extends API_MAP_APIFunctions<API_NAME>,
	API_ARGS extends API_MAP_APIFunctionArgs<API_NAME, API_METHOD>
>(apiName: API_NAME, apiMethod: API_METHOD, args: API_ARGS) {
	const api = getMethod(apiName, apiMethod);
	console.log(api, args);
}

function getMethod<
	API_NAME extends API_MAP_APIKeys,
	API_METHOD extends API_MAP_APIFunctions<API_NAME>
>(apiName: API_NAME, apiMethod: API_METHOD) {
	return API_MAP[apiName][apiMethod] as unknown as {
		(...args: any): API_MAP_APIFuntionReturnType<API_NAME, API_METHOD>;
	};
}
