import {Component, Input, ChangeDetectionStrategy, ViewEncapsulation,
    QueryList, ViewChildren, AfterViewInit, OnDestroy
} from '@angular/core';

import {RowsComponent} from './RowsComponent';
import {Observable, Subscription} from 'rxjs/Rx';
@Component({
    moduleId: module.id,
    template: `<div class="juTable">
                    <div style="border:solid 1px #ddd;">
                        <my-grid-header [options]="options"></my-grid-header>
                        <template ngFor let-row [ngForOf]="data">
                            <grid-row [options]="options" [row]="row" (onSelect)="rowSelect($event)"></grid-row>
                        </template>
                    </div>
               </div>`,
    selector: 'my-grid',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./grid.css'],
    encapsulation: ViewEncapsulation.None
})
export class MyGrid implements AfterViewInit, OnDestroy
{
    @Input() options: any = {};
    @Input() data: any[];
    @ViewChildren(RowsComponent) _rows = new QueryList<RowsComponent>();
    protected ctrlKey: boolean = false;
    protected subscriptionList: Subscription[] = [];
    constructor() { }
    public ngAfterViewInit()
    {       
        //this._rows.changes.subscribe(res => console.log(res));
        if (this.options.multiselect)
        {
            this.handle_CTRL_key();
        }
    }
    public ngOnDestroy()
    {
        this.subscriptionList.forEach(_ => _.unsubscribe());
        console.log('Destroy Grid');
    }    
    protected rowSelect(row: RowsComponent)
    {     
        
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