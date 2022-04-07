import { expose } from 'comlink';
import {
    API_MAP,
    API_MAP_APIFunctionArgs,
    API_MAP_APIFunctions,
    API_MAP_APIFuntionReturnType,
    API_MAP_APIKeys,
} from '.';
import { Cesium3Synchronization } from '../../../../../Utils/Synchronization';
import { CameraComponent } from '../../../../Camera/CameraComponent';
import { WebGLRendererComponent } from '../../WebGLRenderer';
import { RenderSyncer } from './RenderSyncer';

export enum CoreThreadCommands {
    RENDER,
    INIT,
    SYNC,
}

function isCoreThreadCommand(object: any): object is ICoreThreadCommand {
    return typeof (<ICoreThreadCommand>object).runCommand === 'number';
}

export interface ICoreThreadCommand {
    runCommand: CoreThreadCommands;
    param: any;
}

export class CommandReciver {
    constructor() {
        self.onmessage = (e: MessageEvent) => {
            const message = e.data;
            if (isCoreThreadCommand(message)) {
                this.excuteCommand(message);
            }
        };
    }

    excuteCommand(data: ICoreThreadCommand) {
        const param = data.param;
        switch (data.runCommand) {
            case CoreThreadCommands.RENDER:
                RenderSyncer.requestRender();
                break;
            case CoreThreadCommands.INIT:
                WebGLRendererComponent.initRenderer(param);
                break;
            case CoreThreadCommands.SYNC:
                Cesium3Synchronization.syncPerspectiveCamera(
                    CameraComponent.perspectiveCamera,
                    param
                );
                break;
            default:
                break;
        }
    }

    /**
     * API Entrypoint
     * @param apiName
     * @param apiMethod
     * @param args
     * @returns
     */
    excuteAPI<
        API_NAME extends API_MAP_APIKeys,
        API_METHOD extends API_MAP_APIFunctions<API_NAME>,
        API_ARGS extends API_MAP_APIFunctionArgs<API_NAME, API_METHOD>
    >(
        apiName: API_NAME,
        apiMethod: API_METHOD,
        args: API_ARGS
    ): API_MAP_APIFuntionReturnType<API_NAME, API_METHOD> {
        // @ts-ignore
        return API_MAP[apiName][apiMethod](...args);
    }
}

expose(new CommandReciver());
