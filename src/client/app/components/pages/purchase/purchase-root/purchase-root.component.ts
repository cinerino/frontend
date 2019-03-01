import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ViewType } from '../../../../models';
import * as reducers from '../../../../store/reducers';

@Component({
    selector: 'app-purchase-root',
    templateUrl: './purchase-root.component.html',
    styleUrls: ['./purchase-root.component.scss']
})
export class PurchaseRootComponent implements OnInit {
    public user: Observable<reducers.IUserState>;
    constructor(
        private store: Store<reducers.IState>,
        private router: Router,
    ) { }

    public ngOnInit() {
        this.user = this.store.pipe(select(reducers.getUser));
        this.user.subscribe((user) => {
            if (user.viewType === ViewType.Cinema) {
                this.router.navigate(['/purchase/cinema/schedule']);
                return;
            }
            this.router.navigate(['/purchase/event/schedule']);
        }).unsubscribe();
    }

}
