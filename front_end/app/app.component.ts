import {Component, AfterViewInit, NgZone, Inject} from '@angular/core';
import {Router} from "@angular/router";
import {NgUploaderOptions} from 'ngx-uploader';

@Component({
    selector: 'my-app',
    templateUrl: './static/app/app.html',
    styleUrls: ['./static/app/app.style.css']
})
export class AppComponent implements AfterViewInit {

    options: NgUploaderOptions;
    response: any;
    hasBaseDropZoneOver: boolean;

    constructor(@Inject(NgZone) private zone: NgZone, private router: Router) {
        this.options = new NgUploaderOptions({
            url: 'http://api.ngx-uploader.com/upload',
            autoUpload: true,
            calculateSpeed: true
        });
    }

    handleUpload(data: any) {
        setTimeout(() => {
            this.zone.run(() => {
                this.response = data;
                if (data && data.response) {
                    this.response = JSON.parse(data.response);
                }
            });
        });
    }

    fileOverBase(e: boolean) {
        this.hasBaseDropZoneOver = e;
    }

    ngAfterViewInit() {
    }


}