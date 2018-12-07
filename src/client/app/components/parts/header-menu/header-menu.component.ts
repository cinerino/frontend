/**
 * HeaderMenuComponent
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CinerinoService } from '../../../services/cinerino.service';
import * as reducers from '../../../store/reducers';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

@Component({
    selector: 'app-header-menu',
    templateUrl: './header-menu.component.html',
    styleUrls: ['./header-menu.component.scss']
})
export class HeaderMenuComponent implements OnInit {
    @Input() public isOpen: boolean;
    @Output() public close: EventEmitter<{}> = new EventEmitter();
    public user: Observable<reducers.IUserState>;
    constructor(
        private store: Store<reducers.IState>,
        private cinerino: CinerinoService,
        private router: Router,
        private modal: NgbModal
    ) { }

    public ngOnInit() {
        this.user = this.store.pipe(select(reducers.getUser));
    }

    public signIn() {
        this.close.emit();
        this.openConfirm({
            title: '確認',
            body: 'ログインしますか？',
            done: () => {
                this.router.navigate(['/auth']);
            }

        });
    }

    public signOut() {
        this.close.emit();
        this.openConfirm({
            title: '確認',
            body: 'ログアウトしますか？',
            done: async () => {
                try {
                    await this.cinerino.getServices();
                    await this.cinerino.signOut();
                } catch (err) {
                    console.error(err);
                }
            }

        });

    }

    private openConfirm(args: {
        title: string;
        body: string;
        done: Function
    }) {
        const modalRef = this.modal.open(ConfirmModalComponent, {
            centered: true
        });
        modalRef.result.then(async () => {
            await args.done();
        }).catch(() => {

        });

        modalRef.componentInstance.title = args.title;
        modalRef.componentInstance.body = args.body;
    }
}
