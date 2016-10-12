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
const core_1 = require('@angular/core');
const http_1 = require('@angular/http');
const Rx_1 = require('rxjs/Rx');
let AppService = class AppService {
    constructor(http) {
        this.http = http;
        this.baseUrl = '';
        this.notifier$ = new Rx_1.Subject();
        this.headers = new http_1.Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
    }
    getBaseUrl() {
        if (this.baseUrl) {
            return this.baseUrl;
        }
        this.baseUrl = jQuery('base ').attr('href') || '/';
        this.baseUrl += '';
        return this.baseUrl;
    }
    sync_get(url) {
        let res = null;
        jQuery.ajax({
            url: this.getBaseUrl() + url,
            type: "GET",
            async: false,
            success: function (data) {
                res = data;
            }
        });
        return res;
    }
    messageDialog(title, message) {
        this.notifyAll({ key: 'messageDialog', value: { title: title, message: message } });
    }
    confirmDialog(title, message, yesCallback, noCallback) {
        this.notifyAll({ key: 'confirmDialog', value: { title: title, message: message, yesCallback: yesCallback, noCallback: noCallback } });
    }
    confirmDialogPromise(title, message) {
        return this.confirmDialogInstance.showDialogPromise(title, message);
    }
    showMessage(message) {
        this.notifyAll({ key: 'message', value: message });
    }
    notifyAll(obj) {
        this.notifier$.next(obj);
    }
    errorHandler(obj) {
        this.overlay(false);
        this.notifyAll({ key: 'error', value: obj.statusText || 'Invalid Url' });
        return Rx_1.Observable.of(false);
    }
    hideOverlay(obj) {
        this.overlay(false);
        this.notifyAll({ key: 'error', value: obj.error || '' });
    }
    getUrl(url, params) {
        let paramList = [];
        for (let prop in params) {
            paramList.push(prop + '=' + params[prop]);
        }
        return url + '?' + paramList.join('&');
    }
    get(url) {
        this.overlay(true);
        return this.http.get(this.getBaseUrl() + url)
            .map(res => res.json())
            .do(this.hideOverlay.bind(this))
            .catch(this.errorHandler.bind(this));
    }
    getInterval(url, interval = 1000) {
        return Rx_1.Observable.interval(interval).switchMap(res => this.get(url));
    }
    post(url, data) {
        this.overlay(true);
        return this.http.post(this.getBaseUrl() + url, JSON.stringify(data), { headers: this.headers })
            .map(res => res.json())
            .do(this.hideOverlay.bind(this))
            .catch(this.errorHandler.bind(this));
    }
    upload(url, model) {
        url = this.getBaseUrl() + url;
        return Rx_1.Observable.fromPromise(new Promise((resolve, reject) => {
            let formData = new FormData();
            let xhr = new XMLHttpRequest();
            let map = new Map();
            for (var prop in model) {
                if (prop === 'FILES') {
                    for (var fileProp in model[prop]) {
                        map.set(fileProp, '');
                        if (!(model[prop][fileProp] && model[prop][fileProp].length > 0)) {
                            continue;
                        }
                        if (model[prop][fileProp].length == 1) {
                            formData.append(fileProp, model[prop][fileProp][0], model[prop][fileProp][0].name);
                        }
                        else {
                            model[prop][fileProp].forEach((file) => {
                                formData.append(fileProp + '[]', file, file.name);
                            });
                        }
                    }
                }
                else if (!map.has(prop) && model[prop]) {
                    formData.append(prop, model[prop]);
                }
            }
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.response));
                    }
                    else {
                        reject(xhr.response);
                    }
                }
            };
            xhr.open('POST', url, true);
            xhr.send(formData);
        }));
    }
    overlay(show) {
        if (!this.overLayElement) {
            this.overLayElement = jQuery('.overlay');
        }
        if (show) {
            this.overLayElement.show();
        }
        else {
            this.overLayElement.hide();
        }
    }
};
AppService = __decorate([
    core_1.Injectable(), 
    __metadata('design:paramtypes', [http_1.Http])
], AppService);
exports.AppService = AppService;

//# sourceMappingURL=app.service.js.map
