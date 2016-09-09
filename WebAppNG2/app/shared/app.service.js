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
        this.scholarList = [
            { id: 1, name: 'Abdulla', hasChild: true, education: 'CSE', address: 'Tangail', age: 23, description: 'Description..' },
            { id: 2, name: 'Ariful', hasChild: true, education: 'BBA', address: 'Tangail', age: 27, description: 'Description..' },
            { id: 3, name: 'Shofiqul', education: 'MBA', address: 'Tangail', age: 33, description: 'Description..' },
            { id: 4, name: 'Siddika', education: 'CSE', address: 'Tangail', age: 35, description: 'Description..' }
        ];
        this.notifier$ = new Rx_1.Subject();
    }
    AppService.prototype.getBaseUrl = function () {
        if (this.baseUrl) {
            return this.baseUrl;
        }
        this.baseUrl = jQuery('base ').attr('href') || '/';
        this.baseUrl += 'api/';
        return this.baseUrl;
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
        return Rx_1.Observable.fromPromise(jQuery.post(this.getBaseUrl() + url, data))
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
    AppService.prototype.get_d = function (url) {
        return Rx_1.Observable.of(this.scholarList);
    };
    AppService.prototype.post_d = function (url, model) {
        return Rx_1.Observable.of(model);
    };
    AppService.prototype.put_d = function (url, model) {
        return Rx_1.Observable.of(model);
    };
    AppService.prototype.delete_d = function (url) {
        return Rx_1.Observable.of(true);
    };
    AppService.prototype.getChildData = function (row) {
        return Rx_1.Observable.of([
            { id: 3, name: 'child1', hasChild: true, education: 'MBA', address: 'Tangail', age: 33, description: 'Description..' },
            { id: 4, name: 'child2', hasChild: true, education: 'CSE', address: 'Tangail', age: 35, description: 'Description..' }
        ]);
    };
    AppService.prototype.getUploadData = function (url) {
        return Rx_1.Observable.of({
            totalPage: 15, data: this.scholarList.slice()
        });
    };
    AppService.prototype.getEducations = function () {
        return Rx_1.Observable.of([{ name: 'CSE', value: 'CSE' }, { name: 'BBA', value: 'BBA' }, { name: 'MBA', value: 'MBA' }]);
    };
    AppService.prototype.getEducations2 = function () {
        return [{ name: 'CSE', value: 'CSE' }, { name: 'BBA', value: 'BBA' }, { name: 'MBA', value: 'MBA' }];
    };
    AppService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], AppService);
    return AppService;
}());
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map