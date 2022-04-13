import { Controller } from "lil-gui";
import { randFloat, randInt } from "three/src/math/MathUtils";
import { RendererContext } from "../../src/App/Contexts/RendererContext";
import {
    DataAccessorBuildData,
    DataAccessorFactory,
} from "../../src/App/Data/DataAccessorFactory";
import { WGS84_ACTION } from "../../src/App/Math";
import * as THREE from "three";

const dataAccessorArray = new Array<DataAccessorBuildData>();

let removeAllController: Controller | undefined;
let updateRandomPositionController: Controller | undefined;
let addController: Controller | undefined;
export function setAddController(ctrl: Controller) {
    addController = ctrl;
}

export function setRemoveAllController(ctrl: Controller) {
    removeAllController = ctrl;
}

export function setUpdateRandomPositionController(ctrl: Controller) {
    updateRandomPositionController = ctrl;
}
/**
 * !수정사항 목록
 * * InstancedMesh 의 경우, 한번 생성 시 matrix 의 scale 조정이 따로 없을 경우 , 적용되지 않음.
 * * InstancedMesh는 처음 Geometry와 Matrial 이 결정된 상태에서 Matrix만 추가되거나, 변경, 삭제되는데 이 경우에 Geomtry의 생성 옵션 값은 무시되므로,
 */
export const API = {
    width: 25000,
    hegith: 25000,
    depth: 1,
    count: 1_000,
    skibbleFameCount: 0,
    maxRandomLat: 50,
    maxRandomLon: 50,
    add: async () => {
        addController?.disable();
        const renderer = RendererContext.getRenderer(
            "MultipleOffscreenRenderer"
        );

        const mlat = API.maxRandomLat,
            mlon = API.maxRandomLon;
        for (let i = 0, len = API.count; i < len; i++) {
            dataAccessorArray.push(
                await renderer.dynamicAppend(
                    new THREE.Mesh(
                        new THREE.BoxBufferGeometry(
                            API.width,
                            API.hegith,
                            API.depth
                        ),
                        new THREE.MeshBasicMaterial({
                            side: THREE.DoubleSide,
                            color: 0xffffff * Math.random(),
                        })
                    ),
                    randInt(0, renderer.workerArray.length - 1),
                    {
                        position: {
                            wgs84: {
                                height: 0,
                                latitude: randFloat(0, mlat),
                                longitude: randFloat(0, mlon),
                            },
                        },
                        headingPitchRoll: {
                            heading: 0,
                            pitch: 0,
                            roll: 0,
                        },
                        visibility: true,
                    }
                )
            );
        }
        addController?.enable();
    },
    updateRandomPosition: async () => {
        updateRandomPositionController?.disable();

        const mlat = API.maxRandomLat,
            mlon = API.maxRandomLon;

        for (let i = 0, len = dataAccessorArray.length; i < len; i++) {
            await DataAccessorFactory.getCachedAccessor(
                dataAccessorArray[i]
            ).setWGS84(
                {
                    height: 0,
                    latitude: randFloat(0, mlat),
                    longitude: randFloat(0, mlon),
                },
                WGS84_ACTION.NONE
            );
        }
        updateRandomPositionController?.enable();
    },
    removeAll: async () => {
        removeAllController?.disable();
        console.time("delete");
        while (dataAccessorArray.length) {
            await DataAccessorFactory.getCachedAccessor(
                dataAccessorArray.pop()
            ).remove();
        }
        console.timeEnd("delete");
        removeAllController?.enable();
    },
    lonGap: Math.random(),
    latGap: Math.random(),
};
