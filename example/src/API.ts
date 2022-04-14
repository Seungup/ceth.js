import { Controller } from "lil-gui";
import { randFloat, randInt } from "three/src/math/MathUtils";
import { RendererContext } from "../../src/App/Contexts/RendererContext";
import {
    DataAccessorBuildData,
    DataAccessorFactory,
} from "../../src/App/Data/DataAccessorFactory";
import { WGS84_ACTION } from "../../src/App/Math";
import * as THREE from "three";
import type { Accessor } from "../../src/App/Data/Accessor/DataAccessor";

const dataAccessorArray = new Array<DataAccessorBuildData<Accessor>>();

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
    maxRandomLat: THREE.MathUtils.randInt(0, 50),
    maxRandomLon: THREE.MathUtils.randInt(0, 50),
    add: async () => {
        addController?.disable();
        try {
            const renderer = RendererContext.getRenderer(
                "MultipleOffscreenRenderer"
            );
            const [mlat, mlon] = [API.maxRandomLat, API.maxRandomLon];

            for (let i = 0, len = API.count; i < len; i++) {
                const buildData = await renderer.dynamicAppend(
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
                    randInt(0, renderer.length - 1),
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
                );

                dataAccessorArray.push(buildData);
            }
        } catch (error) {
        } finally {
            addController?.enable();
        }
    },
    updateRandomPosition: async () => {
        updateRandomPositionController?.disable();
        try {
            const mlat = API.maxRandomLat,
                mlon = API.maxRandomLon;

            for (let i = 0, len = dataAccessorArray.length; i < len; i++) {
                await DataAccessorFactory.getCachedAccessor(
                    dataAccessorArray[i]
                )?.setWGS84(
                    {
                        height: 0,
                        latitude: randFloat(0, mlat),
                        longitude: randFloat(0, mlon),
                    },
                    WGS84_ACTION.NONE
                );
            }
        } catch (error) {
        } finally {
            updateRandomPositionController?.enable();
        }
    },
    removeAll: async () => {
        removeAllController?.disable();
        try {
            console.time("delete");
            while (dataAccessorArray.length) {
                try {
                    await DataAccessorFactory.getCachedAccessor(
                        dataAccessorArray.pop()
                    ).remove();
                } catch (error) {
                    console.error(error);
                }
            }
            console.timeEnd("delete");
        } catch (error) {
        } finally {
            removeAllController?.enable();
        }
    },
    lonGap: Math.random(),
    latGap: Math.random(),
};
