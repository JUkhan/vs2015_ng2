import {Component, ViewChild, Renderer, ViewEncapsulation, ApplicationRef, ComponentRef, ElementRef, OnInit, OnDestroy, AfterViewInit, DynamicComponentLoader, Injector} from '@angular/core';
import {juChildWindow}            from './juChildWindow';
import {juWindowService}          from './juWindowService';
import {Subscription}             from 'rxjs/Rx';

@Component({
    moduleId: module.id,
    selector: 'pw, .pw',
    templateUrl: './juParentWindow.html',
    styleUrls: ['./juParentWindow.css'],    
    encapsulation: ViewEncapsulation.None,
    inputs:['height']
})

export class juParentWindow implements OnInit, OnDestroy {
    private childList: any;
    private placeHolder: any;
    private minList: any[] = [];
    private subsList: Subscription[] = [];
    private height:number=500;
    constructor(private renderer: Renderer,
        private dcl: DynamicComponentLoader,
        private injector: Injector,
        private appRef: ApplicationRef,
        private service: juWindowService) { }

    @ViewChild('container') container: ElementRef;
    @ViewChild('footer') footer: ElementRef;
    ngOnInit() {
        this.childList = this.service.getChildList();
        this.subsList.push(this.service.$minWin.subscribe(next => {
            this.minList.push(next);
        }));
        this.service.parentWindow=this;
    }

    ngOnDestroy() {
        this.service.destroyAll();
        this.subsList.forEach(_ => {
            if (!_.unsubscribe) {
                _.unsubscribe();
            }
        });
    }
    ngAfterViewInit() {
        this.service.pWin = this.container.nativeElement;
        this.container.nativeElement.style.height=this.height+'px';
    }
    private openWindow(item) {
        this.minList.splice(this.minList.indexOf(item), 1);
        this.service.openWindow(item.id);
    }
    private closeWindow(item) {
        this.minList.splice(this.minList.indexOf(item), 1);
        this.service.closeWindow(item.id);
    }
    public createWindow(id: string) {
        this.createPlaceHolder(id);
    }
    private createPlaceHolder(id: string) {
       
        if (typeof this.childList[id] === 'undefined') {
            this.placeHolder = this.renderer.createElement(this.container.nativeElement, 'div');
            this.childList[id] = {};
            this.loadComponent(id);
        } else {
            let item = this.minList.filter(_ => _.id === id);
            this.minList.splice(this.minList.indexOf(item), 1);
            this.service.openWindow(id);
        }
    }
    private loadComponent(id: string) {
        let comOptions = this.childList[id];
        if (typeof comOptions.child === 'undefined') {
            this.dcl.loadAsRoot(juChildWindow, this.placeHolder, this.injector)
                .then((compRef: ComponentRef<juChildWindow>) => {
                    comOptions.child = compRef;
                    compRef.instance.windowId = id;
                    this.service.setProperty(id);                    
                    //(<any>this.appRef)._loadComponent(compRef);
                    compRef.onDestroy(() => {
                        //(<any>this.appRef)._unloadComponent(compRef);
                    });
                    return compRef;
                })
        }
    }


}