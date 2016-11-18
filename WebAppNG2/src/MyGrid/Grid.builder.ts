import {Component,
    Renderer,
    ChangeDetectorRef,
    ViewChild,
    AfterContentInit,
    ComponentFactory,
    NgModule,
    Input,
    Output,
    EventEmitter,
    ChangeDetectionStrategy,
    Injectable,
    ElementRef,
    ViewEncapsulation} from '@angular/core';
import {RuntimeCompiler} from '@angular/compiler';
import { CommonModule }         from '@angular/common';
import { FormsModule }          from '@angular/forms';
import {MyGridModule} from './MyGrid.module';
import {Observable, Subscription} from 'rxjs/Rx';
declare var jQuery: any;

@Injectable()
export class GridBuilder {
    private options: any;
    constructor(protected compiler: RuntimeCompiler) { }

    protected getTemplate(): string {
        let tpl: any[] = [];
        tpl.push(this.getNormalTable());
        return tpl.join('');
    }
    public createComponentFactory(options: any): Promise<ComponentFactory<any>> {
        this.options = options;
        const type = this.createNewComponent(this.getTemplate());
        const module = this.createComponentModule(type);

        return new Promise((resolve) => {
            this.compiler
                .compileModuleAndAllComponentsAsync(module)
                .then((moduleWithFactories) => {
                    resolve(moduleWithFactories.componentFactories.find(_ => _.componentType === type));
                });
        });
    }
    protected createNewComponent(tmpl: string) {
        console.log(tmpl);
        @Component({
            selector: 'dynamic-grid2',
            template: tmpl,
            encapsulation: ViewEncapsulation.None,
            changeDetection: ChangeDetectionStrategy.OnPush
        })
        class DynamicGridComponent2 {
            @Input() options: any = {};
            @Input() data: any[];
            dataList: any[] = [];
            isColResize: boolean = false;
            @ViewChild('resizable') resizable: ElementRef;
            @ViewChild('resizeMarker') resizeMarker: ElementRef;
            @ViewChild('dataContainer') dataContainer: ElementRef;
            protected subsList: Subscription[] = [];
            constructor(
                private el: ElementRef,
                private _cd: ChangeDetectorRef,
                private renderer: Renderer) { }

            ngAfterViewInit() {
                if (this.options.colResize) {
                    this.columnResizing();
                }
            }
            ngOnDestroy() {
                this.subsList.forEach(_ => _.unsubscribe());
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
            private getParentNode(node: any) {
                while (!node.classList.contains('juHeader')) {
                    node = node.parentNode;
                }
                return node;
            }
            private removeSelection() {
                if ((<any>document).selection) {
                    (<any>document).selection.empty();
                } else {
                    window.getSelection().removeAllRanges();
                }
            }
            private columnResizing() {
                let thList: any[] = this.resizable.nativeElement.querySelectorAll('.juCol'),
                    mousemove$ = Observable.fromEvent(document, 'mousemove'),
                    mouseup$ = Observable.fromEvent(document, 'mouseup'),
                    startX = 0, w1 = 0, w2 = 0, not_mousedown = true, tblWidth = this.options.cwidth, activeIndex = 1;

                for (let index = 0; index < thList.length; index++) {
                    let th = thList[index];
                    this.subsList.push(Observable.fromEvent(th, 'mousemove')
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
                                .filter((e: any) => {
                                    const left = this.getParentNode(e.target).getBoundingClientRect().left;
                                    return e.x - left <= 10;
                                })
                                .do((e: any) => {
                                    document.body.style.cursor = 'col-resize';
                                    not_mousedown = false;
                                    activeIndex = index;
                                    startX = e.x; console.log(e.x);
                                    tblWidth = this.options.cwidth;
                                    w1 = this.options.columns[index - 1].width;
                                    w2 = 0;
                                    if (this.options.columns[activeIndex - 1].parent) {
                                        this.InitParentWidth(this.options.columns[activeIndex - 1].parent);
                                    }
                                    this.positionResizeMarker(startX); 
                                });
                        })
                        .subscribe());

                }
                this.subsList.push(mouseup$.subscribe(e => {
                    document.body.style.cursor = 'default';
                    if (!not_mousedown) {
                        this.options.columns[activeIndex - 1].width = w1 + w2;
                        this.options.cwidth = tblWidth + w2;
                        if (this.options.columns[activeIndex - 1].parent) {
                            this.setParentWidth(this.options.columns[activeIndex - 1].parent, w2);
                        }
                        this._cd.markForCheck();
                        this.renderer.setElementStyle(this.resizeMarker.nativeElement, 'display', 'none');
                    }
                    not_mousedown = true;
                    this.removeSelection();
                }));
                this.subsList.push(mousemove$
                    .map((e: any) => e.x - startX)
                    .filter(e => w1 + e > 20 && !not_mousedown)
                    .do(diff => { if (Math.abs(diff) > 0) { this.isColResize = true; } })
                    //.debounceTime(30)
                    .subscribe(e => {
                        w2 = e;
                        this.positionResizeMarker(e + startX);
                        this.removeSelection();
                    }));
            }
            private positionResizeMarker(left: number) {
                const rect = this.resizable.nativeElement.getBoundingClientRect();
                const bodyRect = document.body.getBoundingClientRect();
                const resizeElement = this.resizeMarker.nativeElement;
                const height = this.dataContainer.nativeElement.clientHeight + this.resizable.nativeElement.clientHeight;
                this.renderer.setElementStyle(resizeElement, 'top', (rect.top - bodyRect.top) + 'px');
                this.renderer.setElementStyle(resizeElement, 'height', height + 'px');
                this.renderer.setElementStyle(resizeElement, 'left', left + 'px');
                this.renderer.setElementStyle(resizeElement, 'display', 'block');
            }
            private InitParentWidth(col: any) {
                col.w1 = col.width;
                if (col.parent) {
                    this.InitParentWidth(col.parent);
                }
            }
            private setParentWidth(col: any, dx: number) {
                col.width = col.w1 + dx;
                if (col.parent) {
                    this.setParentWidth(col.parent, dx);
                }
            }
            private normalTableScroll(e, headerDiv) {
                headerDiv.scrollLeft = e.target.scrollLeft;
            }
        }
        return DynamicGridComponent2;
    }
    protected createComponentModule(componentType: any) {
        const modules: any[] = this.options.modules || [];
        @NgModule({
            imports: [CommonModule, FormsModule, MyGridModule, ...modules],
            declarations: [componentType],
        })
        class RuntimeComponentModuleForGrid {
        }
        return RuntimeComponentModuleForGrid;
    }
    //strt templte building 
    protected getNormalTable() {
        const html = `<div class="juTable" [style.width]="options.width" style="display:inline-block">
            <div>Normal Table</div>
            <div class="grid-border">
                <div style="overflow:hidden;" #headerDiv>
                    <div [style.width.px]="options.cwidth+22">                                               
                           ${this.getHeader(this.options.columns)}                           
                    </div>
                </div>
                <div #dataContainer style="overflow:auto;max-height:${this.options.height || 350}px" (scroll)="normalTableScroll($event, headerDiv)">
                    <div [style.width.px]="options.cwidth">
                        <div class="data-not-found" *ngIf="!dataList.length"><b>Data Not Found</b></div>                       
                    </div>
                </div>
            </div>
        </div>
        <span #resizeMarker class="resize-marker"></span>`;
        return html;
    }
    //calculate header
    protected headerHtml: any[] = [];
    protected getHeader(hederDef) {
        this._colIndex = 0; this.headers = [];
        var colDef = [], rc = this.row_count(hederDef), i = 0;
        while (i < rc) {
            this.headerHtml[i] = [];
            i++;
        }
        hederDef.forEach((it: any, i: number) => {
            this._colIndex = i;
            if (it.hide) return;
            this.traverseCell(it, rc, 0, colDef);
        });
        if (rc > 1) {
            this.options.columns = colDef;
        }
        this.options.headers = this.headers;
        this.options.cwidth = this.options.columns.map(_ => _.width).reduce((a, b) => a + b, 0);
        const len = this.headerHtml.length;
        return this.headerHtml.map((_, i) => `<div ${(len - 1) == i ? '#resizable' : ''} class="juRow">${_.join('')}</div>`).reduce((p, c) => p + c, '');
    }
    protected _colIndex: number = 0;
    protected headers: any[] = [];
    protected traverseCell(cell, rs, headerRowFlag, colDef: any[]) {
        this.headers.push(cell);
        if (!cell.width) { cell.width = 120; }
        if (cell.children) {
            this.headerHtml[headerRowFlag].push('<div class="juCol juHeader"');
            const index = this.headers.indexOf(cell);
            this.headerHtml[headerRowFlag].push(` [style.width.px]="options.headers[${index}].width"`);
            this.headerHtml[headerRowFlag].push(`>${cell.header}</div>`);
            headerRowFlag++
            let rc = rs, hf = headerRowFlag;
            for (var i = 0; i < cell.children.length; i++) {
                cell.children[i].parent = cell;
                this.traverseCell(cell.children[i], --rs, headerRowFlag, colDef);
                rs = rc;
            }

        } else {
            if (headerRowFlag === 0 && rs > 1) {
                headerRowFlag = rs - 1;
                let index = headerRowFlag - 1, child = cell, parent = null;
                while (index >= 0) {
                    parent = Object.assign({}, cell);
                    this.headers.push(parent);
                    cell.parent = parent;
                    child = parent;
                    const parentIndex = this.headers.indexOf(parent);
                    this.headerHtml[index].push(`<div class="juCol juHeader" [style.width.px]="options.headers[${parentIndex}].width"></div>`);
                    index--;
                }
            }
            colDef.push(cell);
            this._colIndex = colDef.indexOf(cell);
            let rh = this.options.headerHeight > 0 ? `style="height:${this.options.headerHeight}px"` : '';
            this.headerHtml[headerRowFlag].push(`<div class="juCol juHeader" ${rh} `);

            this.headerHtml[headerRowFlag].push(` [style.width.px]="options.columns[${this._colIndex}].width"`);

            if (cell.sort) {
                this.headerHtml[headerRowFlag].push(` (click)="sort(options.columns[${this._colIndex}])"`);
            }
            if (cell.filter) {
                this.headerHtml[headerRowFlag].push(` (mouseenter)="options.columns[${this._colIndex}].filterCss={'icon-hide':false,'icon-show':true}"`);
                this.headerHtml[headerRowFlag].push(` (mouseleave)="options.columns[${this._colIndex}].filterCss={'icon-hide':!options.columns[${this._colIndex}].isOpened,'icon-show':options.columns[${this._colIndex}].isOpened}"`);
            }
            if (cell.header === 'crud' && cell.enable) {
                this.headerHtml[headerRowFlag].push(`><a href="javascript:;" title="New item" (click)="options.newItem()"><b class="fa fa-plus-circle"></b> </a></th>`);
            } else {
                this.headerHtml[headerRowFlag].push(' >');
                if (cell.sort) {
                    this.headerHtml[headerRowFlag].push(`<b [ngClass]="self.sortIcon(options.columns[${this._colIndex}])" class="fa"></b>`);
                }
                if (cell.filter) {
                    this.headerHtml[headerRowFlag].push(` <b [ngClass]="filterIcon(options.columns[${this._colIndex}])" class="fa fa-filter"></b>`);
                }
                this.headerHtml[headerRowFlag].push(` <span>${cell.header}</span>`);
                if (cell.filter) {
                    this.headerHtml[headerRowFlag].push(`<a href="javascript:;" title="Show filter window." [ngClass]="options.columns[${this._colIndex}].filterCss" (click)="showFilter(options.columns[${this._colIndex}], $event)" class="filter-bar icon-hide"><b class="fa fa-filter"></b></a>`);

                }
                this.headerHtml[headerRowFlag].push('</div>');
            }
        }
    }
    private row_count(hederDef) {
        var max = 0;
        for (var i = 0; i < hederDef.length; i++) {
            max = Math.max(max, this.cal_header_row(hederDef[i], 1));
        }
        return max;
    }
    protected cal_header_row(cell, row_count) {
        var max = row_count;
        if (cell.children) {
            row_count++;
            for (var i = 0; i < cell.children.length; i++) {
                max = Math.max(max, this.cal_header_row(cell.children[i], row_count));
            }
        }
        return max;
    }
    protected totalCS: number = 0;
    protected getColSpan(cell: any) {
        if (cell.children) {
            cell.children.forEach(it => {
                this.totalCS++;
                this.getColSpanHelper(it);
            });
        }
    }
    protected getColSpanHelper(cell: any) {
        if (cell.children) {
            this.totalCS--;
            cell.children.forEach(it => {
                this.totalCS++;
                this.getColSpan(it);
            });
        }
    }
    //end of calculte header
}