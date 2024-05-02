
import { ApplicationConfig } from '@angular/platform-browser';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering()
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
function provideServerRendering(): import("@angular/core").Provider | import("@angular/core").EnvironmentProviders {
  throw new Error('Function not implemented.');
}

function mergeApplicationConfig(appConfig: ApplicationConfig, serverConfig: ApplicationConfig) {
  throw new Error('Function not implemented.');
}

