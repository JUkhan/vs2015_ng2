
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { juForm, FormElement, FormOptions } from '../../shared/juForm/juForm';
import { juGrid, GridOptions } from '../../shared/juGrid/juGrid';
import { Attachment } from '../../shared/app-ui/attachment';
import {Subscription} from 'rxjs/Subscription';

@Component({
    moduleId: module.id,
    selector: 'data-switcher',
    template: `
      <table><tr>
        <td valign="top">
          <div [style.width.px]="width" style="display:inline-block">
                <div><b>{{leftTitle}}</b></div>
                <div class="juGrid" (onLoad)="loadLeftGrid($event)" [options]="leftGO" [data]="leftData"></div>
                <div> <b>Selected Rows: {{leftSelected.length}}</b> <b style="padding-left:20px">Total Rows: {{leftData.length}}</b></div>
            </div>
        </td>
        <td style="width:150px" valign="center">
            <div style="padding:0 30px">
                <button (click)="btnMove()" [disabled]="!leftSelected.length" type="button" class="btn btn-large btn-block btn-primary">Move <span class="glyphicon glyphicon-chevron-right"></span></button>
                <button (click)="btnRemove()" [disabled]="!rightSelected.length" type="button" class="btn btn-large btn-block btn-primary"><span class="glyphicon glyphicon-chevron-left"></span> Remove</button>
            </div>
        </td>
        <td valign="top">
             <div [style.width.px]="width" style="display:inline-block">
                <div><b>{{rightTitle}}</b></div>
                <div class="juGrid" (onLoad)="loadRightGrid($event)" [options]="rightGO" [data]="rightData"></div>
                 <div> <b>Selected Rows: {{rightSelected.length}}</b> <b style="padding-left:20px">Total Rows: {{rightData.length}}</b></div>
             </div>
        </td>
      </tr></table>
    `
})
export class DataSwitcher implements OnInit, OnDestroy {

    subsList:Subscription[]=[];
    leftGO: GridOptions;
    rightGO: GridOptions;
    @Input() width: number = 500;

    @Input() leftColumns: any[];
    @Input() rightColumns: any[];

    @Input() leftTitle: string = 'Left Title';
    @Input() rightTitle: string = 'Right Title';

    @Output() onLoad = new EventEmitter();
    @Output() onMove = new EventEmitter();
    @Output() onRemove = new EventEmitter();

    leftData: any[] = [];
    rightData: any[] = [];

    leftSelected: any[] = [];
    rightSelected: any[] = [];

    leftGrid: juGrid;
    rightGrid: juGrid;

    constructor() {
    }
    public ngOnInit() {
        this.leftGO = {
            viewMode: '!panel',
            noPager: true,
            pageSize: 10000,
            classNames: 'table table-bordered',
            columnDefs: this.leftColumns,
            rowEvents: '(click)="config.rowClick(row,i, $event.ctrlKey)"',
            trClass: row => {
                return { selected: row.selected };
            },
            rowClick: (row: any, index: number, ctrlKey: boolean) => {
                if (ctrlKey) {
                    row.selected = !row.selected;
                } else {
                    this.leftSelected.forEach(_ => _.selected = _ === row);
                    row.selected = !row.selected;
                    this.leftSelected = [];
                }
                row.selected ? this.leftSelected.push(row) : this.leftSelected.splice(this.leftSelected.indexOf(row), 1)
            }
        };
        this.rightGO = {
            viewMode: '!panel',
            noPager: true,
            pageSize: 10000,
            classNames: 'table table-bordered',
            columnDefs: this.rightColumns,
            rowEvents: '(click)="config.rowClick(row,i, $event.ctrlKey)"',
            trClass: row => {
                return { selected: row.selected };
            },
            rowClick: (row: any, index: number, ctrlKey: boolean) =>
            {
                if (ctrlKey) {
                    row.selected = !row.selected;
                } else {
                    this.rightSelected.forEach(_ => _.selected = _ === row);
                    row.selected = !row.selected;
                    this.rightSelected = [];
                }
                row.selected ? this.rightSelected.push(row) : this.rightSelected.splice(this.rightSelected.indexOf(row), 1)
            }
        };
    }

    public ngOnDestroy() {
        this.subsList.forEach(_=>_.unsubscribe());
        console.log('Destroyed DataSwitcher');
    }
    protected loadLeftGrid(grid: juGrid) {
        this.leftGrid = grid;       
    }
    protected loadRightGrid(grid: juGrid) {
        this.rightGrid = grid;        
        this.onLoad.emit(this);
    }
    protected btnMove() {
        const sr = this.leftSelected.map(_ => Object.assign({}, _, { selected: false }));
        this.rightData = [...sr, ...this.rightData];        
        this.leftData = this.leftData.filter(_ => !_.selected);
        this.onMove.emit(sr);
        this.leftSelected = [];

    }
    protected btnRemove() {
        const sr = this.rightSelected.map(_ => Object.assign({}, _, { selected: false }));
        this.leftData = [...sr, ...this.leftData];
        this.rightData = this.rightData.filter(_ => !_.selected);
        this.onRemove.emit(sr);
        this.rightSelected = [];
    }
}