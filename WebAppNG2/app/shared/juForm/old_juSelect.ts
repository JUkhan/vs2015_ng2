import {Component,
    OnChanges,
    ElementRef,
    forwardRef,
    OnInit, Inject,
    ViewEncapsulation,
    Input, Output,
    EventEmitter,
    trigger,
    state,
    style,
    transition,
    animate,
    ChangeDetectionStrategy}   from "@angular/core";
import { UiService }           from '../ui.service';
import {Subject}               from 'rxjs/Rx';
declare var jQuery: any;

@Component({
    moduleId: module.id,
    selector: 'juSelect',
    //templateUrl: './juSelect.html',
    //styleUrls: ['./juSelect.css'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
    animations: [
        trigger('slide', [
            state('up', style({ opacity: 0, height: 0 })),
            state('down', style({ opacity: 1, height: '*' })),
            transition('up => down', [style({ height: 1 }), animate('300ms ease-in')]),
            transition('down => up', animate('200ms ease-out'))
        ])
    ],
    template:`<div style="position:relative">
    <div class="ju-select form-control" (click)="toggleOPtions($event)"><span style="display:block;position:relative;top:3px">{{selectedText}}</span><b style="right:5px;position:absolute;top:10px;color:#555;font-size:9px">&#9660;</b></div>
    <div  class="options" [class.empty-options]="!searchData || searchData.length==0">
        <div  class="action" *ngIf="!checkCssClass()">
            <div>
                <label [hidden]="!(viewMode==='checkbox')"> <input [checked]="isAllSelected" (click)="checkAll($event.target.checked)" type="checkbox"  title="check all"> Select All</label>
                <input *ngIf="!hideSearch" type="text" (keyup)="search($event.target.value)" placeholder="search item">
                <span *ngIf="viewMode==='select'" (click)="checkAll(false)" title="Unselect the item" class="unselect">&#10006;</span>
            </div>
        </div>
        <div class="items" >
            <div class="option-host" (click)="selectOption(item)" *ngFor="let item of searchData">
                <div class="ju-option" [class.selected]="item.selected">
                    <div class="header" *ngIf="(viewMode==='select')"><span class="title" [innerHtml]="item.name"></span><span class="sub-title" *ngIf="item.subtitle" [innerHtml]="item.subtitle"></span></div>
                    <div class="header" *ngIf="(viewMode==='radio')"><input type="radio" name="xp0000" [checked]="item.selected"><span class="title" style="padding-left:5px"
                            [innerHtml]="item.name"></span><span class="sub-title" *ngIf="item.subtitle" [innerHtml]="item.subtitle"></span></div>
                    <div class="header" *ngIf="(viewMode==='checkbox')"><input type="checkbox" [checked]="item.selected"><span class="title" style="padding-left:5px" [innerHtml]="item.name"></span>
                        <span class="sub-title" *ngIf="item.subtitle" [innerHtml]="item.subtitle"></span>
                    </div>
                    <div *ngIf="item.description" class="description" [innerHtml]="item.description"></div>
                </div>
            </div>
        </div>
    </div>
</div>`
})
export class juSelect_old implements OnInit, OnChanges {
    @Input('view-mode') viewMode: string = 'select';
    @Input() api: any = {};
    @Input() method: any;
    @Input() model: any;
    @Input('property-name') propertyName: any;
    @Input('hide-search') hideSearch: boolean = false;
    @Input() disabled: boolean = false;
    @Input() config: any = {};
    @Input('myForm') myForm: any;
    @Input() index:number;
    notifyRowEditor = new Subject();
    valueChanges: Subject<any>;

