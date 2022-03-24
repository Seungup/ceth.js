import * as Cesium from 'cesium';
import { mousePositionToWGS84 } from '..';
import { IWGS84 } from '../..';

export class ObjectUtil {
	constructor(private readonly viewer: Cesium.Viewer) {
		this.viewer.canvas.addEventListener(
			'contextmenu',
			this._onContextMenu.bind(this)
		);
	}

	private _onContextMenu(event: MouseEvent) {
		const position = mousePositionToWGS84(this.viewer, event);
		if (position) {
			this.onSelectLocation(position);
		}
	}

	onSelectLocation: { (location: IWGS84): void } = () => {};
}
