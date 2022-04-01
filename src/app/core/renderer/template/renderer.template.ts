import { CameraComponent } from '../../../../core/API/components';

export class RendererTemplate {
    name: string = 'RendererTemplate';

    /**
     * 렌더러의 크기를 설정합니다.
     * @param width
     * @param height
     */
    setSize(width: number, height: number): void {}

    /**
     * 카메라의 설정값을 변경합니다.
     * @param param
     */
    setCamera(param: CameraComponent.API.PerspectiveCameraInitParam): void {}

    /**
     * 장면을 렌더링합니다.
     */
    render(): void {}
}
