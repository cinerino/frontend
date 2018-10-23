import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import * as reducers from '../../../../store/reducers';

@Component({
    selector: 'app-inquiry-confirm',
    templateUrl: './inquiry-confirm.component.html',
    styleUrls: ['./inquiry-confirm.component.scss']
})
export class InquiryConfirmComponent implements OnInit {
    public inquiry: Observable<reducers.IInquiryState>;
    public moment: typeof moment = moment;
    constructor(
        private store: Store<reducers.IState>
    ) { }

    public ngOnInit() {
        this.inquiry = this.store.pipe(select(reducers.getInquiry));
    }

}
