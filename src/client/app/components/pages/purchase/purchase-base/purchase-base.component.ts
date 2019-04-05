import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as reducers from '../../../../store/reducers';

@Component({
    selector: 'app-purchase-base',
    templateUrl: './purchase-base.component.html',
    styleUrls: ['./purchase-base.component.scss']
})
export class PurchaseBaseComponent implements OnInit, AfterViewChecked, OnDestroy {
    public isLoading: Observable<boolean>;
    public process: Observable<string>;
    public purchase: Observable<reducers.IPurchaseState>;
    constructor(
        private store: Store<reducers.IState>,
        private changeDetectorRef: ChangeDetectorRef
    ) { }

    /**
     * 初期化
     */
    public ngOnInit() {
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.process = this.store.pipe(select(reducers.getProcess));
        this.purchase = this.store.pipe(select(reducers.getPurchase));
    }

    /**
     * ビューをチェック後
     */
    public ngAfterViewChecked() {
        this.changeDetectorRef.detectChanges();
    }

    /**
     * 破棄
     */
    public ngOnDestroy() {
        this.isLoading.subscribe().unsubscribe();
        this.process.subscribe().unsubscribe();
        this.purchase.subscribe().unsubscribe();
    }

}
