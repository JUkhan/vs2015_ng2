
import {Component, Input, OnInit, ChangeDetectorRef, EventEmitter, Output, ChangeDetectionStrategy, ViewEncapsulation} from '@angular/core';

@Component({
    moduleId: module.id,
    template: `<div class="juRow" [class.even]="even" [class.selected]="selected" (click)="rowSelect()">                   
                   <div class="juCol" cell-com *ngFor="let item of options.columns" [options]="item" [index]="index" [row]="row" ></div>
               </div>`,
    selector: 'row-com',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class Row implements OnInit
{
    @Input() options: any = {};
    @Input() row: any = {};
    @Input() index: number = 0;
    @Input() even: boolean = false;
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