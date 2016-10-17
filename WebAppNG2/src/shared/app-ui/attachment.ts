﻿import { Component, OnInit, Input , OnChanges} from '@angular/core'

import {juForm, FormElement, FormOptions} from '../juForm/juForm';
import {FV} from '../juForm/FV';

import {juGrid, GridOptions}       from '../juGrid/juGrid';



@Component({
    moduleId: module.id,
    selector: 'attachment, [attachment], .attachment',
    template: '<div juForm (onLoad)="formLoad($event)" [options]="attachOptions"></div>'
})

export class Attachment implements OnInit, OnChanges {
    private attachOptions: FormOptions;
    private gridOptions: GridOptions;   
    @Input() title: string = 'Group Attachments';
    @Input() data: any[] =[];
    constructor() { } 

    public ngOnInit() {
        this.initForm();
    } 

    private formLoad(form: juForm) {
        
    } 
    public ngOnChanges()
    {
        if (this.data && this.attachOptions)
        { 
            //this.attachOptions['data'] = this.data;
        }
    }
    private initForm() {
        this.attachOptions = {
            title: this.title, width: 1000, 
            gridOptions: this.getGridOption(),
            viewMode: 'popup', data: this.data,
            inputs: [
                <FormElement>{
                    type: 'html', content: `<div style="text-align:right;padding-right:20px"><label><input type="checkbox">Show Deleted</label></div>
                        <div juGrid [options]="config.gridOptions" [data]="config.data"></div>
                        <div class="modal-footer" style="margin-top:10px">
                            <div style="text-align:left;display:inline-block;width:90%">
                                <button type="button" class="btn btn-primary">Add</button>
                                <button type="button" class="btn btn-primary">Cancel</button> 
                                <button type="button" class="btn btn-primary">Save</button>
                                <button type="button" class="btn btn-primary">View</button>
                                <button type="button" class="btn btn-primary">Delete</button>
                            </div>
                            <button type="button" data-dismiss="modal" class="btn btn-default">Cancel</button>
                        </div>
                    ` }
            ]

        } 
    }

    private getGridOption() {
        return this.gridOptions = {
            enableCellEditing: true, viewMode: '!panel', colResize: !true, noPager: true, pageSize:1000,
            quickSearch: false, rowHeight:50,
            columnDefs: [
                { headerName: 'Attachment Name', field: 'name',width:220  },
                { headerName: 'Attachment Description', field: 'description', type: 'text', width: 220 },
                { headerName: 'Status', field: 'status' },
                { headerName: 'Created Date', field: 'createdDate' },
                { headerName: 'Modified Date', field: 'modifiedDate' },
                { headerName: 'Modified By', field: 'ModifiedBy' }
            ]
        };
    }

    public show() {
        this.attachOptions.api.showModal();
    }
}

