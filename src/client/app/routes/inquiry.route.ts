import { BaseComponent } from '../components/pages/base/base.component';
import { InquiryConfirmComponent } from '../components/pages/inquiry/inquiry-confirm/inquiry-confirm.component';
import { InquiryInputComponent } from '../components/pages/inquiry/inquiry-input/inquiry-input.component';

/**
 * 照会ルーティング
 */
export const route = {
    path: 'inquiry',
    component: BaseComponent,
    children: [
        { path: 'input', component: InquiryInputComponent },
        { path: 'confirm', component: InquiryConfirmComponent }
    ]
};
