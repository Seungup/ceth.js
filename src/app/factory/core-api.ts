import {
	API_MAP_APIFunctionArgs,
	API_MAP_APIFunctions,
	API_MAP_APIFuntionReturnType,
	API_MAP_APIKeys,
} from '../../core/API';
import { CoreThreadCommand, ICoreThreadCommand } from '../../core/core-thread';
import { SingletonWorkerFactory } from '../../worker-factory';

export class CoreAPI {
	private static readonly coreWorker =
		SingletonWorkerFactory.getWorker('CoreThread');
	private static readonly coreWrapper =
		SingletonWorkerFactory.getWrapper('CoreThread');

	/**
	 * 워커 스레드와 직접적으로 통신을 주고 받을 수 있는 API 실행 컨텍스트입니다.
	 * @param apiName
	 * @param apiMethod
	 * @param args
	 * @returns
	 */
	static async excuteAPI<
		API_NAME extends API_MAP_APIKeys,
		API_METHOD extends API_MAP_APIFunctions<API_NAME>,
		API_ARGS extends API_MAP_APIFunctionArgs<API_NAME, API_METHOD>
	>(
		apiName: API_NAME,
		apiMethod: API_METHOD,
		args: API_ARGS
	): Promise<API_MAP_APIFuntionReturnType<API_NAME, API_METHOD>> {
		// @ts-ignore
		return await this.coreWrapper.excuteAPI(apiName, apiMethod, args);
	}

	/**
	 * 워커 스레드에 데이터를 송신합니다.
	 *
	 * @param command
	 * @param args
	 * @param transfer
	 */
	static async excuteCommand(
		runCommand: CoreThreadCommand,
		args: {
			[key: string]: any;
		},
		transfer?: Array<Transferable | OffscreenCanvas>
	) {
		this.coreWorker.postMessage(
			{
				runCommand: runCommand,
				param: args,
			} as ICoreThreadCommand,
			transfer
		);
	}
}
