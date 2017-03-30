import {Component, AfterViewInit} from '@angular/core';
import {Router} from "@angular/router";

declare var skrollr: any;
@Component({
    selector: 'my-app',
    templateUrl: './app/app.html',
    styleUrls: ['./app/app.style.css']
})
export class AppComponent implements AfterViewInit {


    constructor(private router: Router) {
    }

    ngAfterViewInit() {
        skrollr.init();
    }

    goToHome() {
        let link = ['/'];
        this.router.navigate(link);
    }

    goToLatestIssue() {

    }

}