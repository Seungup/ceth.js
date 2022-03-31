import { expose } from 'comlink';
import {
    API_MAP,
    API_MAP_APIFunctionArgs,
    API_MAP_APIFunctions,
    API_MAP_APIFuntionReturnType,
    API_MAP_APIKeys,
} from './API';
import { RendererComponent } from './API/components';
import { RenderQueue } from './API/utils';

export enum CoreThreadCommand {
    RENDER,
    INIT,
}

function isCoreThreadCommand(object: any): object is ICoreThreadCommand {
    return typeof (<ICoreThreadCommand>object).runCommand === 'number';
}

export interface ICoreThreadCommand {
    runCommand: CoreThreadCommand;
    param: any;
}

export default class CoreThread {
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
            case CoreThreadCommand.RENDER:
                RenderQueue.requestRender(param);
                break;
            case CoreThreadCommand.INIT:
                RendererComponent.initializationWebGLRenderer(param);
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
        const func = API_MAP[apiName][apiMethod];

        func;

        // @ts-ignore
        return API_MAP[apiName][apiMethod](...args);
    }
}

expose(new CoreThread());
