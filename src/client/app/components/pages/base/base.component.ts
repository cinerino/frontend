import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as reducers from '../../../store/reducers';

@Component({
    selector: 'app-base',
    templateUrl: './base.component.html',
    styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit, AfterViewChecked, OnDestroy {
    public isLoading: Observable<boolean>;
    constructor(
        private store: Store<reducers.IState>,
        private changeDetectorRef: ChangeDetectorRef
    ) { }

    public ngOnInit() {
        this.isLoading = this.store.pipe(select(reducers.getLoading));
    }

    public ngAfterViewChecked() {
        this.changeDetectorRef.detectChanges();
    }

    public ngOnDestroy() {
        this.isLoading.subscribe().unsubscribe();
    }

}
