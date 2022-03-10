import { Subject } from 'rxjs';
import { Graphic, RenderParam } from './graphic';

/**
 * Cesium 과 three.js 의 스레드 간 렌더 비동기 이슈를 해결합니다.
 */
export class RenderQueue {
	private readonly graphic = Graphic.getInstance();
	private param: RenderParam | undefined;
	private readonly _renderSubject = new Subject<void>();
	readonly renderNextFrame$ = this._renderSubject.pipe();

	/**
	 * 다음 장면을 그립니다.
	 */
	private _render() {
		if (this.param) {
			this.graphic.render(this.param);
			this.param = undefined;
			this._renderSubject.next();
		}
		this._isRequestRender = false;
	}

	private _isRequestRender: boolean = false;
	/**
	 * 다음 장면을 요청합니다.
	 * @param param 렌더링 파라미터
	 */
	requestRender(param: RenderParam) {
		if (!this._isRequestRender) {
			this._isRequestRender = true;
			this.param = param;
			this._render();
		}
	}
}
