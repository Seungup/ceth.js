export enum CoreThreadCommand {
	RENDER,
	INIT,
}

export function isCoreThreadCommand(object: any): object is ICoreThreadCommand {
	return typeof (<ICoreThreadCommand>object).runCommand === 'number';
}

export interface ICoreThreadCommand {
	runCommand: CoreThreadCommand;
	param: { [key: string]: any };
}
