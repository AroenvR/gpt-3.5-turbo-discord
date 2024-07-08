import { Container } from "inversify";
import { ContainerDecorator, IContainerDecorator } from "../ioc/ContainerDecorator";
import { IServerConfig } from "../server/IServerConfig";

describe("ContainerDecorator", () => {
    let serverConfig: IServerConfig;
    let decorator: IContainerDecorator;

    beforeAll(() => {
        decorator = new ContainerDecorator(serverConfig);
    });

    test("Returns a valid Inversify container", () => {
        const container = decorator.getContainer();

        expect(container).toBeTruthy;
        expect(container instanceof Container).toBe(true);
    });

});