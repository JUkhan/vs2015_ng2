
import {Component, Input, OnInit, ChangeDetectorRef, EventEmitter, Output, ChangeDetectionStrategy, ViewEncapsulation} from '@angular/core';

@Component({
    moduleId: module.id,
    template: `<div class="juRow" [class.selected]="selected" (click)="rowSelect()">                   
                   <div class="juCol" cell-com *ngFor="let item of options.columns" [options]="item" [value]="row[item.field]"></div>
               </div>`,
    selector: 'grid-row',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class RowsComponent implements OnInit
{
    @Input() options: any = {};
    @Input() row: any = {};
    @Output() onSelect = new EventEmitter();   
    selected: boolean = false;
    constructor(private _cd: ChangeDetectorRef) { }
    ngOnInit()
    {

    }
    rowSelect()
    {         
        this.onSelect.emit(this);
    }
    setRowSelection(isSelect: boolean)
    {
        this.selected = isSelect;
        this._cd.markForCheck(); 
    }    
    toggleRowSelect()
    {
        this.selected = !this.selected;
        this._cd.markForCheck(); 
    }
}