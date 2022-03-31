import { CameraComponent } from '../../../core/API/components';

export class BaseRenderer {
    setSize(width: number, height: number) {
        throw new Error('not implements');
    }

    setCamera(param: CameraComponent.API.CameraInitParam) {
        throw new Error('not implements');
    }

    render() {
        throw new Error('not implements');
    }
}
