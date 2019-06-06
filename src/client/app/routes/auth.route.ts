import { AuthIndexComponent } from '../components/pages/auth/auth-index/auth-index.component';
import { AuthSigninComponent } from '../components/pages/auth/auth-signin/auth-signin.component';
import { AuthSignoutComponent } from '../components/pages/auth/auth-signout/auth-signout.component';

/**
 * 認証ルーティング
 */
export const route = {
    path: 'auth',
    children: [
        { path: '', component: AuthIndexComponent },
        { path: 'signin', component: AuthSigninComponent },
        { path: 'signout', component: AuthSignoutComponent }
    ]
};
