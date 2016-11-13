
import {Component, ElementRef, ChangeDetectionStrategy, AfterContentInit, Input, OnInit, ViewEncapsulation, TemplateRef, ContentChild} from '@angular/core';
import {Observable} from 'rxjs/Rx';
declare var jQuery: any;

@Component({
    moduleId: module.id,
    template: `<template [ngTemplateOutlet]="headerContent" [ngOutletContext]="{ options: options, flag:flag }"></template>`,
    selector: 'header-com',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class Header /*implements AfterContentInit*/ {
    @Input() options: any = {};
    @ContentChild("headerContent") private headerContent: TemplateRef<Object>;
    isColResize: boolean = false;
    flag: string = '0..';
    constructor(private el: ElementRef) { }


    ngAfterViewInit() {
        if (this.options.colResize) {
            this.columnResizing();
        }
    }
    public sort(colDef: any) {
        console.log('sort', colDef);
        //if (this.isColResize) { this.isColResize = false; return; }
        //colDef.reverse = !(typeof colDef.reverse === 'undefined' ? true : colDef.reverse);
        //this.config.columnDefs.forEach(_ => {
        //    if (_ !== colDef) {
        //        _.reverse = undefined;
        //    }
        //});
        //if (this.config.sspFn) {
        //    this.pager.sort(colDef.field, colDef.reverse);
        //    return;
        //}
        //let reverse = !colDef.reverse ? 1 : -1, sortFn = typeof colDef.comparator === 'function' ?
        //    (a: any, b: any) => reverse * colDef.comparator(a, b) :
        //    function (a: any, b: any) { return a = a[colDef.field], b = b[colDef.field], reverse * (<any>(a > b) - <any>(b > a)); };
        //this.data = [...this.data.sort(sortFn)];
    }
    private sortIcon(colDef: any): any {
        let hidden = typeof colDef.reverse === 'undefined';
        return { 'fa-sort not-active': hidden, 'fa-caret-up': colDef.reverse === false, 'fa-caret-down': colDef.reverse === true };  // for default sort icon  ('fa-sort': hidden, )
    }
    private columnResizing() {

        let thList: any[] = this.el.nativeElement.querySelectorAll('div.resizable .juCol'),

            mousemove$ = Observable.fromEvent(document, 'mousemove'),
            mouseup$ = Observable.fromEvent(document, 'mouseup'),
            startX = 0, w1 = 0, w2 = 0, not_mousedown = true, tblWidth = this.options.cwidth, activeIndex = 1;
        console.log(thList);
        for (let index = 0; index < thList.length; index++) {
            let th = thList[index];
            Observable.fromEvent(th, 'mousemove')
                .filter(_ => index !== 0 /*&& index + 1 !== thList.length*/)
                .filter((e: any) => {                    
                    if (e.target.tagName === 'DIV') {
                        if (Math.abs(e.x - jQuery(e.target).offset().left) < 7) {
                            e.target.style.cursor = 'col-resize';
                            return true;
                        }
                        if (not_mousedown) {
                            e.target.style.cursor = 'default';
                        }
                        return false;
                    }
                    return false;
                })
                .flatMap((e: any) => {
                    return Observable.fromEvent(e.target, 'mousedown')
                        .do((e: any) => {
                            document.body.style.cursor = 'col-resize';
                            not_mousedown = false;
                            activeIndex = index;
                            startX = e.x;
                            tblWidth = this.options.cwidth;
                            w1 = this.options.columns[index - 1].width;
                            w2 = this.options.columns[index].width;
                        });
                })
                .subscribe();

        }
        mouseup$.subscribe(e => {
            document.body.style.cursor = 'default';
            not_mousedown = true
        });
        mousemove$
            .map((e: any) => e.x - startX)
            .filter(e => w1 + e > 20 && !not_mousedown)
            .do(diff => { if (Math.abs(diff) > 0) { this.isColResize = true; } })
            .debounceTime(30)
            .subscribe(e => {
                this.options.columns[activeIndex - 1].width = w1 + e;
                this.options.cwidth = tblWidth + e;
                this.setFlag(e);
               
            });
    }
    setFlag(newValue: any) {
        this.flag = newValue.toString()+'..';
        console.log(newValue+'...>');
    }
}