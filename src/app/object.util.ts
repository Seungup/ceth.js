import * as Cesium from "cesium";
import { Box3, Object3D } from "three";
import { SingletonWorkerFactory } from "../core/worker-factory";

export class ObjectUtil {
  private readonly coreWrapper =
    SingletonWorkerFactory.getWrapper("CoreThread");

  constructor(private readonly viewer: Cesium.Viewer) {}

  async flyTo(id: number) {
    debugger;
    let position = await this.coreWrapper.getWGS84(id);
    if (position) {
      const wgs84Position = Cesium.Cartesian3.fromDegrees(
        position.latitude,
        position.longitude,
        position.height
      );
      const result = await this.coreWrapper.getBox3(id);
      const radius = result ? result.z * 2 : undefined;
      this.viewer.camera.flyToBoundingSphere(
        new Cesium.BoundingSphere(wgs84Position, radius)
      );
    }
  }
}
