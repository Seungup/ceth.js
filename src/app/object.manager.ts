import { Box3, Object3D } from "three";
import { CT_WGS84, IWGS84 } from "../core";
import { SingletonWorkerFactory } from "../core/worker-factory";
import { ObjectAPI } from "./object.api";

export interface RequestResult {
  objectId: number;
  result: boolean;
}

export class ObjectManager {
  private readonly coreWrapper =
    SingletonWorkerFactory.getWrapper("CoreThread");

  async add(object: Object3D, position?: IWGS84): Promise<ObjectAPI> {
    
	const wgs84 = position
      ? CT_WGS84.fromCesiumWGS84(
          position.latitude,
          position.longitude,
          position.height
        )
      : undefined;

	if (wgs84 && wgs84.height === 0) {
		wgs84.height = new Box3().setFromObject(object).max.y;
	}	

    const id = await this.coreWrapper.add(
      object.toJSON(),
      wgs84?.toJSON(),
    );
    return new ObjectAPI(id);
  }

  async get(id: number) {
    const isExist = await this.coreWrapper.isExist(id);
    if (isExist) return new ObjectAPI(id);
  }

  async updateObject(id: number, object: Object3D): Promise<RequestResult> {
    return {
      objectId: id,
      result: await this.coreWrapper.update(id, object.toJSON()),
    };
  }
}
