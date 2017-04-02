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

    predictUrl: string = 'http://localhost:8000/predict_result';
    predictResult: any;
    taskId: string = null;
    audioName: string = null;
    options: NgUploaderOptions;
    response: any;
    hasBaseDropZoneOver: boolean;
    sizeLimit: number = 10000000; // 10MB
    wavesurfer: any;

    constructor(@Inject(NgZone) private zone: NgZone,
                private router: Router,
                private _changeDetectionRef: ChangeDetectorRef,
                private http: Http) {
        this.options = new NgUploaderOptions({
            url: 'http://localhost:8000/upload_audio',
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

    getPredictPecent(predict: any) {
        let sum = predict[0] + predict[1];
        let non_vocal = predict[0] / sum;
        let vocal = predict[1] / sum;
        return [non_vocal, vocal];
    }

    loadWaveSurfer(audio_name: string, predictResult: any) {
        this.wavesurfer.load(`http://localhost:8000/static/${audio_name}`);
        this.wavesurfer.clearRegions();
        this.wavesurfer.on('ready', () => {
            let index = 0;
            for(let result of predictResult) {
                let vocal = false;
                let alpha = 0;
                let percent = this.getPredictPecent(result);
                let color;
                if (percent[0] > percent[1]) {
                    vocal = false;
                    alpha = 0.5 * (percent[0] / 1.0);
                    color = `hsla(0, 50%, 50%, ${alpha})`;
                }else {
                    vocal = true;
                    alpha = 0.5 * (percent[1] / 1.0);
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