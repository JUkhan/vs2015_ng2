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
    @Input() options: any = {};
    @Input() data: any[];
    @ViewChildren(Row) _rows = new QueryList<Row>();
    protected ctrlKey: boolean = false;
    protected subscriptionList: Subscription[] = [];
    protected width: number = 320;
    protected componentRef: ComponentRef<any>;
    @ViewChild('dynamicContentPlaceHolder', { read: ViewContainerRef }) 
    protected dynamicComponentTarget: ViewContainerRef;     
    constructor(protected typeBuilder: GridBuilder) { }
    public ngOnInit() {
        this.setWidth();
    }
    public render(): Promise<MyGrid>
    {
        return this.refreshContent();
    }
    protected refreshContent(): Promise<MyGrid>
    {
        if (this.componentRef)
        {
            this.componentRef.destroy();
        }
        return new Promise((resolve, reject) =>
        {

            this.typeBuilder
                .createComponentFactory(this.options)
                .then((factory: ComponentFactory<any>) =>
                {
                    this.componentRef = this
                        .dynamicComponentTarget
                        .createComponent(factory);

                    const component = this.componentRef.instance;
                    component.config = this.options;
                    
                    resolve(this);
                });
        });
    }  
    protected mxd() {
        alert('hello mamm');
    }
    public ngAfterViewInit()
    {  
        this.refreshContent();     
        //this._rows.changes.subscribe(res => console.log(res));
        if (this.options.multiSelect)
        {
            this.handle_CTRL_key();
        }       
    }
    public ngOnDestroy()
    {
        this.subscriptionList.forEach(_ => _.unsubscribe());
        if (this.componentRef)
        {
            this.componentRef.destroy();
            this.componentRef = null;
        }
        console.log('Destroy Grid');
    }
    protected setWidth() {
        let sum = 0;
        this.options.columns.forEach(_ => sum += _.width || 120);
        this.width = sum;
    }    
    protected rowSelect(row: Row)
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
    }
}

export interface Columns{
    header: string;
    field: string;
    align?: 'left' | 'center' | 'right';
    type?: 'text' | 'textarea' | 'checkbox' | 'select';
    style?: (val:any, row: any) => any;
    class?: (val: any,row: any) => any;
    text?: string;
    disabled?: (val: any, row: any) => boolean;
    title?: string;
    click?: (val: any, row: any) => void;
    change?: (event: { value: any, sender: any, index: number }) => void;
    selectOptions?: any;
    data?: any[];
    render?: (val: any, row: any) => any;
}
export interface GridOptions {
    rowSelect?: (row: any, isSelected: boolean) => void;
    multiSelect?: boolean; 
    singleSelect?: boolean;
    columns: Columns[]; 
}