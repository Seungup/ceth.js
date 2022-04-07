import { CommandReciver, CoreThreadCommands } from './Core/CommandReciver';
import { Remote } from 'comlink';
import {
    API_MAP_APIFunctionArgs,
    API_MAP_APIFunctions,
    API_MAP_APIFuntionReturnType,
    API_MAP_APIKeys,
} from './Core';

export namespace CoreThreadCommand {
    /**
     *
     * @param apiName
     * @param apiMethod
     * @param args
     * @returns
     */
    export const excuteAPI = async <
        API_NAME extends API_MAP_APIKeys,
        API_METHOD extends API_MAP_APIFunctions<API_NAME>,
        API_ARGS extends API_MAP_APIFunctionArgs<API_NAME, API_METHOD>
    >(
        wrapper: Remote<CommandReciver>,
        apiName: API_NAME,
        apiMethod: API_METHOD,
        args: API_ARGS
    ): Promise<API_MAP_APIFuntionReturnType<API_NAME, API_METHOD>> => {
        // @ts-ignore
        // prettier-ignore
        return wrapper.excuteAPI(apiName, apiMethod, args);
    };

    /**
     *
     * @param runCommand
     * @param args
     * @param transfer
     */
    export const excuteCommand = async (
        worker: Worker,
        runCommand: CoreThreadCommands,
        args: {
            [key: string]: any;
        } = {},
        transfer?: Array<Transferable | OffscreenCanvas>
    ) => {
        worker.postMessage(
            {
                runCommand: runCommand,
                param: args,
            },
            transfer
        );
    };
}
