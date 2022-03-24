import { REVISION } from '../dist';
import { InterfcaeFactory } from './app';

/**
 * CesiumGS 와 Three.js 동기화 라이브러리입니다.
 */
export namespace Cesium3 {
	/**
	 * Interface Factory
	 *
	 * @example
	 * const viewer = new Cesium.Viewer('cesium-container');
	 * const factory = new Cesium3.Factory(viewer);
	 *
	 */
	export const Factory = InterfcaeFactory;

	/**
	 * Version
	 */
	export const VERSION = REVISION;
}

export * from './meta';
export * from './math';
