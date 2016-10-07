import {Component, OnChanges, OnDestroy, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {juForm, FormOptions, FormElement} from '../juForm/juForm';
import {SelectOptions} from '../juForm/juSelect';
import {FV} from '../juForm/FV';
@Component({
    moduleId: module.id,
    selector: 'mail, [mail], .mail',
    template:'<div juForm (onLoad)="fromLoad($event)" [options]="formOptions"></div>'
})
export class MailComponent implements OnInit, OnChanges
{
    private formOptions: FormOptions;
    private form: juForm;
    @Input() title: string = 'Health Care Regulatory System';
   

    @Output() onSend = new EventEmitter();
    @Output() onLoad = new EventEmitter();
    constructor() { }
    public ngOnInit() { this.constructForm(); }
    public ngOnChanges(changes)
    {
        
    }
    private fromLoad(form: juForm)
    {
        this.form = form;
        this.onLoad.emit(this);       
    }
    private constructForm()
    {
        this.formOptions = {
            title: this.title, viewMode: 'popup', labelPos: 'left', labelSize: 4,
            body:'',
            inputs: [
                { field: 'to', label: 'To', type: 'juSelect', validators: [FV.required, FV.email()], options: <SelectOptions>{ editable: true, width: '100%' } },
                { field: 'subject', label: 'Subject', type: 'text', validators: FV.required },
                { field: 'attachment', label: 'Attachment Name', type: 'text' },
                {type:'html', content:'<div><textarea [(ngModel)]="config.body" rows=10 style="width:100%"></textarea></div>'}
            ],
            buttons: {
                'Send': {
                    type: 'submit', click: () =>
                    {
                        this.onSend.emit(this.getModel());
                        this.hide();
                    }
                },
                'Cancel': {type:'close'}
            }
        };
    }
    public show()
    {
        this.form.showModal();        
    }
    public hide()
    {
        this.form.showModal(false);
        this.form.refresh();
        this.formOptions['body'] = '';
    }
    public getModel()
    {
        let model = this.form.getModel();
        model.body = this.formOptions['body'];
        return model;
    }
    public setAttachment(attachment: string)
    {
        this.form.getModel().attachment = attachment;
    }
    public setMailList(data: any[])
    {
        this.form.setData('to',data);
    }
}