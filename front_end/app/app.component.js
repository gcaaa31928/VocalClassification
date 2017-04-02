"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var ngx_uploader_1 = require("ngx-uploader");
var http_1 = require("@angular/http");
require("rxjs/add/operator/toPromise");
var AppComponent = (function () {
    function AppComponent(zone, router, _changeDetectionRef, http) {
        this.zone = zone;
        this.router = router;
        this._changeDetectionRef = _changeDetectionRef;
        this.http = http;
        this.predictUrl = 'http://localhost:8000/predict_result';
        this.taskId = null;
        this.showLoading = false;
        this.audioName = null;
        this.sizeLimit = 10000000; // 10MB
        this.wavesurfer = null;
        this.loadWave = false;
        this.options = new ngx_uploader_1.NgUploaderOptions({
            url: 'http://localhost:8000/upload_audio',
            filterExtensions: true,
            allowedExtensions: ['wav', 'mp3'],
            fieldName: 'file',
            autoUpload: true,
            calculateSpeed: true
        });
    }
    AppComponent.prototype.getPredictResult = function () {
        var _this = this;
        var params = new http_1.URLSearchParams();
        params.set('task_id', this.taskId);
        this.http.get(this.predictUrl, {
            search: params
        }).toPromise()
            .then(function (response) {
            console.log(response);
            if (response.status == 200) {
                var data = response.json()['data'];
                _this.predictResult = data;
                _this.loadWaveSurfer(_this.audioName, _this.predictResult);
                _this.showLoading = false;
            }
            else {
                setTimeout(function () { return _this.getPredictResult(); }, 2000);
            }
        })
            .catch(this.handleError);
    };
    AppComponent.prototype.handleError = function (error) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    };
    AppComponent.prototype.handleUpload = function (data) {
        var _this = this;
        this.showLoading = true;
        this.loadWave = false;
        this.zone.run(function () {
            _this.response = data;
            if (data && data.response) {
                _this.response = JSON.parse(data.response);
                _this.audioName = _this.response['name'];
                _this.taskId = _this.response['task_id'];
                _this.getPredictResult();
            }
        });
    };
    AppComponent.prototype.beforeUpload = function (uploadingFile) {
        if (uploadingFile.size > this.sizeLimit) {
            uploadingFile.setAbort();
            toastr.error('File is too large!');
        }
    };
    AppComponent.prototype.fileOverBase = function (e) {
        this.hasBaseDropZoneOver = e;
    };
    AppComponent.prototype.playPauseAudio = function (event) {
        this.wavesurfer.playPause();
    };
    AppComponent.prototype.loadWaveSurfer = function (audio_name, predictResult) {
        var _this = this;
        this.loadWave = true;
        this.wavesurfer.load("http://localhost:8000/static/" + audio_name);
        this.wavesurfer.clearRegions();
        this.wavesurfer.on('ready', function () {
            var index = 0;
            for (var _i = 0, predictResult_1 = predictResult; _i < predictResult_1.length; _i++) {
                var result = predictResult_1[_i];
                var vocal = false;
                var alpha = 0;
                var percent = result;
                var color = void 0;
                if (percent[0] > percent[1]) {
                    vocal = false;
                    alpha = 0.3 * (percent[0] / 1.0);
                    color = "hsla(0, 50%, 50%, " + alpha + ")";
                }
                else {
                    vocal = true;
                    alpha = 0.3 * (percent[1] / 1.0);
                    color = "hsla(240, 80%, 50%, " + alpha + ")";
                }
                _this.wavesurfer.addRegion({
                    start: index,
                    end: index + 2,
                    color: color,
                    drag: false
                });
                index += 2;
            }
        });
    };
    AppComponent.prototype.ngAfterViewInit = function () {
        this.wavesurfer = WaveSurfer.create({
            container: '#waveform',
            waveColor: 'white',
            progressColor: 'red',
            barWidth: 3
        });
        this._changeDetectionRef.detectChanges();
    };
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: 'my-app',
        templateUrl: './static/app/app.html',
        styleUrls: ['./static/app/app.style.css']
    }),
    __param(0, core_1.Inject(core_1.NgZone)),
    __metadata("design:paramtypes", [core_1.NgZone,
        router_1.Router,
        core_1.ChangeDetectorRef,
        http_1.Http])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map