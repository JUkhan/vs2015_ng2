import {Injectable}   from '@angular/core';
import {Http, Headers}         from '@angular/http';
import {Observable, Subject}   from 'rxjs/Rx';

declare var window: any;
declare var jQuery: any;

@Injectable()
export class AppService {
    overLayElement: any;
    private baseUrl: string = '';
    public notifier$: Subject<any>;
    private headers: Headers;
    constructor(private http: Http) {
        this.notifier$ = new Subject();
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
    }
    private getBaseUrl() {
        if (this.baseUrl) {
            return this.baseUrl;
        }
        this.baseUrl = jQuery('base ').attr('href') || '/';
        this.baseUrl += '';
        return this.baseUrl;
    }
    showMessage(message: string) {
        this.notifyAll({ key: 'message', value: message });
    }
    notifyAll(obj: { key: string, value?: any }) {
        this.notifier$.next(obj);
    }
    errorHandler(obj: any) {
        this.overlay(false);
        this.notifyAll({ key: 'error', value: obj.statusText || 'Invalid Url' });
        return Observable.of(false);
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
    get(url): Observable<any> {
        this.overlay(true);
        return this.http.get(this.getBaseUrl() + url)
            .map(res => res.json())
            .do(this.hideOverlay.bind(this))
            .catch(this.errorHandler.bind(this));
    }
    getInterval(url, interval = 1000) {
        return Observable.interval(interval).switchMap(res => this.get(url));
    }
    post(url, data): Observable<any> {
        this.overlay(true);        
        return this.http.post(this.getBaseUrl() + url, JSON.stringify(data), { headers: this.headers })
            .map(res => res.json())
            .do(this.hideOverlay.bind(this))
            .catch(this.errorHandler.bind(this));
    }
    upload(url, model: any) {
        url = this.getBaseUrl() + url;
        return Observable.fromPromise(new Promise((resolve, reject) => {

            let formData: FormData = new FormData();
            let xhr: XMLHttpRequest = new XMLHttpRequest();
            let map: Map<string, any> = new Map<string, any>();
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
                            model[prop][fileProp].forEach((file: File) => {
                                formData.append(fileProp + '[]', file, file.name);
                            });
                        }
                    }
                } else if (!map.has(prop) && model[prop]) {
                    formData.append(prop, model[prop]);
                }
            }

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
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
        } else {
            this.overLayElement.hide();
        }
    }
    
}
