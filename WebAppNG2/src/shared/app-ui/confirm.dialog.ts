import {Component, OnChanges, OnDestroy, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {juForm, FormOptions, FormElement} from '../juForm/juForm';
@Component({
    moduleId: module.id,
    selector: 'confirm, [confirm], .confirm',
    template: '<div juForm (onLoad)="fromLoad($event)" (onModalClose)="dialogClose($event)" [options]="formOptions"></div>'
})
export class ConfirmDialog implements OnInit, OnChanges
{
    private form: juForm;    
    @Output() onLoad = new EventEmitter();
    constructor() { }
    private formOptions: FormOptions;
    public ngOnInit() { this.constructForm(); }
    public ngOnChanges(changes)
    {

    }
    private constructForm()
    {
        this.formOptions = {
            title: 'Health Care Regulatory System', viewMode: 'popup', message: '',
            body: '',
            inputs: [                 
                { type: 'html', content: '<div [innerHTML]="config.message"></div>' }
            ],
            buttons: {
                'YES': { type: 'button', cssClass: 'btn btn-primary', click: () => { this.form.showModal(false); this.yesCallback(); } },
                'NO': { type: 'button', cssClass: 'btn btn-primary', click: () => { this.form.showModal(false);this.noCallback(); } }
            }
        };
    }
    private fromLoad(form: juForm)
    {
        this.form = form;
        this.onLoad.emit(this);
    }
    private dialogClose(){
        if(this.noCallback) this.noCallback();
    }
    private yesCallback = () => { };
    private noCallback = () => { }
    public showDialog(title: string, message: string, yesCallback?, noCallback?)
    {
        if (title)
            this.formOptions['title'] = title;
        this.formOptions['message'] = message;
        if (yesCallback)
            this.yesCallback = yesCallback;
        if (noCallback)
            this.noCallback = noCallback;
        this.form.showModal();
    }
     public showDialogPromise(title: string, message: string):Promise<Number>
    {
        if (title)
            this.formOptions['title'] = title;
        this.formOptions['message'] = message;
        this.form.showModal();
        return new Promise((resolve, reject)=>{
      
            this.yesCallback = ()=>{resolve(1);};
       
            this.noCallback = ()=>{resolve(0);};
        });
       
    }
}