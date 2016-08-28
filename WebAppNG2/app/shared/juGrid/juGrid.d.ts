import {juGrid}       from './juGrid';
import {juPager}      from '../juPager/juPager';
import {juForm }      from '../juForm/juForm';
import { FormOptions} from '../juForm/juForm.d';
import {Observable}   from 'rxjs/Rx';
export interface ColumnDefs{
    type?:'select'|'html'|'juSelect'|'datepicker'|string;
    width?:number;
    headerName?:string;
    field?:string;
    tdClass?:(row:any, index:number, isFirst:boolean, isLast:boolean)=>{};
    cellRenderer?:(row:any, index:number, isFirst:boolean, isLast:boolean)=>any;
    action?:[{title:string, icon:string, click:(row:any)=>void}];
    children?:ColumnDefs[];
    sort?:boolean;
    comparator?:(a:any, b:any)=>boolean;
    filter?:'set'|'text'|'number'|any;
    params?:{cellRenderer?:(row:any, index?:number)=>any, apply?:boolean, valueGetter?:(row:any)=>any,value?:string[]};
    dataSrc?:any[]|any;
    change?:(row:any, index?:number)=>void;
    content?:string;
    viewMode?:'select'|'checkbox'|'radio';
    validators?:Function|Array<Function>;
    search?:boolean;
    
}
export interface GridOptions{
    classNames?:string;
    linkPages?:number;
    pageSize?:number;
    confirmMessage?:number;
    crud?:boolean;
    create?:boolean;
    update?:boolean;
    remove?:boolean;
    quickSearch?:boolean;
    update_CB?:(form:juForm, model:any)=>void;
    insert_CB?:(form:juForm)=>void;
    trClass?:(row:any, index:number, isFirst:boolean, isLast:boolean)=>{};
    formDefs?:FormOptions;
    columnDefs?:ColumnDefs[];
    removeItem?: (data:any) =>void;
    api?:{form:juForm, grid:juGrid, pager:juPager};
    sspFn?:(params:{pageSize:number,pageNo:number, searchText:string, sort:string, filter:any[]})=>Observable<{totalPage:number, data:any[]}>;
    onFormLoad?: (form: juForm) =>void;
    trackBy?:string; 
    enableTreeView?:boolean; 
    lazyLoad?:(row:any)=>Observable<Array<any>>;
    level?:number;
    enableCellEditing?:boolean;
    [key: string]:any;
}
export interface BaseFilter {
    init:(params:any)=>void;
    getGui:()=>HTMLElement|Node|string;
    isFilterActive:()=>boolean;
    doesFilterPass:(item:any)=>boolean;
    destroy:()=>void;
    searchText:string;
    searchCategory:string;
}
 