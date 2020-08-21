import { Injectable } from '@angular/core';
import { ActionOrderService } from './action/order.service';
import { ActionPurchaseService } from './action/purchase.service';
import { ActionUserService } from './action/user.service';

@Injectable({
    providedIn: 'root'
})
export class ActionService {
    constructor(
        public order: ActionOrderService,
        public purchase: ActionPurchaseService,
        public user: ActionUserService
    ) { }
}
