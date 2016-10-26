import { Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit, ElementRef} from '@angular/core'

import {juForm, FormElement, FormOptions} from '../juForm/juForm';
import {Observable} from 'rxjs/Rx';
import {juGrid, GridOptions}       from '../juGrid/juGrid';
declare var jQuery: any;


@Component({
    moduleId: module.id,
    selector: 'attachment, [attachment], .attachment',
    template: '<div juForm (onLoad)="formLoad($event)" [options]="attachOptions"></div>'
})

export class Attachment implements OnInit, OnChanges
{
    private attachOptions: FormOptions = <FormOptions>{};
    private gridOptions: GridOptions;
    @Input() title: string = 'Group Attachments';
    @Input() data: any[] = [];
    @Output() saveFile = new EventEmitter();
    @Output() cancelFile = new EventEmitter();
    @Output() viewFile = new EventEmitter();
    @Output() deleteFile = new EventEmitter();
    //@Output() saveFile = new EventEmitter();
    constructor(private el: ElementRef) { }

    public ngOnInit()
    {
        this.initForm();
    }

    private formLoad(form: juForm)
    {        
        form.valueChanges('file').subscribe(res =>
        {
                let model = form.getModel();
                this.data.push({ name: model.file, file: model.FILES , saved:false});
                this.attachOptions['data'] = [...this.data];
        });
    }
    public ngOnChanges(changes: any)
    {
        if (changes.data && changes.data.currentValue !== changes.data.previousValue)
        {
            this.attachOptions['data'] = this.data;
        }
    }

    private initForm()
    {
        this.attachOptions = {
            title: this.title, width: 1000,
            gridOptions: this.getGridOption(),
            viewMode: 'popup', data: this.data,
            selectedRow: null,           
            inputs: [
                <FormElement>{ field: 'file', type: 'file', exp: 'style="display:none"' },
                <FormElement>{
                    type: 'html', content: `<div style="text-align:right;padding-right:20px"><label><input type="checkbox">Show Deleted</label></div>
                        <div juGrid [options]="config.gridOptions" [data]="config.data"></div>
                        <div class="modal-footer" style="margin-top:10px">
                            <div style="text-align:left;display:inline-block;width:90%">
                                <button type="button" (click)="config.addFile()" class="btn btn-primary">Add</button>
                                <button type="button" [disabled]="!config.selectedRow" class="btn btn-primary">Cancel</button> 
                                <button type="button" [disabled]="!(config.selectedRow && !config.selectedRow?.saved)" class="btn btn-primary">Save</button>
                                <button type="button" [disabled]="!(config.selectedRow && config.selectedRow?.saved)" class="btn btn-primary">View</button>
                                <button type="button" [disabled]="!(config.selectedRow && config.selectedRow?.saved)" class="btn btn-primary">Delete</button>
                            </div>
                            <button type="button" data-dismiss="modal" class="btn btn-default">Cancel</button>
                        </div>
                    ` }
            ],
            addFile: () =>
            {
                jQuery('input[type="file"]', this.el.nativeElement).click();
            },
            saveFile: () =>
            {
                this.saveFile.emit(this.selectedRow);
            },
            cancelFile: () =>
            {
                this.cancelFile.emit(this.selectedRow);
            },
            viewFile: () =>
            {
                this.viewFile.emit(this.selectedRow);
            },
            deleteFile: () =>
            {
                this.deleteFile.emit(this.selectedRow);
            }

        }
    }
    private selectedRow: any = null;
    private getGridOption()
    {
        return this.gridOptions = {
            enableCellEditing: true, viewMode: '!panel', colResize: !true, noPager: true, pageSize: 1000,
            quickSearch: false, rowHeight: 39, classNames: 'table table-bordered',
            rowEvents: '(click)="config.rowClick(row)"',
            trClass: row => ({ selected: row.selected }),
            columnDefs: [
                { headerName: 'Attachment Name', field: 'name', width: 220 },
                { headerName: 'Attachment Description', field: 'description', type: 'text', width: 220 },
                { headerName: 'Status', field: 'status' },
                { headerName: 'Created Date', field: 'createdDate' },
                { headerName: 'Modified Date', field: 'modifiedDate' },
                { headerName: 'Modified By', field: 'ModifiedBy' }
            ],
            rowClick: (row: any) =>
            {
                if (this.selectedRow) this.selectedRow.selected = false;
                row.selected = true;
                this.selectedRow = row;
                this.attachOptions['selectedRow'] = row;               
            }
        };
    }

    public show()
    {
        this.attachOptions.api.showModal();
    }
}

