import {Component, AfterViewInit, NgZone, Inject, ChangeDetectorRef} from '@angular/core';
import {Router} from "@angular/router";
import {NgUploaderOptions, UploadedFile} from 'ngx-uploader';

declare var toastr: any;
declare var WaveSurfer: any;

@Component({
    selector: 'my-app',
    templateUrl: './static/app/app.html',
    styleUrls: ['./static/app/app.style.css']
})
export class AppComponent implements AfterViewInit {

    options: NgUploaderOptions;
    response: any;
    hasBaseDropZoneOver: boolean;
    sizeLimit: number = 10000000; // 10MB
    wavesurfer: any;

    constructor(@Inject(NgZone) private zone: NgZone, private router: Router, private _changeDetectionRef: ChangeDetectorRef) {
        this.options = new NgUploaderOptions({
            url: 'http://localhost:8000/upload_audio',
            filterExtensions: true,
            allowedExtensions: ['wav', 'mp3'],
            fieldName: 'file',
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

    beforeUpload(uploadingFile: UploadedFile) {
        if (uploadingFile.size > this.sizeLimit) {
            uploadingFile.setAbort();
            toastr.error('File is too large!')
        }
    }

    fileOverBase(e: boolean) {
        this.hasBaseDropZoneOver = e;
    }

    playPauseAudio(event: any) {
        this.wavesurfer.playPause();
    }

    ngAfterViewInit() {
        this.wavesurfer = WaveSurfer.create({
            container: '#waveform',
            waveColor: 'white',
            progressColor: 'red',
            barWidth: 3
        });
        this.wavesurfer.load('http://localhost:8000/static/4afcfb24-163a-11e7-a50f-d8cb8a9f78c6');
        this._changeDetectionRef.detectChanges();
    }


}