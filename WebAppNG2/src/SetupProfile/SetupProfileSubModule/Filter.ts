

import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { juForm, FormElement, FormOptions } from '../../shared/juForm/juForm';
import { FV } from '../../shared/juForm/FV';

@Component({
    moduleId: module.id,
    selector:'filter',
    template: `<div juForm (onLoad)="loadForm($event)" [options]="options"></div>`
})
export class Filter implements OnInit, OnDestroy {
    protected options: FormOptions;
    protected form: juForm;

    @Output() findClick=new EventEmitter();
    @Output() onLoad=new EventEmitter();
    @Input() set trade(val){
        this.showClassTrade(val);
    }
    constructor() {
        this.initForm();
    }
    public ngOnInit() {
        
    }
    public ngOnDestroy() {

    }
    protected initForm() {
        this.options = {
            viewMode: 'form', labelPos:'left', 
            trade:false,
            inputs: [
                {
                    type: 'groupLayout', items: [
                        {groupName: 'Criteria', size:12,  labelSize: 4,  inputs: [
                                [{ field: 'dataSource', size:10, change: e => console.log(e), label: 'Data Source', type: 'juSelect', options:{width:'100%'} },
                                { type:'button', exp:'class="btn btn-primary"', label:'Find', size:2, click:this.find.bind(this)}],
                                [{ field: 'calculationType', change: e => console.log(e), label: 'Calculation Type', type: 'juSelect', size:10 , options:{width:'100%'}}],
                                [{ field: 'matrix', change: e => console.log(e), label: 'Matrix', type: 'juSelect', size:10, options:{width:'100%'}}],
                                [{ field: 'trade', exp:`[style.display]="config.trade?'block':'none'"`,  change: e => console.log(e), label: 'Class of Trade', type: 'juSelect', size:10, options:{width:'100%'} }]
                            ]
                        }
                    ]
                }
            ]
        };
    }
    protected loadForm(form: juForm) {
        this.form = form;
        this.onLoad.emit(this);
    }
    protected find(){
        this.findClick.emit(this.form.getModel());
    }
    public showClassTrade(flag:boolean){
        this.options['trade']=flag;
    }
    public setData(fieldName:string, data:any[]){
        this.form.setData(fieldName, data);
    }
     
}