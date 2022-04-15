const State = {
    IDLE: 0,
    RUNNING: 1,
} as const;

export class RenderTaskManager {
    private state: number = State.IDLE;
    private renderTask: { (): void } | undefined;

    setTaskAndStartIfIDLEState(task: { (): void }) {
        if (this.state === State.IDLE && this.renderTask === undefined) {
            this.renderTask = task;
            this.state = State.RUNNING;
            (async () => {
                await Promise.resolve(this.renderTask!()).finally(() => {
                    this.renderTask = undefined;
                    this.state = State.IDLE;
                });
            })();
        }
    }
}
