import { SingletonWorkerFactory } from '../../worker-factory';
import { Viewer } from 'cesium';
import { ObjectRenderer } from './object.renderer';
import { ObjectManager } from './object.manager';
import { ObjectUtil } from './object.util';
import {
	CoreThreadRequestType,
	ICoreThreadRequetMessage,
} from '../../core/core-thread';
import { ObjectPreview } from './object.preview';

export class InterfcaeFactory {
	private readonly coreWorker =
		SingletonWorkerFactory.getWorker('CoreThread');

	private readonly container: HTMLDivElement;

	constructor(private readonly viewer: Viewer) {
		const root = viewer.container.parentElement;

		this.container = document.createElement('div');
		this.container.id = 'ThreeContainer';
		this.container.style.position = 'absolute';
		this.container.style.top = '0';
		this.container.style.left = '0';
		this.container.style.height = '100%';
		this.container.style.width = '100%';
		this.container.style.margin = '0';
		this.container.style.overflow = 'hidden';
		this.container.style.padding = '0';
		this.container.style.pointerEvents = 'none';

		const canvas = document.createElement('canvas');
		this.container.append(canvas);

		if (!root) {
			throw new Error('cannot fond parent element');
		} else {
			root.append(this.container);
		}

		if (viewer.useDefaultRenderLoop) {
			console.warn(
				'Please set Cesium viewer.useDefaultRenderLoop = false for syncronize animation frame to this plug-in'
			);
		}

		// @ts-ignore
		const offscreen = canvas.transferControlToOffscreen();
		offscreen.width = this.viewer.canvas.width;
		offscreen.height = this.viewer.canvas.height;
		this.coreWorker.postMessage(
			{
				CoreThreadRequestType: CoreThreadRequestType.INIT,
				canvas: offscreen,
			} as ICoreThreadRequetMessage,
			[offscreen]
		);
	}

	private _manager: ObjectManager | undefined;
	/**
	 * 오브젝트를 관리하는 메니저 클래스를 가져옵니다.
	 */
	get manager() {
		return this._manager || (this._manager = new ObjectManager());
	}

	private _util: ObjectUtil | undefined;
	/**
	 * 오브젝트의 유용한 기능을 사용할 수 있는 유틸 클래스를 가져옵니다.
	 */
	get util() {
		return this._util || (this._util = new ObjectUtil(this.viewer));
	}

	private _renderer: ObjectRenderer | undefined;
	/**
	 * 오브젝트를 렌더링하기 위한 렌더러 클래스를 가져옵니다.
	 *
	 * @example
	 * const renderer = factory.renderer;
	 * (function animation() {
	 * 	requestAnimationFrame(animation);
	 * 	viewer.render();
	 * 	renderer.render();
	 * })();
	 *
	 */
	get renderer() {
		return (
			this._renderer || (this._renderer = new ObjectRenderer(this.viewer))
		);
	}

	private _preview: ObjectPreview | undefined;
	get preview() {
		return (
			this._preview || (this._preview = new ObjectPreview(this.viewer))
		);
	}
}
