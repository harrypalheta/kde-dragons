import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './containers/home';
import { AuthGuard } from './helpers';

const accountModule = () => import('./containers/account/account.module').then(x => x.AccountModule);
const dragonsModule = () => import('./containers/dragons/dragons.module').then(x => x.DragonsModule);


const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'dragons', loadChildren: dragonsModule, canActivate: [AuthGuard] },
  { path: 'account', loadChildren: accountModule },

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
