import { SingletonWorkerFactory } from '../core/worker-factory';
import * as Cesium from 'cesium';
import { transfer } from 'comlink';
import { ObjectRenderer } from './object.renderer';
import { ObjectManager } from './object.manager';
import { ObjectUtil } from './object.util';
import { RequestType } from '../core/core-thread';

export class InterfcaeFactory {
	private readonly coreWorker =
		SingletonWorkerFactory.getWorker('CoreThread');

	private readonly container: HTMLDivElement;

	constructor(private readonly viewer: Cesium.Viewer) {
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
				type: RequestType.INIT,
				canvas: offscreen,
			},
			[offscreen]
		);
	}

	private _manager: ObjectManager | undefined;
	get manager() {
		return this._manager || (this._manager = new ObjectManager());
	}

	private _util: ObjectUtil | undefined;
	get util() {
		return this._util || (this._util = new ObjectUtil(this.viewer));
	}

	private _renderer: ObjectRenderer | undefined;
	get renderer() {
		return (
			this._renderer || (this._renderer = new ObjectRenderer(this.viewer))
		);
	}
}