    @Output('option-change') onChange = new EventEmitter();
    spliter: string = '$#$';
    searchForm: any;
    searchData: any;
    visible: boolean = false;
    selectedText: string;
    isAllSelected: boolean = false;
    _dataSrc: any;
    private slideState: string = 'up';
    optionsDom: any;
    domClickSubscription: any;
    constructor(private el: ElementRef, private uiService: UiService) {
        this.valueChanges = new Subject();        
    }
    ngOnChanges(changes) {

    }
    private _previousValue: any;
    _value: any;
    @Input()
    set value(val: any) {
            this._previousValue = this._value;       
            this._value = val;
            if (val) {
                if (Array.isArray(val)) {
                    this.selectItems(val.join(this.spliter));
                } else {
                    this.viewMode === 'checkbox' ? this.selectItems(val) : this.selectItem(val);
                }
            }        
    }
    get value() {
        return this._value;
    }
    @Input('data-src')
    set dataSrc(val: Array<any>) {
        if (!val) { return; }
        let temp = val.map(item => Object.assign({}, item, { selected: false }));
        this.searchData = temp;
        this._dataSrc = temp;

        let _val = this._getValueByPropertyName();
        if (this.config.isFilter) {
            if (_val) {
                async_call(() => { this.value = _val; });
            } else if (val && val.length > 0) {
                this._setValueByPropertyName(val[0].value);
                async_call(() => { this.value = _val; });
            }
        } else {
            if (_val) {
                async_call(() => { this.value = _val; });
            }
        }
    }
    get dataSrc() {
        return this._dataSrc || [];
    }
    _getValueByPropertyName() {
        let props: Array<string> = this.propertyName.split('.');
        if (props.length > 1) {
            let obj = this.model;
            props.forEach(prop => obj = obj[prop]);
            return obj;
        }

        return this.model[this.propertyName];
    }
    _setValueByPropertyName(val: any) {
        let props: Array<string> = this.propertyName.split('.');
        if (props.length > 1) {
            let obj = this.model;
            let len = props.length - 1;
            for (var index = 0; index < len; index++) {
                obj = obj[props[index]];
            }
            obj[props[index]] = val;
        }
        else { this.model[this.propertyName] = val; }
    }
    checkCssClass() {
        return this.viewMode === 'checkbox' ? false : this.hideSearch;
    }
    ngOnInit() {
        this.config.api = this;
        this.viewMode = this.viewMode.toLocaleLowerCase();
        if (this.viewMode === 'select' || this.viewMode === 'radio') {
            this.selectedText = 'Select option';
        }
        else {
            this.selectedText = 'Select options';
        }
        this.api.api = this;

        let selectDiv = this.el.nativeElement.querySelector('.ju-select'),
            optionsDiv = this.el.nativeElement.querySelector('.options');
       
        this.domClickSubscription = this.uiService.documentClick.subscribe((event: any) => {
            /*var target = event.target;
            if (this.uiService.hasParent(target, selectDiv)) {
                this.eventState.visible = this.visible;
                this.eventState.isHeader = true;
            } else { this.eventState.isHeader = false; }
            if (this.visible && !(this.uiService.hasParent(target, optionsDiv))) {
                this.visible = false; this.focusToValidate = true;
            }*/
            var target = event.target;
            if (jQuery(target).parents('.ju-select').length) {
                this.eventState.visible = this.visible;
                this.eventState.isHeader = true;
            } else { this.eventState.isHeader = false; }
            if (this.visible && !(jQuery(target).parents('.options').length)) {
                this.visible = false; this.focusToValidate = true;
            }
            this.animate();
        });
        this.optionsDom = jQuery(this.el.nativeElement).find('.options');
        this.optionsDom.hide();
    }
    eventState: any = { visible: false, isHeader: false };
    focusToValidate: boolean = false;
    toggleOPtions(event: any) {
        event.preventDefault();
        if (this.eventState.isHeader) {
            this.visible = this.eventState.visible;
        }
        if (this.disabled) {
            this.visible = false;
        } else {
            this.visible = !this.visible;
        }
        if (this.config)
            this.config.hideMsg = false;
        this.animate();
    }
    
    animate() {
        //this.slideState = this.visible ? 'down' : 'up';
        this.visible ? this.optionsDom.slideDown() : this.optionsDom.slideUp();
    }
    ngOnDestroy() {
        if (!this.config.isFilter) {
            this.domClickSubscription.unsubscribe();
        }
    }

