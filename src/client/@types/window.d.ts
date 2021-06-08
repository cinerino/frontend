import { IEnvironment } from '../environments/environment';

declare global {
    interface Window {
        environment: IEnvironment;
    }
}
