import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {PageNotFoundComponent} from './page_not_found/page_not_found.component';
import {HomeComponent} from './home/home.component';
import {AuthGuard, GuestGuard} from './_guards';
import {LoginComponent} from './login/login.component';
import {PageFilmComponent} from './page-film/page-film.component';
import {RegisterComponent} from './register/register.component';
import {SettingsComponent} from './settings/settings.component';
import {ProfilComponent} from './profil-other/profil-other.component';
import {ResetPasswordComponent} from './form-reset-password/form-reset-password.component';


const appRoutes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [GuestGuard]
    },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [GuestGuard]
    },
    {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'profil/:id',
        component: ProfilComponent,
        canActivate: [AuthGuard]
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'film/:id',
        component: PageFilmComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'reset_password',
        component: ResetPasswordComponent,
        canActivate: [GuestGuard]
    },
    {
        path: '**',
        component: PageNotFoundComponent
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, {enableTracing: false})
    ],
    declarations: [],
    exports: [
        RouterModule
    ]
})
export class AppRouting {
}
