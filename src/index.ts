import { InterfcaeFactory as Factory } from './app';

/**
 * CesiumGS 와 Three.js 동기화 라이브러리입니다.
 */
export namespace Cesium3 {
    /**
     * Interface Factory
     *
     * @example
     * const viewer = new Cesium.Viewer('cesium-container');
     * const factory = new Cesium3.InterfcaeFactory(viewer);
     *
     */
    export const InterfcaeFactory = Factory;

    /**
     * Version
     */
    export const VERSION = '0dev';
}

export * from './meta';
export * from './math';
