import { expose } from 'comlink';
import { CoreThreadCommand, ICoreThreadCommand, isCoreThreadCommand } from '.';
import {
	API_MAP,
	API_MAP_APIFunctionArgs,
	API_MAP_APIFunctions,
	API_MAP_APIFuntionReturnType,
	API_MAP_APIKeys,
} from './API';
import { Graphic, InitParam, RenderParam } from './graphic';
import { RenderQueue } from './render-queue';

export default class CoreThread {
	private readonly graphic = Graphic.getInstance();

	private _renderQueue = new RenderQueue();

	constructor() {
		this._renderQueue.renderNextFrame$.subscribe(() => {
			self.postMessage({ type: 'onRender' });
		});

		// 짧은 시간안에 즉각적으로 실행되어야하는 메서드의 경우 PostMessage 를 통하여 인자값을 전달 받습니다.

		self.onmessage = (e: MessageEvent) => {
			const message = e.data;
			if (isCoreThreadCommand(message)) {
				this.excuteCommand(message);
			}
		};
	}

	excuteCommand(data: ICoreThreadCommand) {
		debugger;
		switch (data.runCommand) {
			case CoreThreadCommand.RENDER:
				this._renderQueue.requestRender(data.param as RenderParam);
				break;
			case CoreThreadCommand.INIT:
				this.graphic.init(data.param as InitParam);
				break;
			default:
				break;
		}
	}

	/**
	 * API
	 * @param apiName
	 * @param apiMethod
	 * @param args
	 * @returns
	 */
	excuteAPI<
		API_NAME extends API_MAP_APIKeys,
		API_METHOD extends API_MAP_APIFunctions<API_NAME>,
		API_ARGS extends API_MAP_APIFunctionArgs<API_NAME, API_METHOD>
	>(apiName: API_NAME, apiMethod: API_METHOD, args: API_ARGS) {
		return (
			API_MAP[apiName][apiMethod] as unknown as {
				(...args: any): API_MAP_APIFuntionReturnType<
					API_NAME,
					API_METHOD
				>;
			}
		)(...args);
	}
}

expose(new CoreThread());
