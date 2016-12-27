import { 
    Component, OnInit, OnChanges, OnDestroy, Input, Output, EventEmitter, ComponentRef,
    ViewContainerRef, ViewChild, ElementRef, ComponentFactory,
    ChangeDetectionStrategy, ContentChild, TemplateRef,
    ViewEncapsulation}      from '@angular/core';
import {juForm}             from '../juForm/juForm';
import {juPager}            from '../juPager/juPager';
import {TextFilter}         from './TextFilter';
import {NumberFilter}       from './NumberFilter';
import {SetFilter}          from './SetFilter';
import {juGridBuilder} from './juGrid.builder';

import {Observable,
    Subscription}           from 'rxjs/Rx';
import {rowEditor}          from './rowEditor';

declare var jQuery: any;
@Component({
    moduleId: module.id,
    selector: '.juGrid, [juGrid], juGrid',    
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
    template: `<div class="grid-toolbar">
                    <div class="quickSearch" *ngIf="options?.quickSearch">             
                            <div class="input-group stylish-input-group">
                                <input type="text" class="form-control" (keyup)="search($event.target.value)" placeholder="Search">
                                <span class="input-group-addon">                        
                                        <span class="fa fa-search"></span>                         
                                </span>
                            </div>            
                    </div>
                  <div [style.left.px]="options?.quickSearch?144:0" class="tool-items"><template [ngTemplateOutlet]="toolbar"></template></div>
	            </div> 
                <div *ngIf="options?.quickSearch||toolbar" style="height:33px">&nbsp;</div> 
                <div #dynamicContentPlaceHolder></div>  
                <div class="juForm" *ngIf="options?.crud" (onLoad)="onFormLoad($event)" [options]="options.formDefs"></div>`
})

export class juGrid implements OnInit, OnChanges, OnDestroy
{
    @Input() options: any = {};
    private _oldItem: any = null;
    private _updtedItem: any = null;
    private _searchInActive: boolean = false;
    @Input() data = [];
    @Output() onLoad = new EventEmitter();
    //private appRef: any
    wasViewInitialized: boolean = false;
    protected componentRef: ComponentRef<any>;
    @ViewChild('dynamicContentPlaceHolder', { read: ViewContainerRef })
    protected dynamicComponentTarget: ViewContainerRef;   
    @ContentChild(TemplateRef) public toolbar: TemplateRef<any>;
    constructor(
        private _elementRef: ElementRef,
        protected typeBuilder: juGridBuilder,
        private viewContainerRef: ViewContainerRef
    ) { }
    public ngOnInit()
    {
        if (!this.options)
        {
            return;
        }
        this.options.title = this.options.title || 'Title';
        this.options.panelMode = this.options.panelMode || 'primary';
        this.options.viewMode = this.options.viewMode || 'panel';
        this.options.pagerPos = this.options.pagerPos || 'top';
        this.options.pagerLeftPos = this.options.pagerLeftPos || 200;
        this.options.height = this.options.height || 500;
        this.options.rowHeight = this.options.rowHeight || 0;
        this.options.headerHeight = this.options.headerHeight || 0;
        this.options.linkPages = this.options.linkPages || 10;
        this.options.pageSize = this.options.pageSize || 10;
        this.options.confirmMessage = this.options.confirmMessage || 'Are you sure to remove this item?';

        if (!('enablePowerPage' in this.options))
        {
            this.options.enablePowerPage = false;
        }
        if (!('enablePageSearch' in this.options))
        {
            this.options.enablePageSearch = true;
        }

        if (!('colResize' in this.options))
        {
            this.options.colResize = false;
        }
        if (!('crud' in this.options))
        {
            this.options.crud = false;
        }
        if (!('create' in this.options))
        {
            this.options.create = true;
        }
        if (!('update' in this.options))
        {
            this.options.update = true;
        }
        if (!('remove' in this.options))
        {
            this.options.remove = true;
        }
        if (!('quickSearch' in this.options))
        {
            this.options.quickSearch = false;
        }
        if (!('trClass' in this.options))
        {
            this.options.trClass = () => null;
        }
        if (!('level' in this.options))
        {
            this.options.level = 5;
        }
		if (!('noPager' in this.options))
        {
            this.options.noPager = false;
        }
        if (!('editPermission' in this.options))
        {
            this.options.editPermission = true;
        }
        if (this.options.formDefs)
        {
            this.options.formDefs.viewMode = 'popup';
        }
        this.options.rowEvents = this.options.rowEvents || '';

        if (this.options.crud)
        {
            this.options.newItem = () =>
            {
                this._oldItem = null;
                this._updtedItem = null;
                this.options.message = '';
                this.componentRef.instance.formObj.isUpdate = false;
                this.componentRef.instance.formObj.refresh();
                this.componentRef.instance.formObj.showModal();
                if (this.options.insert_CB)
                {
                    this.options.insert_CB(this.componentRef.instance.formObj);
                }
            };
            this.options.columnDefs.unshift({
                headerName: 'crud', width: 50, enable: this.options.create,
                action: [{
                    enable: this.options.update, title: 'Edit', icon: 'fa fa-pencil', click: (data) =>
                    {
                        this._oldItem = data;
                        this._updtedItem = Object.assign({}, data);
                        this.options.message = '';
                        this.componentRef.instance.formObj.isUpdate = true;
                        this.componentRef.instance.formObj.setModel(this._updtedItem);
                        this.componentRef.instance.formObj.showModal();
                        if (this.options.update_CB)
                        {
                            this.options.update_CB(this.componentRef.instance.formObj, this._updtedItem);
                        }
                    }
                }, {
                        enable: this.options.remove, title: 'Remove', icon: 'fa fa-remove', click: (data) =>
                        {
                            if (confirm(this.options.confirmMessage))
                            {
                                this._oldItem = null;
                                this._updtedItem = null;
                                if (this.options.removeItem)
                                {
                                    this.options.removeItem(data);
                                }
                            }
                        }
                    }]
            });
            if(this.options.additionalActionInCrud && this.options.additionalActionInCrud.length>0){
                this.options.additionalActionInCrud.forEach(_=>_.enable=true);
                this.options.columnDefs[0].action.push(...this.options.additionalActionInCrud);
            }
            if(this.options.crudColumnWidth){
                this.options.columnDefs[0].width=this.options.crudColumnWidth;
            }
        }
       
        this.options.api = { grid: this, form: null };
       
    }
    
