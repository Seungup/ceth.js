import { Viewer } from 'cesium';
import { CameraComponent } from '../../../core/API/components';

export class BaseRenderer {
    name: string = 'BaseRenderer';

    protected readonly viewer: Viewer;
    protected readonly container: HTMLDivElement;
    constructor(viewer: Viewer, container: HTMLDivElement) {
        this.viewer = viewer;
        this.container = container;
    }

    /**
     * 렌더러의 크기를 설정합니다.
     * @param width
     * @param height
     */
    setSize(width: number, height: number): void {
        throw new Error(`setSize was not implemented.`);
    }

    /**
     * 카메라의 설정값을 변경합니다.
     * @param param
     */
    setCamera(param: CameraComponent.API.PerspectiveCameraInitParam): void {
        throw new Error(`setCamera was not implemented.`);
    }

    /**
     * 장면을 렌더링합니다.
     */
    render(): void {}
}