    removeOption(option: any) {
        this.dataSrc.splice(this.dataSrc.indexOf(option), 1);
    }
    selectOption(option: any) {
        if (this.viewMode === 'select' || this.viewMode === 'radio') {
            this.dataSrc.forEach(op => op.selected = (op === option));
            async_call(() => { this.visible = !this.visible; this.animate(); }, 100);
            this.selectedText = option.name;
        }
        else if (this.viewMode === 'checkbox') {
            option.selected = !option.selected;
            var selectedOptions = this.dataSrc.filter(v => v.selected === true);
            if (selectedOptions) {
                this.isAllSelected = selectedOptions.length === this.dataSrc.length;
                if (this.isAllSelected) {
                    this.selectedText = 'All items selected(' + this.dataSrc.length + ')';
                }
                else {
                    if (selectedOptions.length == 0) this.selectedText = 'Select options';
                    else this.selectedText = selectedOptions.length + (selectedOptions.length > 1 ? ' items' : ' item') + ' selected';
                }
            }
        }
        this._setModelValue();
        this.notifyRowEditor.next({});
    }
    search(val: string) {
        if (val) { val = val.toLowerCase(); }
        var temp: any[] = [];
        this.dataSrc.forEach((item: any) => {
            if ((item.name && item.name.toLowerCase().indexOf(val) >= 0) || (item.description && item.description.toLowerCase().indexOf(val) >= 0)) {
                temp.push(item);
            }
        });
        this.searchData = temp;
    }
    selectItem(value_or_name: any) {        
        if (!value_or_name) return;
        this.checkAll(false, false);
        let valueSelected = false;
        if (this.searchData) {
            this.searchData.forEach((v: any) => {
                if (v.value.toString() === value_or_name.toString() || v.name === value_or_name) {
                    this.selectedText = v.name;
                    let option = this.dataSrc.find((x: any) => x.value.toString() === v.value.toString());                   
                    if (option) {
                        option.selected = true; 
                        valueSelected = true;
                        
                    }
                }
            });
        }
        if (valueSelected) {
            this._setValueByPropertyName(this.value);
            if (this._value !== this._previousValue) {
                this.onChange.next({ value: this.value, sender: this, form: this.myForm, index: this.index });
                this.valueChanges.next({ value: this.value, sender: this, form: this.myForm, index: this.index });
            }
        }
    }
    selectItems(values_or_names: any) {        
        if (!values_or_names) return;
        this.checkAll(false, false);
        var spliter = this.spliter, len = 0;
        if (Array.isArray(values_or_names)) {
            len = values_or_names.length;
            values_or_names = values_or_names.join(spliter);
        } else {
            len = values_or_names.toString().split(spliter).length;
        }
        this.selectedText = len + (len > 1 ? ' items' : ' item') + ' selected';
        if (len <= 0) return;
        values_or_names = spliter + values_or_names + spliter;
        let valueSelected = false;
        if (this.searchData) {
            this.searchData.forEach((v: any) => {
                if (values_or_names.indexOf(spliter + v.value + spliter) >= 0 || values_or_names.indexOf(spliter + v.name + spliter) >= 0) {
                    let option = this.dataSrc.find(x => x.value === v.value);
                    if (option) {
                        option.selected = true;
                        valueSelected = true;
                    }
                }
            });
        }
        if (valueSelected) {
            this._setValueByPropertyName(this.value);            
            if (this._value !== this._previousValue) {
                this.onChange.next({ value: this.value, sender: this, form: this.myForm, index: this.index });
                this.valueChanges.next({ value: this.value, sender: this, form: this.myForm, index: this.index });
            }
        }
    }
    getNames(): any {
        var res: any[] = [];
        if (!this.dataSrc) return '';
        if (this.dataSrc)
            this.dataSrc.forEach((v: any) => {
                if (v.selected) {
                    res.push(v.name);
                }
            });
        if (Array.isArray(this._getValueByPropertyName()))
            return res;
        return res.join(this.spliter);
    }
    getValues(): any {
        var res: any[] = [];
        if (!this.dataSrc) return '';
        if (this.dataSrc)
            this.dataSrc.forEach((v: any) => {
                if (v.selected) {
                    res.push(v.value);
                }
            });
        if (Array.isArray(this._getValueByPropertyName()))
            return res;
        return res.join(this.spliter);
    }
    getSelectedItems() {
        var res: any[] = [];
        if (!this.dataSrc) return res;
        if (this.dataSrc)
            this.dataSrc.forEach((v: any) => {
                if (v.selected) {
                    res.push(v);
                }
            });
        return res;
    }
    checkAll(isChecked: boolean, isModelUpdate: boolean = true) {
        this.dataSrc.forEach(v => v.selected = isChecked);
        this.isAllSelected = isChecked;
        if (isChecked) {
            if (this.dataSrc.length === this.searchData.length) {
                this.selectedText = 'All items selected(' + this.dataSrc.length + ')';
            }
            else {
                this.selectedText = this.searchData.length + (this.searchData.length > 1 ? ' items' : ' item') + ' selected';
            }
        } else {
            this.selectedText = this.viewMode === 'checkbox' ? 'Select options' : 'Select option';
        }
        if (isModelUpdate) {
            this._setModelValue();
        }

    }
    setDtaSrc(data: any[]) {
        this.dataSrc = data;
        this.searchData = data;
    }
    _setModelValue() {
        if (this.model && this.propertyName && this.method) {
            this._setValueByPropertyName(this.method === 'getValues' ? this.getValues() : this.getNames());
            this.onChange.next({ value: this._getValueByPropertyName(), sender: this, form: this.myForm , index:this.index});
            this.valueChanges.next({ value: this._getValueByPropertyName(), sender: this, form: this.myForm , index:this.index});

        }
    }
    hasError() {
        let vals = this.getValues(), res;
        if (Array.isArray(vals)) {
            vals = vals.join(this.spliter);
        }
        if (this.myForm.dynamicComponent)
        {           
            this.myForm.dynamicComponent.instance
                .vlidate_input(vals, this.config, !this.focusToValidate);
        } else
        {            
            this.myForm.componentRef.instance.vlidate_input(vals, this.config, !this.focusToValidate);
        }
        return !this.config.hideMsg;
    }

}
function async_call(fx: Function, time = 0) {
    let tid = setTimeout(() => {
        fx();
        clearTimeout(tid);
    }, time);
}

