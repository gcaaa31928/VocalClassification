import {Component, AfterViewInit, NgZone, Inject, ChangeDetectorRef} from '@angular/core';
import {Router} from "@angular/router";
import {NgUploaderOptions, UploadedFile} from 'ngx-uploader';
import {Http, URLSearchParams} from "@angular/http";
import 'rxjs/add/operator/toPromise';

declare var toastr: any;
declare var WaveSurfer: any;
declare var c3: any;

@Component({
    selector: 'my-app',
    templateUrl: './static/app/app.html',
    styleUrls: ['./static/app/app.style.css']
})
export class AppComponent implements AfterViewInit {

    predictUrl: string = 'http://localhost/predict_result';
    uploadUrl: string = 'http://localhost/upload_audio';
    staticUrl: string = 'http://localhost/static';
    predictResult: any;
    taskId: string = null;
    showLoading: boolean = false;
    audioName: string = null;
    options: NgUploaderOptions;
    response: any;
    hasBaseDropZoneOver: boolean;
    sizeLimit: number = 10000000; // 10MB
    wavesurfer: any = null;
    loadWave: boolean = false;

    constructor(@Inject(NgZone) private zone: NgZone,
                private router: Router,
                private _changeDetectionRef: ChangeDetectorRef,
                private http: Http) {
        this.options = new NgUploaderOptions({
            url: this.uploadUrl,
            filterExtensions: true,
            allowedExtensions: ['wav', 'mp3'],
            fieldName: 'file',
            autoUpload: true,
            calculateSpeed: true
        });
    }

    getPredictResult() {
        let params: URLSearchParams = new URLSearchParams();
        params.set('task_id', this.taskId);
        this.http.get(this.predictUrl, {
            search: params
        }).toPromise()
            .then(response => {
                console.log(response);
                if (response.status == 200) {
                    let data = response.json()['data'];
                    this.predictResult = data;
                    this.loadWaveSurfer(this.audioName, this.predictResult);
                    this.showLoading = false;
                } else {
                    setTimeout(() => this.getPredictResult(), 2000);
                }
            })
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

    handleUpload(data: any) {
        this.showLoading = true;
        this.loadWave = false;
        this.zone.run(() => {
            this.response = data;
            if (data && data.response) {
                this.response = JSON.parse(data.response);
                this.audioName = this.response['name'];
                this.taskId = this.response['task_id'];
                this.getPredictResult();
            }
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


    loadWaveSurfer(audio_name: string, predictResult: any) {
        this.loadWave = true;
        this.wavesurfer.load(`${this.staticUrl}/${audio_name}`);
        this.wavesurfer.clearRegions();
        this.wavesurfer.on('ready', () => {
            let index = 0;
            for(let result of predictResult) {
                let vocal = false;
                let alpha = 0;
                let percent = result;
                let color;
                if (percent[0] > percent[1]) {
                    vocal = false;
                    alpha = 0.3 * (percent[0] / 1.0);
                    color = `hsla(0, 50%, 50%, ${alpha})`;
                }else {
                    vocal = true;
                    alpha = 0.3 * (percent[1] / 1.0);
                    color = `hsla(240, 80%, 50%, ${alpha})`;
                }
                this.wavesurfer.addRegion({
                    start: index, // time in seconds
                    end: index + 2, // time in seconds
                    color: color,
                    drag: false
                });
                index += 2;
            }

        });
    }

    ngAfterViewInit() {
        this.wavesurfer = WaveSurfer.create({
            container: '#waveform',
            waveColor: 'white',
            progressColor: 'red',
            barWidth: 3
        });

        this._changeDetectionRef.detectChanges();

    }


}