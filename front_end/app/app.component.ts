import {Component, AfterViewInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
    selector: 'my-app',
    templateUrl: './static/app/app.html',
    styleUrls: ['./static/app/app.style.css']
})
export class AppComponent implements AfterViewInit {


    constructor(private router: Router) {
    }

    ngAfterViewInit() {
    }

    goToHome() {
    }

    goToLatestIssue() {

    }

}