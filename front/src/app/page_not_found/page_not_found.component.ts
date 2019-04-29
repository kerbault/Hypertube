import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';

@Component({
    selector: 'app-page-not-found',
    templateUrl: './page_not_found.component.html',
    styleUrls: ['./page_not_found.component.scss']
})

export class PageNotFoundComponent {
    constructor(private title: Title) {
        this.title.setTitle("404 Hypertube");
    }

}
