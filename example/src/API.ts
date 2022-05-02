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
import { Symbol } from "milsymbol";
import { FrontSide } from "three";

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

async function Add() {
    addController?.disable();
    try {
        const renderer = RendererContext.getRenderer(
            "MultipleOffscreenRenderer"
        );
        const start = Date.now();
        const bitmap = await createImageBitmap(
            new Symbol("sfgpewrh--mt").asCanvas()
        );
        for (let i = 0, len = API.count; i < len; i++) {
            guiStatsEl.innerHTML = [
                "<i>Add calls</i>: " + (i + 1) + "/" + len,
                "<i>Percent</i>:   " + (((i + 1) / len) * 100).toFixed(2) + "%",
            ].join("<br><br>");

            const buildData = await renderer.add(
                new THREE.Mesh(
                    new THREE.PlaneBufferGeometry(
                        bitmap.width + API.addScala,
                        bitmap.height + API.addScala
                    ),
                    new THREE.MeshBasicMaterial({ side: FrontSide })
                ),
                {
                    wgs84: {
                        height: 0,
                        latitude: randFloat(0, API.maxRandomLat),
                        longitude: randFloat(0, API.maxRandomLon),
                    },
                },
                bitmap
            );

            dataAccessorArray.push(buildData);
        }
        const end = Date.now();
        guiStatsEl.innerHTML +=
            "<br><br>" +
            [
                `----RESULT----`,
                `<i>Total<i>: ~` +
                    Number(((end - start) / 1000).toFixed(2)).toLocaleString() +
                    " sec",
                `<i>Performance<i>: ~` +
                    (~~((API.count / (end - start)) * 1000)).toLocaleString() +
                    ` items/sec`,
            ].join("<br><br>");
    } catch (error) {
        console.error(error);
    } finally {
        addController?.enable();
    }
}

export const API = {
    addScala: 100000,
    count: 1_000,
    skibbleFameCount: 0,
    maxRandomLat: THREE.MathUtils.randInt(0, 50),
    maxRandomLon: THREE.MathUtils.randInt(0, 50),
    add: Add,
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
