import { Matrix4 } from 'cesium';
import { wrap } from 'comlink';
import { Object3D } from 'three';
import { randInt } from 'three/src/math/MathUtils';
import { Cesium3 } from '../../..';
import { ApplicationContext } from '../../../context';
import { ObjectAPI } from '../../../objects';
import { WorkerDataAccessStaytagy } from '../../data/WorkerDataAccessStrategy';
import { WorkerFactory } from '../../worker.factory';
import { CoreThreadCommand } from './OffscreenRenderer/core-thread.command';
import { CommandReciver, CoreThreadCommands } from './OffscreenRenderer/core/command-reciver';
import { BaseRenderer, PerspectiveCameraInitParam } from './renderer.template';

export class MultipleOffscreenRenderer extends BaseRenderer {
    constructor() {
        super();
        this.name = 'MultipleOffscreenRenderer';
    }

    private _workerArray = new Array<Worker>();
    private isInitialization = false;
    makeCanvases(count: number) {
        if (count < this._workerArray.length) {
            throw new Error('Unable to reduce the number in the runtime environment.');
        }

        const context = ApplicationContext.getInstance();
        if (!context.viewer) {
            throw new Error('Context is not initialized.');
        }
        const width = context.viewer.canvas.width;
        const height = context.viewer.canvas.height;

        for (let i = 0; i < count; i++) {
            const worker = WorkerFactory.createWorker('CommandReciver');

            const canvas = document.createElement('canvas');
            canvas.style.position = 'absolute';
            context.container.appendChild(canvas);

            const offscreen = canvas.transferControlToOffscreen();

            offscreen.width = width;
            offscreen.height = height;

            CoreThreadCommand.excuteCommand(
                worker,
                CoreThreadCommands.INIT,
                { canvas: offscreen },
                [offscreen]
            );

            this._workerArray.push(worker);
        }

        this.isInitialization = true;

        return this;
    }

    async setSize(width: number, height: number) {
        if (!this.isInitialization) {
            console.warn(
                `There are no targets to setSize. Call makeCanvas to create a canvas first.`
            );
        }

        for (let i = 0; i < this._workerArray.length; i++) {
            await CoreThreadCommand.excuteAPI(
                wrap<CommandReciver>(this._workerArray[i]),
                'RendererComponentAPI',
                'setSize',
                [width, height]
            );
        }

        return this;
    }

    async setCamera(param: PerspectiveCameraInitParam) {
        if (!this.isInitialization) {
            console.warn(
                `There are no targets to setCamera. Call makeCanvas to create a canvas first.`
            );
        }

        for (let i = 0; i < this._workerArray.length; i++) {
            await CoreThreadCommand.excuteAPI(
                wrap<CommandReciver>(this._workerArray[i]),
                'CameraComponentAPI',
                'initCamera',
                [param]
            );
        }

        return this;
    }

    async add(object: Object3D) {
        console.warn(`Please use the addAt function instead of the add function.`);
        return this.addAt(object, randInt(0, this._workerArray.length - 1));
    }

    getWorkerAt(index: number) {
        try {
            if (this._workerArray[index]) {
                return this._workerArray[index];
            }
        } catch (error) {
            return;
        }
    }

    async addAt(object: Object3D, at: number) {
        if (this._workerArray.length <= at || at < 0) {
            throw new Error(`BufferFlowError : cannot access at ${at} `);
        }

        const targetWorker = this._workerArray[at];

        const id = await CoreThreadCommand.excuteAPI(
            wrap<CommandReciver>(targetWorker),
            'SceneComponentAPI',
            'add',
            [object.toJSON()]
        );

        return await new ObjectAPI(id, new WorkerDataAccessStaytagy(targetWorker, id)).updateAll();
    }

    async render() {
        const viewer = ApplicationContext.getInstance().viewer;
        if (!viewer) return;

        const viewMatrix = viewer.camera.viewMatrix;
        const inverseViewMatrix = viewer.camera.inverseViewMatrix;
        const threadhold = Cesium3.CesiumUtils.getCameraPosition(viewer).height < 50 * 1000;

        for (let i = 0; i < this._workerArray.length; i++) {
            await this.renderRequestTo(
                this._workerArray[i],
                viewMatrix,
                inverseViewMatrix,
                threadhold
            );
        }
    }

    private async renderRequestTo(
        worker: Worker,
        viewMatrix: Matrix4,
        inverseViewMatrix: Matrix4,
        threadhold: boolean
    ) {
        const cvm = new Float64Array(viewMatrix);
        const civm = new Float64Array(inverseViewMatrix);

        await CoreThreadCommand.excuteAPI(
            wrap(worker),
            'GraphicAPI',
            'setRenderBehindEarthOfObjects',
            [threadhold]
        );
        await CoreThreadCommand.excuteCommand(
            worker,
            CoreThreadCommands.SYNC,
            { cvm: cvm, civm: civm },
            [cvm.buffer, civm.buffer]
        );
        await CoreThreadCommand.excuteCommand(worker, CoreThreadCommands.RENDER);
    }
}
