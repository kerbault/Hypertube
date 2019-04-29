import {Router} from '@angular/router';
import {Component, Renderer2, ElementRef} from '@angular/core';

import {AuthenticationService} from './_services';
import {User} from './_models';
import 'hammerjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent {
    currentUser: User;
    title = 'Hypertube';

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private renderer: Renderer2,
        // private elm: ElementRef
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

    ngOnInit() {
        this.konami_code(0);
    }

    getbackimg() {
        if (localStorage.hypertube_background == 1) {
            this.renderer.removeStyle(document.body, 'background-image');
            return (0);
        }
        if (localStorage.hypertube_background == 2)
            return "url(http://www.wallpaperbetter.com/wallpaper/695/929/102/deadpool-hd-1080P-wallpaper.jpg)";
        if (localStorage.hypertube_background == 3)
            return "url(https://wallpapercave.com/wp/wp3767542.jpg)";
        if (localStorage.hypertube_background == 4)
            return "url(https://cdn.wallpapersafari.com/86/40/WxLklc.jpg)";
    }

    konami_code(id: number) {
        if (id) {
            if (!localStorage.hypertube_background)
                localStorage.hypertube_background = 1;
            else
                localStorage.hypertube_background++;
            if (localStorage.hypertube_background > 4)
                localStorage.hypertube_background = 1;
        }
        this.renderer.setStyle(document.body, 'background-image', this.getbackimg());
        this.renderer.setStyle(document.body, 'background-position', 'center');
        this.renderer.setStyle(document.body, 'background-size', 'cover');
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }
}