    public exportToCSV(data: any, fileName: string)
    {        
        const replacer = (key, value) => value === null ? '' : value; 
       
        const header = this.options.columnDefs.filter(_=>_.field).map(_ => _);
        let csv: any[] = data.map(row => header.map(_ => _.formatter ? _.formatter(row[_.field]): JSON.stringify(row[_.field], replacer)).join(','));
      
        csv.unshift(header.map(_=>_.field).join(','));

        let csvContent = "data:text/csv;charset=utf-8,"+ csv.join('\r\n');

        let encodedUri = encodeURI(csvContent);
        let link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", fileName);
        //document.body.appendChild(link); // Required for FF

        link.click();
       
    }
    public ngOnChanges(changes)
    {
        if (this.data && this.wasViewInitialized)
        {
            this.componentRef.instance.setData(this.data);
        }
    }
    public ngAfterViewInit(): void
    {
        this.wasViewInitialized = true;
        this.refreshContent();       
    }    
    public ngOnDestroy()
    {
        if (this.componentRef)
        {
            this.componentRef.destroy();
            this.componentRef = null;
        }
    }
    
    public render(): Promise<juGrid> {
        return this.refreshContent();
    }
    protected refreshContent() : Promise<juGrid>
    {        
        if (this.componentRef)
        {
            this.componentRef.destroy();
        }
		return new Promise((resolve, reject) => {  
 
				this.typeBuilder
					.createComponentFactory(this.options)
					.then((factory: ComponentFactory<any>) =>
					{
						this.componentRef = this
							.dynamicComponentTarget
							.createComponent(factory);

						const component = this.componentRef.instance;
						component.config = this.options;
						if (this.options.data || this.data)
						{
							component.setData(this.data || this.options.data);
						}
						if (!this.options.crud)
						{
							async_call(() => { this.onLoad.emit(this); });
						}                
						resolve(this);
					});
		});
    }   
    public getUpdatedRecords()
    {
       
         return this.componentRef.instance.editors.toArray().filter(_ => _.isUpdated).map(_ => _.model);
       
    } 
    public addItem(item: any)
    {

        if (this._searchInActive)
        {
            this.data.unshift(item);
        }
        this.componentRef.instance.addItem(item);

    }
    public get valid()
    {
        if (this.componentRef && this.componentRef.instance)
            return this.componentRef.instance.valid;
        return true;
    }
    public getValidRows(): any[]
    {
        if (this.componentRef && this.componentRef.instance)
            return this.componentRef.instance.getValidRows();
        return [];
    }
    public getData()
    {
        return this.data.length ? this.data : this.componentRef.instance.viewList;
    }
    public setData(data)
    {
         this.data.length ? this.data=data : this.componentRef.instance.viewList=data;
    }
    public markForCheck()
    {
        if (this.componentRef.instance)
        {
            this.componentRef.instance.markForCheck();
        }
    }
    public setScrollTop(scrollTop: number)
    {
        if (this.componentRef.instance)
        {
            this.componentRef.instance.setScrollTop(scrollTop);
        }
    }
    public showMessage(message: string, messageCss: string = 'alert alert-info')
    {
        this.options.message = message;
        this.options.messageCss = messageCss;
        async_call(() => { this.options.message = ''; }, 3000);
    }
    public updateItem(record: any)
    {
        if (this._oldItem && record)
        {
            for (let prop in record)
            {
                this._oldItem[prop] = record[prop];
            }
        }
    }
    public removeItem(item: any)
    {

        if (this._searchInActive)
        {
            this.data.splice(this.data.indexOf(item), 1);
        }
        this.componentRef.instance.removeItem(item);

    }

