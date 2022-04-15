import { Controller } from "lil-gui";
import { randFloat } from "three/src/math/MathUtils";
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

export const guiStatsEl = document.createElement("div");
guiStatsEl.classList.add("gui-stats");

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
            const start = Date.now();
            for (let i = 0, len = API.count; i < len; i++) {
                guiStatsEl.innerHTML = [
                    "<i>Add calls</i>: " + (i + 1) + "/" + len,
                    "<i>Percent</i>:   " +
                        (((i + 1) / len) * 100).toFixed(2) +
                        "%",
                ].join("<br><br>");

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
                    {
                        position: {
                            wgs84: {
                                height: 0,
                                latitude: randFloat(0, API.maxRandomLat),
                                longitude: randFloat(0, API.maxRandomLon),
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
            const end = Date.now();
            guiStatsEl.innerHTML +=
                "<br><br>" +
                [
                    `----RESULT----`,
                    `<i>Total<i>: ~` +
                        Number(
                            ((end - start) / 1000).toFixed(2)
                        ).toLocaleString() +
                        " sec",
                    `<i>Performance<i>: ~` +
                        (~~(
                            (API.count / (end - start)) *
                            1000
                        )).toLocaleString() +
                        ` items/sec`,
                ].join("<br><br>");
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

            const start = Date.now();
            for (let i = 0, len = dataAccessorArray.length; i < len; i++) {
                guiStatsEl.innerHTML = [
                    "<i>Update calls</i>: " + (i + 1) + "/" + len,
                    "<i>Percent</i>: " +
                        (((i + 1) / len) * 100).toFixed(2) +
                        "%",
                ].join("<br><br>");
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
            const end = Date.now();
            guiStatsEl.innerHTML +=
                "<br><br>" +
                [
                    `----RESULT----`,
                    `<i>Total<i>: ~` +
                        Number(
                            ((end - start) / 1000).toFixed(2)
                        ).toLocaleString() +
                        " sec",
                    `<i>Performance<i>: ~` +
                        (~~(
                            (API.count / (end - start)) *
                            1000
                        )).toLocaleString() +
                        ` items/sec`,
                ].join("<br><br>");
        } catch (error) {
        } finally {
            updateRandomPositionController?.enable();
        }
    },
    removeAll: async () => {
        removeAllController?.disable();
        try {
            let i = 0,
                len = dataAccessorArray.length;
            const start = Date.now();
            while (dataAccessorArray.length) {
                guiStatsEl.innerHTML = [
                    "<i>Remove calls</i>: " + (i + 1) + "/" + len,
                    "<i>Percent</i>: " +
                        (((i + 1) / len) * 100).toFixed(2) +
                        "%",
                ].join("<br><br>");
                i++;
                try {
                    await DataAccessorFactory.getCachedAccessor(
                        dataAccessorArray.pop()
                    ).remove();
                } catch (error) {
                    console.error(error);
                }
            }
            const end = Date.now();
            guiStatsEl.innerHTML +=
                "<br><br>" +
                [
                    `----RESULT----`,
                    `<i>Total<i>: ~` +
                        Number(
                            ((end - start) / 1000).toFixed(2)
                        ).toLocaleString() +
                        " sec",
                    `<i>Performance<i>: ~` +
                        (~~(
                            (API.count / (end - start)) *
                            1000
                        )).toLocaleString() +
                        ` items/sec`,
                ].join("<br><br>");
        } catch (error) {
        } finally {
            removeAllController?.enable();
        }
    },
    lonGap: Math.random(),
    latGap: Math.random(),
};
