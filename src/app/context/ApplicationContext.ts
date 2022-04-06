import { Viewer } from 'cesium';

export class ApplicationContext {
    private static instance: ApplicationContext;

    container: HTMLElement;
    viewer: Viewer | undefined;

    private constructor() {
        this.container = document.createElement('div');
        this.container.style.position = 'absolute';
        this.container.style.top = '0';
        this.container.style.left = '0';
        this.container.style.height = '100%';
        this.container.style.width = '100%';
        this.container.style.margin = '0';
        this.container.style.overflow = 'hidden';
        this.container.style.padding = '0';
        this.container.style.pointerEvents = 'none';
    }

    static getInstance(): ApplicationContext {
        if (!ApplicationContext.instance) {
            ApplicationContext.instance = new ApplicationContext();
        }
        return ApplicationContext.instance;
    }
}
