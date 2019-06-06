import { AuthGuardService } from '../canActivates';
import { BaseComponent } from '../components/pages/base/base.component';
import { OrderSearchComponent } from '../components/pages/order/order-search/order-search.component';

/**
 * 注文ルーティング
 */
export const route = {
    path: 'order',
    component: BaseComponent,
    canActivate: [AuthGuardService],
    children: [
        { path: 'search',  component: OrderSearchComponent }
    ]
};
