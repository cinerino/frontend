import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { metaReducers, reducers } from './reducers';

@NgModule({
    imports: [
        StoreModule.forRoot(reducers, { metaReducers }),
        EffectsModule.forRoot([]),
    ]
})
export class CoreStoreModule { }
