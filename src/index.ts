import { Utils as Cesium3Utils } from './app';
import { Viewer } from 'cesium';

/**
 * CesiumGS 와 Three.js 동기화 라이브러리입니다.
 */
export * from './meta';
export * from './math';
export * from './app';

import { Context } from './app/context';

export class Cesium3 {
    static Utils = Cesium3Utils;

    context = Context;
    constructor(viewer: Viewer) {
        this.context.viewer = viewer;
    }

    /**
     * Version
     */
    VERSION = '0dev';
}
