import {Injectable}   from '@angular/core';
import {Http}         from '@angular/http';
import {Observable, Subject}   from 'rxjs/Rx';

declare var window: any;
declare var jQuery: any;

@Injectable()
export class AppService {
    overLayElement: any;
    private baseUrl: string = '';
    public notifier$: Subject<any>;
    constructor(private http: Http) {
        this.notifier$ = new Subject();
       
    }
    private getBaseUrl() {
        if (this.baseUrl) {
            return this.baseUrl;
        }
        this.baseUrl = jQuery('base ').attr('href') || '/';
        this.baseUrl += 'api/';
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
        return Observable.fromPromise(jQuery.post(this.getBaseUrl() + url, data))
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
            //xhr.setRequestHeader('Content-Type', 'application/json');    

            //xhr.setRequestHeader('Authorization', 'Bearer api_token' + this.getToken());
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

    // dummy data service   
    get_d(url) {
        return Observable.of(this.scholarList)
    }
    post_d(url, model) {
        return Observable.of(model)
    }
    put_d(url, model) {
        return Observable.of(model)
    }
    delete_d(url) {
        return Observable.of(true);
    }
    scholarList: any[] = [
        { id: 1, name: 'Abdulla', hasChild: true, education: 'CSE', address: 'Tangail', age: 23, description: 'Description..' },
        { id: 2, name: 'Ariful', hasChild: true, education: 'BBA', address: 'Tangail', age: 27, description: 'Description..' },
        { id: 3, name: 'Shofiqul', education: 'MBA', address: 'Tangail', age: 33, description: 'Description..' },
        { id: 4, name: 'Siddika', education: 'CSE', address: 'Tangail', age: 35, description: 'Description..' }
    ];
    getChildData(row: any) {
        return Observable.of([
            { id: 3, name: 'child1', hasChild: true, education: 'MBA', address: 'Tangail', age: 33, description: 'Description..' },
            { id: 4, name: 'child2', hasChild: true, education: 'CSE', address: 'Tangail', age: 35, description: 'Description..' }
        ])
    }

    getUploadData(url: string) {
        return Observable.of({
            totalPage: 15, data: [...this.scholarList]
        });
    }
    getEducations() {
        return Observable.of([{ name: 'CSE', value: 'CSE' }, { name: 'BBA', value: 'BBA' }, { name: 'MBA', value: 'MBA' }]);
    }
    getEducations2() {
        return [{ name: 'CSE', value: 'CSE' }, { name: 'BBA', value: 'BBA' }, { name: 'MBA', value: 'MBA' }];
    }

    
}
