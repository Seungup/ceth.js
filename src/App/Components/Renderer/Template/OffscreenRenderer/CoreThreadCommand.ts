import {
    API_MAP_APIFunctionArgs,
    API_MAP_APIFunctions,
    API_MAP_APIFuntionReturnType,
    API_MAP_APIKeys,
    CoreThreadCommands,
} from "./Core/CommandReciver";
import { CommandReciverCacheRegister } from "./Core/CommandReciverCacheRegister";

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
        worker: Worker,
        apiName: API_NAME,
        apiMethod: API_METHOD,
        args: API_ARGS
    ): Promise<API_MAP_APIFuntionReturnType<API_NAME, API_METHOD>> => {
        // prettier-ignore
        // @ts-ignore
        return CommandReciverCacheRegister.getRemote(worker).excuteAPI(apiName, apiMethod, args);
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
