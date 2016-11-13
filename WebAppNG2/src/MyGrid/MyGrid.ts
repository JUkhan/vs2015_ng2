import {Component, Input, ChangeDetectionStrategy, ViewEncapsulation,
    QueryList, ViewChildren, AfterViewInit, OnInit,
    OnDestroy, ComponentRef, ViewContainerRef, ViewChild, ComponentFactory
} from '@angular/core';

import {Row} from './Row';
import {Observable, Subscription} from 'rxjs/Rx';
import {GridBuilder} from './Grid.builder';

@Component({
    moduleId: module.id,
    template: `<div #dynamicContentPlaceHolder></div>`,
    selector: 'my-grid',
    changeDetection: ChangeDetectionStrategy.OnPush,    
    encapsulation: ViewEncapsulation.None
})
export class MyGrid implements AfterViewInit, OnDestroy, OnInit
{
    @Input() options: GridOptions = <GridOptions>{};
    @Input()
    set data(val: any[]) {
        this._data = val;
        if (this.gridRef) {
            this.gridRef.instance.data = val;
            console.log(val);
        }
    }
    get data() { return this._data; }
    protected _data: any[];
    //@ViewChildren(Row) _rows = new QueryList<Row>();
    protected ctrlKey: boolean = false;
    protected subscriptionList: Subscription[] = [];
    protected width: number = 320;
    protected gridRef: ComponentRef<any>;
    @ViewChild('dynamicContentPlaceHolder', { read: ViewContainerRef }) 
    protected dynamicComponentTarget: ViewContainerRef;     
    constructor(protected typeBuilder: GridBuilder) { }
    public ngOnInit() {
        //this.setWidth();
        this.options.width = this.options.width || '100%';
    }
    public render(): Promise<MyGrid>
    {
        return this.refreshContent();
    }
    protected refreshContent(): Promise<MyGrid>
    {
        if (this.gridRef)
        {
            this.gridRef.destroy();
        }
        return new Promise((resolve, reject) =>
        {

            this.typeBuilder
                .createComponentFactory(this.options)
                .then((factory: ComponentFactory<any>) =>
                {
                    this.gridRef = this
                        .dynamicComponentTarget
                        .createComponent(factory);
                   
                    resolve(this);
                });
        });
    }  
    
    public ngAfterViewInit()
    {
        this.refreshContent().then(_ => {
            this.gridRef.instance.options = this.options;
            this.gridRef.instance.data = this.data;
            this.gridRef.changeDetectorRef.detectChanges();
            console.log(this.options, this.data);
        });     
        //this._rows.changes.subscribe(res => console.log(res));
        if (this.options.multiSelect)
        {
            //this.handle_CTRL_key();
        }       
    }
    public ngOnDestroy()
    {
        this.subscriptionList.forEach(_ => _.unsubscribe());
        if (this.gridRef)
        {
            this.gridRef.destroy();
            this.gridRef = null;
        }
        console.log('Destroy Grid');
    }
    protected setWidth() {
        let sum = 0;
        this.options.columns.forEach(_ => sum += _.width || 120);
        this.width = sum;
    }    
    /*protected rowSelect(row: Row)
    {
        if (!(this.options.singleSelect || this.options.multiSelect)) return;
        if (this.ctrlKey)
        {
            row.toggleRowSelect();
        }
        else
        {
            let rowArray = this._rows.toArray();
            rowArray.filter(_ => _.selected).forEach(_ => _.setRowSelection(false));
            row.setRowSelection(true);            
        }
        if (this.options.rowSelect)
        {
            this.options.rowSelect(row.row, row.selected);
        }
    }
    protected handle_CTRL_key()
    {
        console.log('handle key');
        this.subscriptionList.push(Observable.fromEvent(document, 'keydown')
            .subscribe((e: any) =>
            {
                this.ctrlKey = e.ctrlKey;
            }));
        this.subscriptionList.push(Observable.fromEvent(document, 'keyup')
            .subscribe((e: any) =>
            {
                this.ctrlKey = false;
            }));
    }
    protected tblScroll(e, headerDiv) {
        headerDiv.scrollLeft = e.target.scrollLeft;
    }
    public getSelectedRows()
    {
        return this._rows.toArray().filter(_ => _.selected);
    }
    public selectAllRows(isSelect: boolean)
    {
        this._rows.toArray().forEach(_ => _.setRowSelection(isSelect));
    }
    public selectByIndex(index: number, isSelect: boolean=true)
    {
        let rowArray = this._rows.toArray();
        if (rowArray[index])
            rowArray[index].setRowSelection(isSelect);
    }*/
}

export interface ColumnDefs {
    type?: 'select' | 'html' | 'juSelect' | 'datepicker' | string;
    align?: 'left' | 'center' | 'right';
    width?: number;
    header?: string;
    field?: string;
    tdClass?: (row: any, index: number, isFirst: boolean, isLast: boolean) => {};
    render?: (row: any, index: number, isFirst: boolean, isLast: boolean) => any;
    action?: [{ title: string, icon: string, click: (row: any) => void }];
    children?: ColumnDefs[];
    sort?: boolean;
    comparator?: (a: any, b: any) => boolean;
    filter?: 'set' | 'text' | 'number' | any;
    params?: { cellRenderer?: (row: any, index?: number) => any, apply?: boolean, valueGetter?: (row: any) => any, value?: string[] };
    data?: any[] | any;
    change?: (row: any, index?: number) => void;
    content?: string;
    validators?: Function | Array<Function>;
    search?: boolean;
    exp?: string;
    selectOptions?: any;//SelectOptions;
    hide?: boolean;
    inputExp?: string;
    formatter?: (val: any) => any;
}
export interface GridOptions {
    title?: string;
    panelMode?: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger';
    viewMode?: 'panel' | string;
    pagerPos?: 'top' | 'bottom' | 'header';
    pagerLeftPos?: number;
    width?: string;
    height?: number;
    rowHeight?: number;
    headerHeight?: number;
    classNames?: string;
    enablePowerPage?: boolean;
    enablePageSearch?: boolean;
    linkPages?: number;
    pageSize?: number;
    confirmMessage?: string;
    crud?: boolean;
    create?: boolean;
    update?: boolean;
    remove?: boolean;
    quickSearch?: boolean;
    //update_CB?: (form: juForm, model: any) => void;
    //insert_CB?: (form: juForm) => void;
    trClass?: (row: any, index: number, isFirst: boolean, isLast: boolean) => {};
    //formDefs?: FormOptions;
    columns?: ColumnDefs[];
    removeItem?: (data: any) => void;
    //api?: { form: juForm, grid: juGrid, pager: juPager };
    sspFn?: (params: { pageSize: number, pageNo: number, searchText: string, sort: string, filter: any[] }) => Observable<{ totalRecords: number, data: any[] }>;
    //onFormLoad?: (form: juForm) => void;
    trackBy?: string;
    enableTreeView?: boolean;
    lazyLoad?: (row: any) => Observable<Array<any>>;
    level?: number;
    enableCellEditing?: boolean;
    [key: string]: any;
    noPager?: boolean;
    colResize?: boolean;
    rowEvents?: string;
    crudColumnWidth?: number;
    additionalActionInCrud?: [{ title: string, icon: string, click: (row: any) => void }];
    rowSelect?: (row: any, isSelected: boolean) => void;
    multiSelect?: boolean;
    singleSelect?: boolean;
}