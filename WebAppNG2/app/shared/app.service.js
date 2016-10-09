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
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var Rx_1 = require('rxjs/Rx');
var AppService = (function () {
    function AppService(http) {
        this.http = http;
        this.baseUrl = '';
        this.notifier$ = new Rx_1.Subject();
        this.headers = new http_1.Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
    }
    AppService.prototype.getBaseUrl = function () {
        if (this.baseUrl) {
            return this.baseUrl;
        }
        this.baseUrl = jQuery('base ').attr('href') || '/';
        this.baseUrl += '';
        return this.baseUrl;
    };
    AppService.prototype.sync_get = function (url) {
        var res = null;
        jQuery.ajax({
            url: this.getBaseUrl() + url,
            type: "GET",
            async: false,
            success: function (data) {
                res = data;
            }
        });
        return res;
    };
    AppService.prototype.messageDialog = function (title, message) {
        this.notifyAll({ key: 'messageDialog', value: { title: title, message: message } });
    };
    AppService.prototype.confirmDialog = function (title, message, yesCallback, noCallback) {
        this.notifyAll({ key: 'confirmDialog', value: { title: title, message: message, yesCallback: yesCallback, noCallback: noCallback } });
    };
    AppService.prototype.showMessage = function (message) {
        this.notifyAll({ key: 'message', value: message });
    };
    AppService.prototype.notifyAll = function (obj) {
        this.notifier$.next(obj);
    };
    AppService.prototype.errorHandler = function (obj) {
        this.overlay(false);
        this.notifyAll({ key: 'error', value: obj.statusText || 'Invalid Url' });
        return Rx_1.Observable.of(false);
    };
    AppService.prototype.hideOverlay = function (obj) {
        this.overlay(false);
        this.notifyAll({ key: 'error', value: obj.error || '' });
    };
    AppService.prototype.getUrl = function (url, params) {
        var paramList = [];
        for (var prop in params) {
            paramList.push(prop + '=' + params[prop]);
        }
        return url + '?' + paramList.join('&');
    };
    AppService.prototype.get = function (url) {
        this.overlay(true);
        return this.http.get(this.getBaseUrl() + url)
            .map(function (res) { return res.json(); })
            .do(this.hideOverlay.bind(this))
            .catch(this.errorHandler.bind(this));
    };
    AppService.prototype.getInterval = function (url, interval) {
        var _this = this;
        if (interval === void 0) { interval = 1000; }
        return Rx_1.Observable.interval(interval).switchMap(function (res) { return _this.get(url); });
    };
    AppService.prototype.post = function (url, data) {
        this.overlay(true);
        return this.http.post(this.getBaseUrl() + url, JSON.stringify(data), { headers: this.headers })
            .map(function (res) { return res.json(); })
            .do(this.hideOverlay.bind(this))
            .catch(this.errorHandler.bind(this));
    };
    AppService.prototype.upload = function (url, model) {
        url = this.getBaseUrl() + url;
        return Rx_1.Observable.fromPromise(new Promise(function (resolve, reject) {
            var formData = new FormData();
            var xhr = new XMLHttpRequest();
            var map = new Map();
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
                            model[prop][fileProp].forEach(function (file) {
                                formData.append(fileProp + '[]', file, file.name);
                            });
                        }
                    }
                }
                else if (!map.has(prop) && model[prop]) {
                    formData.append(prop, model[prop]);
                }
            }
            xhr.onreadystatechange = function () {
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
    };
    AppService.prototype.overlay = function (show) {
        if (!this.overLayElement) {
            this.overLayElement = jQuery('.overlay');
        }
        if (show) {
            this.overLayElement.show();
        }
        else {
            this.overLayElement.hide();
        }
    };
    AppService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], AppService);
    return AppService;
}());
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map