import { Viewer } from 'cesium';
import { ObjectRenderer } from './object.renderer';
import { ObjectManager } from './object.manager';
import { ObjectEvent } from './object.event';
import { ObjectPreview } from './object.preview';
import { CoreAPI } from './core-api';
import { CoreThreadCommand } from '../../core';

export class InterfcaeFactory {
	constructor(private readonly viewer: Viewer) {
		const root = viewer.container.parentElement;

		const container = document.createElement('div');
		container.id = 'ThreeContainer';
		container.style.position = 'absolute';
		container.style.top = '0';
		container.style.left = '0';
		container.style.height = '100%';
		container.style.width = '100%';
		container.style.margin = '0';
		container.style.overflow = 'hidden';
		container.style.padding = '0';
		container.style.pointerEvents = 'none';

		const canvas = document.createElement('canvas');
		container.append(canvas);

		if (!root) {
			throw new Error('cannot fond parent element');
		} else {
			root.append(container);
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
		CoreAPI.excuteCommand(CoreThreadCommand.INIT, { canvas: offscreen }, [
			offscreen,
		]);
	}

	private _manager: ObjectManager | undefined;
	/**
	 * 오브젝트를 관리하는 메니저 클래스를 가져옵니다.
	 */
	get manager() {
		return this._manager || (this._manager = new ObjectManager());
	}

	private _event: ObjectEvent | undefined;
	/**
	 * 오브젝트의 유용한 기능을 사용할 수 있는 유틸 클래스를 가져옵니다.
	 */
	get event() {
		return this._event || (this._event = new ObjectEvent(this.viewer));
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
