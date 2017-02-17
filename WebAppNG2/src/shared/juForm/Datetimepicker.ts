import {Directive, OnInit, Input, ElementRef, OnDestroy, AfterViewInit} from '@angular/core';
import {Subject, Observable, Subscription} from 'rxjs/Rx';
declare var jQuery: any;
//declare var CKEDITOR:any;

@Directive({
    selector: '[pickers]'
})

export class Datetimepicker implements OnInit, OnDestroy {
    @Input() pickers: any = {};
    @Input('picker-name') pickerName: string = '';
    @Input() model: any = {};
    @Input() property: string;
    @Input() config: any;
    @Input() form: any;
    notifyRowEditor: Subject<any> = new Subject();
    inputSubscription:Subscription;
    private pickerObject: any;
    constructor(private el: ElementRef) { }
    ngOnInit() {
        switch (this.pickerName) {            
            case 'datepicker':
            case 'datetimepicker':
                this.inputSubscription = Observable.fromEvent(jQuery('input', this.el.nativeElement), 'keyup')
                    .debounceTime(500)
                    .distinctUntilChanged()
                    .pluck('target', 'value')
                    .subscribe(_ => this.setDate(_)); 
                if (!this.pickers) this.pickers = {};
                this.pickerObject = jQuery(this.el.nativeElement)
                    .datetimepicker(this.pickers)
                    .on('changeDate',  (ev)=>
                    {                       
                        this.changeDate(jQuery('input', ev.target).val());
                        
                    })
                    .on('show', ev =>
                    {
                        if (jQuery('input', this.el.nativeElement)[0].disabled)
                        {
                            this.pickerObject.datetimepicker('hide');
                        }                        
                        if (typeof this.config.dpShow === 'function')
                        {
                            this.config.dpShow(this.model);
                        }
                       
                    })
                    .on('hide', ev =>
                    {
                        if (typeof this.config.dpHide === 'function')
                        {
                            this.config.dpHide(this.model);
                        }                         
                        this.changeDate(jQuery('input', ev.target).val());                      
                    })
                    .on('outOfRange', ev =>
                    {
                        if (typeof this.config.dpOutOfRange === 'function')
                        {
                            this.config.dpOutOfRange(this.model);
                        }  
                    });
                break;
            case 'colorpicker':
                jQuery(this.el.nativeElement).colorpicker(this.pickers);
                break;
        }
        this.config.api = this;
    }
    changeDate(val)
    {
        if (this.property.indexOf('.') !== -1)
        {
            let arr = this.property.split('.'), len = arr.length - 1, obj = this.model;
            for (var i = 0; i < len; i++)
            {
                obj = obj[arr[i]];
            }
            obj[arr[i]] = val;
        } else
        {
            this.model[this.property] = val;
        }
        if (this.form)
        {
            this.form.componentRef.instance
                .vlidate_input(val, this.config);
        }
        if (this.config.change)
        {
            this.config.change(this.model);
        }
        this.notifyRowEditor.next(val); 
    }
    setDate(date: any)
    {  
        this.notifyRowEditor.next(date);
    }
    ngOnDestroy() {
        
        if (this.pickerObject)
        {           
            this.pickerObject.datetimepicker('remove');
        } 
        if (this.inputSubscription)
        {
            this.inputSubscription.unsubscribe();
        }
       
    }
}