    public setSelectData(key: string, value: any[])
    {
        this.componentRef.instance.setSelectData(key, value);
    }
    public setJuSelectData(key: string, value: any[], index: number)
    {
        this.componentRef.instance.setJuSelectData(key, value, index);
    }
	public empty()
    {
        this.componentRef.instance.empty();
    }
    public slideToggle()
    {
        this.componentRef.instance.slideToggle();
    }
    public search(val: any)
    {
        if (this.options.sspFn)
        {
            this.options.api.pager.search(val);
            return;
        }
        if (!val)
        {
            this._searchInActive = false;
            this.componentRef.instance.data = this.data;
            return;
        }
        this._searchInActive = true;
        val = val.toLowerCase();
        let res: any[] = [];
        let len = this.options.columnDefs.length;
        this.data.forEach((item) =>
        {
            for (var index = 0; index < len; index++)
            {
                let item2 = this.options.columnDefs[index];
                if (item2.field && item[item2.field] && item[item2.field].toString().toLowerCase().indexOf(val) != -1)
                {
                    res.push(item); break;
                }
            }
        });
        this.componentRef.instance.data = res;
    }
    public onFormLoad(form: juForm)
    {
        this.componentRef.instance.formObj = form;
        this.options.api.form = form;
        if (this.options.onFormLoad)
        {
            this.options.onFormLoad(form);
        }
        this.onLoad.emit(this);
    }
}
function async_call(fx: Function, time = 0)
{
    let tid = setTimeout(() => { fx(); clearTimeout(tid); }, time);
}

/*interface*/ 
import { FormOptions} from '../juForm/juForm';
import { SelectOptions} from '../juForm/juSelect';
export interface ColumnDefs
{
    type?: 'select' | 'html' | 'juSelect' | 'datepicker' | string;
    width?: number;
    headerName?: string;
    field?: string;
    tdClass?: (row: any, index: number, isFirst: boolean, isLast: boolean) => {};
    cellRenderer?: (row: any, index: number, isFirst: boolean, isLast: boolean) => any;
    action?: [{ title: string, icon: string, click: (row: any) => void }];
    children?: ColumnDefs[];
    sort?: boolean;
    comparator?: (a: any, b: any) => boolean;
    filter?: 'set' | 'text' | 'number' | any;
    params?: { cellRenderer?: (row: any, index?: number) => any, apply?: boolean, valueGetter?: (row: any) => any, value?: string[] };
    dataSrc?: any[] | any;
    change?: (row: any, index?: number) => void;
    content?: string;    
    validators?: Function | Array<Function>;
    search?: boolean;
    exp?: string;
    options?: SelectOptions;
    hide?: boolean;
    inputExp?: string;
    formatter?: (val: any) => any;
    getValue?: (row: any) => string;
    editPermission?: (row: any) => boolean;
    config?:any;
}
export interface GridOptions
{
    title?:string;
    panelMode?: 'default' |'primary'|'success'|'info'|'warning'|'danger';
    viewMode? : 'panel'|string;
    pagerPos?:'top'|'bottom'|'header';
    pagerLeftPos?:number;
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
    update_CB?: (form: juForm, model: any) => void;
    insert_CB?: (form: juForm) => void;
    trClass?: (row: any, index: number, isFirst: boolean, isLast: boolean) => {};
    formDefs?: FormOptions;
    columnDefs?: ColumnDefs[];
    removeItem?: (data: any) => void;
    api?: { form: juForm, grid: juGrid, pager: juPager };
    sspFn?: (params: { pageSize: number, pageNo: number, searchText: string, sort: string, filter: any[] }) => Observable<{ totalRecords: number, data: any[] }>;
    onFormLoad?: (form: juForm) => void;
    trackBy?: string;
    enableTreeView?: boolean;
    lazyLoad?: (row: any) => Observable<Array<any>>;
    level?: number;
    enableCellEditing?: boolean;
    [key: string]: any;
    noPager?: boolean;
    colResize?: boolean;
    rowEvents?:string;
    crudColumnWidth?:number;
    additionalActionInCrud?: [{ title: string, icon: string, click: (row: any) => void }];
    editPermission?: boolean;   
}
export interface BaseFilter
{
    init: (params: any) => void;
    getGui: () => HTMLElement | Node | string;
    isFilterActive: () => boolean;
    doesFilterPass: (item: any) => boolean;
    destroy: () => void;
    searchText: string;
    searchCategory: string;
}



