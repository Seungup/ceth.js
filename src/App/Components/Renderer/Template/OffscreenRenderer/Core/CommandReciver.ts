import { expose } from 'comlink';
import { Cesium3Synchronization } from '../../../../../Utils/Synchronization';
import { WorkerRenderSyncer } from './WorkerRenderSyncer';
import { ObjectData } from '../../../../../Data/ObjectData';
import { CameraComponent } from '../../../../Camera/CameraComponent';
import { SceneComponent } from '../../../../Scene/SceneComponent';
import { WebGLRendererComponent } from '../../WebGLRenderer';
import { WorkerRenderer } from './WorkerRenderer';

export const API_MAP = {
    CameraComponentAPI: CameraComponent.API,
    RendererComponentAPI: WebGLRendererComponent.API,
    SceneComponentAPI: SceneComponent.API,
    WorkerRenderer: WorkerRenderer.API,
    ObjectDataAPI: ObjectData.API,
} as const;

export type API_MAP_Spec = typeof API_MAP;
export type API_MAP_APIKeys = keyof API_MAP_Spec;
export type API_MAP_APIFunctions<K extends API_MAP_APIKeys> = keyof API_MAP_Spec[K];

export type API_MAP_APIFuntion<
    K extends API_MAP_APIKeys,
    V extends API_MAP_APIFunctions<K>
> = API_MAP_Spec[K][V];

export type API_MAP_APIFunctionArgs<
    K extends API_MAP_APIKeys,
    V extends API_MAP_APIFunctions<K>
> = API_MAP_APIFuntion<K, V> extends (...args: infer argsType) => any ? argsType : never;

export type API_MAP_APIFuntionReturnType<
    K extends API_MAP_APIKeys,
    V extends API_MAP_APIFunctions<K>
> = API_MAP_APIFuntion<K, V> extends (...args: any) => infer returnType ? returnType : any;

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
                WorkerRenderSyncer.requestRender();
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
