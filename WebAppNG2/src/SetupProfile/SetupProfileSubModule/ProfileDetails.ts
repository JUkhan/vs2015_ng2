
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter}          from '@angular/core';
import { juForm, FormElement, FormOptions }    from '../../shared/juForm/juForm';
import { juGrid, GridOptions}                   from '../../shared/juGrid/juGrid';
import { Attachment}                   from '../../shared/app-ui/attachment';

@Component({
    moduleId:module.id,
    selector:'profile-details',
    template:`
       <div juForm (onLoad)="loadForm($event)" [options]="options"></div>
       <div attachment (onLoad)="loadAttachment($event)" ></div>
    `
})
export class ProfileDetails implements OnInit, OnDestroy {
        
    public options: FormOptions;
    public calMethodGO:GridOptions;
    public dataSourceGO:GridOptions;
    public profileGO:GridOptions;
    public form: juForm;
    public attachment:Attachment;
    status: string = 'none';
    @Output() onLoad=new EventEmitter();
    constructor( ){

        
        this.initForm();
    }   
    public ngOnInit() {
        
    }
    public ngOnDestroy() {

    }
    protected initForm() {
        this.options = {
            viewMode: 'form', labelPos:'left',
            trade:false, refreshBy:{pd:{}},
            calMethodGO:this.GetCalMethodGO(),
            dataSourceGO:this.GetDataSourceGO(),
            profileGO: this.GetProfileGO(),
            inputs: [
                {
                    type: 'groupLayout', items: [
                        {groupName: 'Profile Details', size:8,  labelSize: 4,  inputs: [
                               [{field:'pd.name', label:'Profile Name', size:4, type:'text'},
                               {type:'checkbox', labelPos:'left', size:4, exp:'[(ngModel)]="model.pd.preliminaryProfile"', label:'Preliminary Profile'},
                               {type:'checkbox', labelPos:'left', size:4, exp:'[(ngModel)]="model.pd.historicalMatrix"', label:'Copy form Historial Matrix'}],
                                [{field:'pd.processType', label:'Processing Type', size:4, type:'text'},{field:'pd.cutoffDate', label:'Sales Cutoff Date', size:4, type:'datepicker'}],
                                [{field:'pd.timePeriod', label:'Time Period', size:4, type:'text'},{field:'pd.startDate', label:'Start Date', size:4, type:'datepicker'},
                               {field:'pd.endDate', label:'End Date', size:4, type:'datepicker'}]
                            ]
                        },
                        [
                            {groupName: 'Profile Pricing Calcs & Methods', size:6,    inputs: [
                               {type:'html', content:`<div class="juGrid" [options]="config.calMethodGO"></div>`}
                                ]
                            },
                            {groupName: 'Profile Data Source', size:6,   inputs: [
                                {type:'html', content:`
                                <div class="row">
                                    <div class="col-md-8">
                                        <div class="juGrid" [options]="config.dataSourceGO"></div>
                                    </div>
                                    <div class="col-md-4">
                                        <button type="button" class="btn btn-primary">Include</button>
                                        <button type="button" class="btn btn-primary">Exclude</button>
                                    </div>
                                </div>`}
                                ]
                            }
                        ],
                        {groupName: 'Profile List', size:12,   inputs: [
                               {type:'html', content:`
                                <div class="row">
                                    <div class="col-md-10">
                                        <div class="juGrid" [options]="config.profileGO"></div>
                                    </div>
                                    <div class="col-md-1">                                       
                                            <button type="button" class="btn btn-large btn-block btn-primary">Create Profile</button>
                                            <button type="button" class="btn btn-large btn-block btn-primary">Delete Profile</button>
                                            <div>&nbsp;</div>
                                            <button type="button" class="btn btn-large btn-block btn-primary">Refresh</button>
                                            <button type="button" class="btn btn-large btn-block btn-primary" (click)="config.showAttachment()">Attachments</button>                                        
                                    </div>
                               </div>
                               `}
                            ]
                        },
                    ]
                }
            ],
            buttons:{'Save':{type:'button', click:()=>{console.log('Save Successfully');}}},
            showAttachment:()=>{
                this.attachment.show();
            }
        };
    }
    protected loadForm(form: juForm) {
        this.form = form; 
        this.onLoad.emit(this);      
    }
    protected GetCalMethodGO(){
        return this.calMethodGO={
            viewMode:'!panel', noPager:true,
            columnDefs:[{headerName:'Calc', field:'calc', width:120},{headerName:'Calc Method', field:'calcMethod', width:320}]
        };
    }
    protected GetDataSourceGO(){
        return this.dataSourceGO={
            viewMode:'!panel', noPager:true,
            columnDefs:[{headerName:'Company Name', field:'calc', width:220},{headerName:'Include', field:'include', width:120}]
        };
    }
    protected GetProfileGO(){
        return this.profileGO={
            viewMode:'!panel', pagerPos:'header',
            columnDefs:[
                {headerName:'Name', field:'calc', width:220, filter:'text'},
                {headerName:'Status', field:'status', width:120},
                {headerName:'Time Period', field:'calc', width:120, filter:'text'},
                {headerName:'Start Date', field:'status', width:120},
                {headerName:'End Date', field:'calc', width:120},
                {headerName:'Processing Type', field:'status', width:150, filter:'set'},
                {headerName:'Prelim?', field:'calc', width:120},
                {headerName:'Modified Date', field:'status', width:120},
                {headerName:'Last Modified By', field:'calc', width:120},
                {headerName:'Profile Id', field:'status', width:120, filter:'number'},
                {headerName:'Attachments?', field:'calc', width:120}
                ]
        };
    }

    protected loadAttachment(attachment:Attachment){
        this.attachment=attachment;
    }

}