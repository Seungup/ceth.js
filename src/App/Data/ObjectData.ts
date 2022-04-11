import { Box3, Euler, Object3D, Vector3 } from "three";
import { IWGS84 } from "../Math";

export namespace ObjectData {
    interface PositionRotationScale {
        position: Vector3;
        rotation: Euler;
        scale: Vector3;
    }

    const box3Map = new Map<number, Box3>();
    const RPSMap = new Map<number, PositionRotationScale>();
    const wgs84Map = new Map<number, IWGS84>();

    export namespace API {
        export const getPositionRotationScale = (id: number) => {
            return RPSMap.get(id);
        };

        export const getBox3Max = (id: number) => {
            return box3Map.get(id)?.max;
        };

        export const getWGS84 = (id: number) => {
            return wgs84Map.get(id);
        };
    }

    export const remove = (id: number) => {
        RPSMap.delete(id);
        box3Map.delete(id);
        wgs84Map.delete(id);
    };

    export const setPositionRotationScaleByObject3D = (object: Object3D) => {
        RPSMap.set(object.id, {
            position: object.position.clone(),
            rotation: object.rotation.clone(),
            scale: object.scale.clone(),
        });
    };

    export const setBox3ByObject3D = (object: Object3D) => {
        box3Map.set(object.id, new Box3().setFromObject(object));
    };

    export const setBox3 = (id: number, box3: Box3) => {
        box3Map.set(id, box3);
    };

    export const setWGS84 = (id: number, wgs84: IWGS84) => {
        wgs84Map.set(id, wgs84);
    };
}
