import * as Cesium from 'cesium'
import { IWGS84 } from '../core';

export function getCameraPosition(viewer: Cesium.Viewer) {
    const result = new Cesium.Cartographic();
    viewer.scene.globe.ellipsoid.cartesianToCartographic(viewer.camera.positionWC, result)
    return {
        longitude: Cesium.Math.toDegrees(result.longitude),
        latitude: Cesium.Math.toDegrees(result.latitude),
        height: result.height
    } as IWGS84;
}