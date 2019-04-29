import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

import {AuthenticationService} from '../_services';

@Injectable({providedIn: 'root'})
export class GuestGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationservice: AuthenticationService
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const logged = this.authenticationservice.currentUserValue;
        if (logged) {
            this.router.navigate(['/']);
            return false;
        }
        return (true);
    }
}
