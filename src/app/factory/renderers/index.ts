import * as Cesium from 'cesium';
import PerspectiveFrustum from 'cesium/Source/Core/PerspectiveFrustum';
import { CameraComponent } from '../../../core/API/components';
import { BaseRenderer } from './BaseRenderer';
import { Object3DCSS2DRenderer } from './Object3DCSS2DRenderer';
import { Object3DWebGLRenderer } from './Object3DWebGLRenderer';

/**
 * 이곳에서 사용할 렌더러들을 선언합니다.
 */
namespace RendererDefiner {
    /**
     * 이곳에서 사용할 렌더러의 클래스를 정의합니다.
     */
    export interface IBaseRendererClassMap {
        CSS2DRenderer: Object3DCSS2DRenderer;
        WebGLRenderer: Object3DWebGLRenderer;
    }

    /**
     * 렌더러의 클래스 커넥션을 담당하는 맵입니다.
     * KEY & VALUE 는 IBaseRendererClassMap 과 동일해야합니다.
     */
    export const BaseRendererClassMap: { [key: string]: typeof BaseRenderer } = {
        CSS2DRenderer: Object3DCSS2DRenderer,
        WebGLRenderer: Object3DWebGLRenderer,
    } as const;

    export type BaseRenderMap = typeof BaseRendererClassMap[keyof typeof BaseRendererClassMap];
}

namespace RendererManager {
    export const rendererMap = new Map<string, BaseRenderer>();

    export const setRenderer = (renderer: BaseRenderer) => {
        rendererMap.set(renderer.name, renderer);
    };

    export const getRenderer = (name: string) => {
        return rendererMap.get(name);
    };

    const getCesiumCameraMatrix = (
        viewer: Cesium.Viewer
    ): CameraComponent.API.PerspectiveCameraInitParam => {
        return {
            fov: Cesium.Math.toDegrees((viewer.camera.frustum as PerspectiveFrustum).fovy),
            near: viewer.camera.frustum.near,
            far: viewer.camera.frustum.far,
            aspect: viewer.canvas.clientWidth / viewer.canvas.clientHeight,
        };
    };

    let _oldWidth: number | undefined;
    let _oldHeight: number | undefined;
    export const updateAll = (viewer: Cesium.Viewer) => {
        const width = viewer.canvas.clientWidth;
        const height = viewer.canvas.clientHeight;

        if (_oldHeight !== height || _oldWidth !== width) {
            const param = getCesiumCameraMatrix(viewer);
            for (const [_, renderer] of rendererMap) {
                renderer.setSize(width, height);
                renderer.setCamera(param);
            }
        }

        _oldWidth = width;
        _oldHeight = height;
    };

    export const renderAll = () => {
        for (const [_, renderer] of rendererMap) {
            renderer.render();
        }
    };
}

export class Renderers {
    constructor(private readonly viewer: Cesium.Viewer, container: HTMLDivElement) {
        const classKeys = Object.keys(RendererDefiner.BaseRendererClassMap);
        for (const key of classKeys) {
            const RendererClass = RendererDefiner.BaseRendererClassMap[key];
            RendererManager.setRenderer(new RendererClass(viewer, container));
        }
    }

    /**
     * 모든 렌더러에게 다음 장면을 요청합니다.
     */
    render() {
        RendererManager.updateAll(this.viewer);
        RendererManager.renderAll();
    }

    /**
     * 렌더러를 가져옵니다.
     * @param key
     * @returns
     */
    getRenderer<T extends keyof RendererDefiner.IBaseRendererClassMap>(
        key: T
    ): RendererDefiner.IBaseRendererClassMap[T] {
        return <RendererDefiner.IBaseRendererClassMap[T]>RendererManager.getRenderer(key)!;
    }
}
