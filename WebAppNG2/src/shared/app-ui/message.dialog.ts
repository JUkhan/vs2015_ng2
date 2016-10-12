import {Component, OnChanges, OnDestroy, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {juForm, FormOptions, FormElement} from '../juForm/juForm';
@Component({
    moduleId: module.id,
    selector: 'message, [message], .message',
    template: '<div juForm (onLoad)="fromLoad($event)" [options]="formOptions"></div>'
})
export class MessageDialog implements OnInit, OnChanges
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
            inputs: [
                { type: 'html', content: '<div [innerHTML]="config.message"></div>' }
            ],
            buttons: {
                'Ok': { type: 'close', cssClass: 'btn btn-primary' }
            }
        };
    }

    private fromLoad(form: juForm)
    {
        this.form = form;
        this.onLoad.emit(this);
    }

    public showDialog(title: string, message: string)
    {
        if (title)
            this.formOptions['title'] = title;
        this.formOptions['message'] = message;
        this.form.showModal();
    }
}