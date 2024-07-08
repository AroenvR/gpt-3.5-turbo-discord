import { Container } from "inversify";
import { IServerConfig } from "../server/IServerConfig";

export interface IContainerDecorator {
    /**
     * Get the Inversify container.
     */
    getContainer(): Container;

    /**
     * Initialize the Inversify container.
     */
    initContainer(): void;

    /**
     * Initialize the server's utilities.
     */
    initUtilities(): void;
}

export class ContainerDecorator implements IContainerDecorator {
    private readonly name = 'ContainerDecorator';
    private container: Container;
    private config: IServerConfig;

    constructor(config: IServerConfig) {
        this.config = config;
        this.container = new Container();
    }

    /**
     *
     */
    public getContainer(): Container {
        if (!this.container) {
            throw new Error(`${this.name}: Container is not initialized`);
        }

        return this.container;
    }

    /**
     * 
     */
    public initContainer(): void {
        // this.container.bind<IServerConfig>(TYPES.IServerConfig).toConstantValue(this.config);
    }

    /**
     * 
     */
    public initUtilities(): void {
        // this.container.bind<ILogger>(TYPES.ILogger).to(Logger).inSingletonScope();
    }

}