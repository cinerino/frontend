import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CoreStoreModule } from './store';

@NgModule({
  imports: [
    CoreStoreModule
  ]
})
export class CoreModule {
  /**
   * Constructor
   * @param parentModule
   */
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded.');
    }
  }
}
