import { AuthGuardService } from '../canActivates';
import { BaseComponent } from '../components/pages/base/base.component';
import { OrderListComponent } from '../components/pages/order/order-list/order-list.component';

/**
 * 注文ルーティング
 */
export const route = {
    path: 'order',
    component: BaseComponent,
    canActivate: [AuthGuardService],
    children: [
        { path: 'list',  component: OrderListComponent }
    ]
};
