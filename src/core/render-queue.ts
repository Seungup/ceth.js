import { Subject } from "rxjs";
import { Graphic, RenderParam } from "./graphic";

/**
 * Cesium 과 three.js 의 스레드 간 렌더 비동기 이슈를 해결합니다.
 */
export class RenderQueue {
  private readonly _queue: RenderParam[] = [];
  private readonly graphic = Graphic.getInstance();
  private param: RenderParam | undefined;
  private _handle: number | undefined;
  private readonly _bindRenderNextAnimationFrame =
    this._renderNextAnimationFrame.bind(this);
  private readonly _renderSubject = new Subject<void>();
  readonly renderNextFrame$ = this._renderSubject.pipe();

  /**
   * 다음 장면을 그립니다.
   */
  private _renderNextAnimationFrame() {
    this.param = this._queue.pop();
    if (this.param) {
      this.graphic.render(this.param);
    }
    this._handle = requestAnimationFrame(this._bindRenderNextAnimationFrame);
    this._renderSubject.next();
  }

  /**
   * 다음 장면을 요청합니다.
   * @param param 렌더링 파라미터
   */
  updateNextAnimationFrame(param: RenderParam) {
    if (this._queue.length) {
      this._queue[0] = param;
    } else {
      this._queue.push(param);
    }

    if (!this._handle) this._renderNextAnimationFrame();
  }
}
