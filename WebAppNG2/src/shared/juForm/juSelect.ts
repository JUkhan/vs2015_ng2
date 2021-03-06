﻿import {Component, Renderer, ViewChild, ElementRef, AfterViewInit,
    OnInit, OnDestroy, OnChanges,
    ViewEncapsulation, ChangeDetectionStrategy, SimpleChange,
    Input, Output, EventEmitter
} from '@angular/core'
import {Observable, Subject} from 'rxjs/Rx';
declare var jQuery: any;
@Component({
    moduleId: module.id,
    selector: 'juSelect, .juSelect, [juSelect]',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
    template: `
    <div #maincontent [class.open]="isEditable" [ngClass]="getDropdownStyle()" class="btn-group bootstrap-select" [style.width]="options.width" data-container="body">
        <button *ngIf="!options.editable" [disabled]="options.disabled" type="button" [ngClass]="getBtnStyle()" class="btn dropdown-toggle {{propertyName}}" data-toggle="dropdown" role="button" [title]="getFormatedText()" aria-expanded="false" #btn (click)="setFocusToValidate(btn, $event)">
            <span class="filter-option pull-left"> 
                <i *ngIf="selectedItem[options.iconProp]||options.iconRenderer" [class]="getSelectedIconStyle()"></i>               
                <span class="{{options.multiselect?'':selectedItem[options.styleProp]}}">{{getFormatedText()}}</span>
            </span>&nbsp;
            <span class="bs-caret">
                <span class="caret"></span>
            </span>
        </button>
        <div class="input-group" [style.width]="options.width" *ngIf="options.editable">
          <input type="text" #editableText class="form-control" value="{{getFormatedText()}}">
          <span class="input-group-btn">
                <button (click)="isEditable=!isEditable" class="btn btn-default" type="button"><span class="caret"></span></button>
          </span>
        </div>
        <div #dropdown class="dropdown-menu open custom-dropdown-menu" role="combobox" [style.top.px]="menuTop" [style.min-width]="getMinwidth()" style="overflow: hidden; min-height: 0px;">            
            <div class="search-checkall" *ngIf="options.liveSearch||(options.multiselect && options.checkAll)">
                <label (click)="$event.stopPropagation()" *ngIf="options.checkAll"><input (click)="checkAll(chkAll.checked)" #chkAll type="checkbox">Select All</label>
                <input #searchEl *ngIf="options.liveSearch" [style.width.%]="options.checkAll?50:100" autofocus type="text" class="form-control" role="textbox" placeholder="Search...">
            </div>
            <ul *ngIf="!options.columns" class="dropdown-menu inner" role="listbox" aria-expanded="false" [style.max-height.px]="options.height?options.height-46:'none'" style="overflow-y: auto; min-height: 0px;" >
                <li [ngClass]="getItemClasses(item)" *ngFor="let item of dataList">
                    <a role="option" (click)="selectItem(item, $event)" role="option">
                        <span *ngIf="item[options.iconProp]||options.iconRenderer" [class]="getIconStyle(item)"></span>
                        <span class="{{item[options.styleProp]||'text'}}">{{item[options.textProp]}}<small class="text-muted">{{item[options.subTextProp]}}</small>
                        <div *ngIf="item[options.descriptionProp]"><small class="text-muted">{{item[options.descriptionProp]}}</small></div>
                        </span>
                        <span class="glyphicon glyphicon-ok check-mark"></span>
                    </a>
                </li> 
                <li *ngIf="!hasSerchResult" class="no-results" style="display: list-item;">
                    No results matched "{{livesearchText}}"
                </li>                         
            </ul>
            <table *ngIf="options.columns" class="table" style="margin-bottom:-1px">
                    <thead><tr>
                        <th *ngFor="let col of options.columns" [style.width.px]="col.width||120" style="display:inline-block">{{col.header}}</th>                        
                    </tr></thead>
            </table>
            <div *ngIf="options.columns" [style.max-height.px]="claHeightWhenColumns()" style="overflow-y: auto; min-height: 0px;" >
                <table class="table ju-select table-hover">
                   
                    <tbody>
                        <tr [ngClass]="getItemClasses(item)" *ngFor="let item of dataList" role="option" (click)="selectItem(item, $event)" role="option">
                            <td *ngFor="let col of options.columns" [style.width.px]="col.width||120" style="display:inline-block">{{item[col.field]}}</td>                           
                        </tr>
                    </tbody>
                </table>
            </div>
            <div [style.visibility]="maxOptionsVisibility" class="notify">{{options.maxOptionsText}}</div>
        </div>

    </div>`
})
export class juSelect implements OnInit, OnChanges, AfterViewInit {
    @Input('data') dataList: any[];
    @Input() options: SelectOptions = <SelectOptions>{};
    @Input() model: any = {};
    @Input('property-name') propertyName: any;
    @Input() config: any = {};
    @Input('myForm') myForm: any;
    @Output('option-change') onChange = new EventEmitter();
    @Input() index: number;
    @Input() set value(val: any)
    { 
         this.previousValue = val;
    }

    @ViewChild('searchEl')     private searchEl: ElementRef;
    @ViewChild('maincontent')  private containerEl: ElementRef;
    @ViewChild('editableText') private editableText: ElementRef;
    @ViewChild('dropdown')     private dropdownContent: ElementRef;
    private previousValue: any = '';
    public selectedItem: any = {};
    private dataList_bckup: any[];
    private livesearchText: string;
    private hasSerchResult: boolean = true;
    private maxOptionsVisibility: string = 'hidden';
    private focusToValidate: boolean = false; 
    private tableBodyContent: any = null;
    private isEditable: boolean = false;
    private menuTop: number = 34;
    notifyRowEditor: Subject<any> = new Subject();
    valueChanges: Subject<any> = new Subject();

    constructor(private renderer: Renderer) {  }
    private claHeightWhenColumns()
    {
        if (!this.options.height) this.options.height = 200;
        return this.options.liveSearch ? this.options.height - 83 : this.options.height - 46;  
        
    }
    public ngOnInit() {
        this.config.api = this;        
        this.options.textProp = this.options.textProp || 'text';
        this.options.valueProp = this.options.valueProp || 'value';
        this.options.subTextProp = this.options.subTextProp || 'subText';
        this.options.descriptionProp = this.options.descriptionProp || 'description';
        this.options.iconProp = this.options.iconProp || 'icon';
        this.options.selectedTextProp = this.options.selectedTextProp || 'selectedText';
        this.options.disabledItemProp = this.options.disabledItemProp || 'disabled';
        this.options.styleProp = this.options.styleProp || 'style';
        this.options.title = this.options.title || '';
        this.options.maxOptions = this.options.maxOptions || 0;
        this.options.maxOptionsText = this.options.maxOptionsText || `Limit reached (${this.options.maxOptions} items max)`;        
        this.options.selectedTextFormat = this.options.selectedTextFormat || 'values';
        this.options.btnStyle = this.options.btnStyle || 'btn-default';
        this.options.width = this.options.width || '';
        this.options.height = this.options.height || 200
        this.options.multipleSeparator = this.options.multipleSeparator || ','

        if (!('liveSearch' in this.options)) {
            this.options.liveSearch = false;
        }
        if (!('disabled' in this.options)) {
            this.options.disabled = false;
        }
        if (!('multiselect' in this.options)) {
            this.options.multiselect = false;
        }        
        if (!('dropup' in this.options)) {
            this.options.dropup = false;
        }
        if (!('fitWidth' in this.options)) {
            this.options.fitWidth = false;
        }
        if (!('showMenuArrow' in this.options)) {
            this.options.showMenuArrow = false;
        }
        if (!('editable' in this.options))
        {
            this.options.showMenuArrow = false;
        }
        if (!('fixedPosition' in this.options))
        {
            this.options.fixedPosition = false;
        }
        if (this.options.editable)
        {
            Observable.fromEvent(document.body, 'mouseup').subscribe(_ =>
            {                
                if (this.isEditable) this.isEditable = false;
               
            });
        }
    }
    public ngOnChanges(changes: any) {                          
        if (changes.dataList && changes.dataList.currentValue && changes.dataList.currentValue !== changes.dataList.previousValue)
        {
            this.dataList = changes.dataList.currentValue.map(item => Object.assign({}, item, { selected: false }));
            this.dataList_bckup = this.dataList;
            if (this.previousValue && this.dataList /*&& this.dataList.length > 0*/)
            {                             
                this.setValue(this.previousValue);
                if (this.myForm)
                {
                    this.publishChanges(this.previousValue);
                }
            }  
        }       
    }
    public setData(data: any)
    {
        this.dataList = data;
        if (this.previousValue)
        {           
            this.setValue(this.previousValue);
        }  
    }
    public ngAfterViewInit() {
        if (this.options.liveSearch) {
            Observable.fromEvent(this.searchEl.nativeElement, 'keyup')
                .debounceTime(300).distinctUntilChanged()
                .map((e: any) => e.target.value)
                .subscribe(e => this.liveSearch(e));
        }
        if (this.options.editable)
        {            
            Observable.fromEvent(this.editableText.nativeElement, 'keyup')
                .debounceTime(300).distinctUntilChanged()
                .map((e: any) => e.target.value)
                .subscribe(e => this.setModelValue(e));
        }        
        if (this.options.fixedPosition)
        {            
            this.renderer.setElementStyle(this.dropdownContent.nativeElement, 'position', 'fixed');                     
        }       
        if (this.options.height)
        {
            this.renderer.setElementStyle(this.dropdownContent.nativeElement, 'max-height', this.options.height+'px'); 
        }
    }
    private getMinwidth()
    {
        if (this.options.optionsWidth)
        {
            return this.options.optionsWidth;
        }
        if (this.options.fixedPosition)
            return (jQuery(this.containerEl.nativeElement).width()||120)+'px';
        return '100%';
    }
    public ngOnDestroy() {

    }
    private getPositionStyle()
    {            
       return this.options.fixedPosition?'fixed;':'absolute';
    }
    private setFocusToValidate(buttonEl: any, e: any)
    {
        
        this.focusToValidate = true;
        //if(this.options.fixedPosition){
        //    let button = jQuery(buttonEl),
        //        dropdown = jQuery(this.dropdownContent.nativeElement),
        //        offset = button.offset(),
        //        modelContent = jQuery(this.containerEl.nativeElement).parents('.modal-content'),
        //        top = 0, left = 0;
        //    if (modelContent.length == 1)
        //    {
        //        let modelOffset = modelContent.offset();
        //        top = modelOffset.top;
        //        left = modelOffset.left; 
        //    }
        //    dropdown.css('top', offset.top + button.outerHeight()-top + "px");
        //    dropdown.css('left', offset.left-left + "px");
        //}
        var gridContainer = jQuery(this.containerEl.nativeElement).parents('.enableCellEditing');        
        if (gridContainer.length)
        {
            var height = gridContainer.height();
            var button = jQuery(buttonEl);
            var top = button.offset().top - gridContainer.offset().top;
            var btnHeight = button.outerHeight();
            var menuHeight = jQuery(this.dropdownContent.nativeElement).height();            
            if ((top + btnHeight + menuHeight) > height)
            {
                this.menuTop = -(btnHeight + menuHeight-14);
            } else
            {
                this.menuTop = 34;
            }

        }
        //this.options.dropup = true;
        
    }
   
    private checkAll(checked)
    {
        if(this.dataList ===undefined)return;
        this.dataList.forEach(_ => _.selected = checked); 
        this.setModelValue(checked?this.getValue():'');      
    }
    private liveSearch(val: string) {
        this.livesearchText = val;
        if (!val) {
            this.dataList = this.dataList_bckup;
            return;
        }       
        val = val.toLowerCase();
        this.dataList = this.dataList_bckup.filter(_ => _[this.options.textProp].toLowerCase().indexOf(val) != -1);
        this.hasSerchResult = this.dataList.length > 0;
    }
    private getText(list: any[]) {
        return list.map(_ => _[this.options.selectedTextProp] || _[this.options.textProp]).join(', ') || this.options.title;
    }
    private getFormatedText() {
        if (this.options.multiselect) {
            if(!this.dataList) return this.options.title;
            const slist = this.dataList.filter(_ => _.selected);           
            if (slist.length == 0) return this.options.title;
            if (this.options.selectedTextFormat === 'values')
                return this.getText(slist);
            else if (this.options.selectedTextFormat === 'count') {
                if (slist.length == 1) return this.getText(slist);
                return slist.length + ' items selected';
            } else if (this.options.selectedTextFormat.indexOf('>') >= 5) {
                const count = parseInt(this.options.selectedTextFormat.split('>')[1].trim());                
                if (count >= slist.length) return this.getText(slist);
                return slist.length + ' items selected';
            }
        }
        return (this.selectedItem[this.options.selectedTextProp]
            || this.selectedItem[this.options.textProp]) || this.options.title;

    }
    private getItemClasses(item: any) {
        return { selected: item.selected, disabled: item[this.options.disabledItemProp], 'single-silected': !this.options.multiselect && item.selected};
    }
    private selectItem(item: any, e: any)
    {
        this.isEditable = false;
        if (this.options.multiselect) {
            e.stopPropagation();
            item.selected = !item.selected;
            if (this.options.maxOptions > 0) {
                const slist = this.dataList.filter(_ => _.selected);
                if (slist.length > this.options.maxOptions) {
                    item.selected = false;
                    this.maxOptionsVisibility = 'visible';
                    let tid = setTimeout(() => { this.maxOptionsVisibility = 'hidden'; clearTimeout(tid); }, 1500);
                    return false;
                }                
            }
            this.setModelValue(this.getValue());
            return false;
        }
        if (!!item[this.options.disabledItemProp]) return;
        item.selected = true;
        if (item !== this.selectedItem && this.selectedItem.selected) {
            this.selectedItem.selected = false;
        }  
        this.selectedItem = item;
        this.setModelValue(item[this.options.valueProp]);
    }
    private getBtnStyle() {
        return { [this.options.btnStyle]: true };
    }
    private getDropdownStyle() {
        return { 'dropup': this.options.dropup, 'form-control': this.options.fitWidth || this.options.width, 'fit-width': this.options.fitWidth, 'show-menu-arrow': this.options.showMenuArrow, 'show-tick': this.options.multiselect };
    } 
    private getSelectedIconStyle() {
        if (this.options.multiselect) return '';
        return this.selectedItem[this.options.textProp] ? this.getIconStyle(this.selectedItem) : '';
    }
    private getIconStyle(item: any) {
        return this.options.iconRenderer ? this.options.iconRenderer(item) :
            item[this.options.iconProp] ? 'glyphicon glyphicon-' + item[this.options.iconProp] : '';
    }
    /*model communication*/
    public setValue(value: any)
    {
        if (this.options.editable && this.editableText) this.editableText.nativeElement.value = '';  
		let tempValue=this.previousValue;
        this.previousValue=value;    
        this.checkAll(false);
        this.selectedItem = {};  
        if (!this.dataList) { return; } 
        if (!value) {            
            this.setModelValue('');
            this.focusToValidate = false;
            return;
        }
        if (this.options.multiselect)
        {
            if (this.dataList && this.dataList.length == 0) return;            
            value.toString().split(this.options.multipleSeparator).forEach(val =>
            {
                let item = this.dataList.find(_ => _[this.options.valueProp].toString() === val);
                if (item) item.selected = true;
            });
        } else
        {
            let item = this.dataList.find(_ => _[this.options.valueProp||'value'].toString() === value.toString());
            if (item)
            {
                item.selected = true;
                this.selectedItem = item;
            }
        }
		if( this.myForm){this.previousValue=tempValue;}
        this.setModelValue(value);
    }
    public getValue()
    {
        if (this.options.editable && this.editableText) return this.editableText.nativeElement.value;
        if(this.dataList ===undefined)return '';
        return this.dataList.filter(_ => _.selected).map(_ => _[this.options.valueProp]).join(this.options.multipleSeparator);
    }
    private getValueFromModel()
    {
        let props: Array<string> = this.propertyName.split('.');
        if (props.length > 1)
        {
            let obj = this.model;
            props.forEach(prop => obj = obj[prop]);
            return obj;
        }
        return this.model[this.propertyName];
    }
    
    private setModelValue(val: any)
    {
        if(!this.propertyName)return;
        let props: Array<string> = this.propertyName.split('.');
        if (props.length > 1)
        {
            let obj = this.model;
            let len = props.length - 1;
            for (var index = 0; index < len; index++)
            {
                obj = obj[props[index]];
            }
            obj[props[index]] = val;
        }
        else { this.model[this.propertyName] = val; }
        //publishChanges...
        if (val !== this.previousValue && val)
        {
            this.publishChanges(val);
        }
        this.previousValue=val;
    }
    private publistCount:number=0;
    updated:boolean=false;
    private publishChanges(val: any)
    {
        this.publistCount++;
         
         if (this.publistCount > 1)
         {
             this.updated = true;
             this.notifyRowEditor.next({});
         }
        this.onChange.next({ value: val, sender: this, form: this.myForm, index: this.index });
        this.valueChanges.next({ value: val, sender: this, form: this.myForm, index: this.index });
        
    }
    public hasError() { 
        this.myForm.componentRef.instance.vlidate_input( this.getValue(), this.config, !this.focusToValidate);        
        return !this.config.hideMsg;
    }
}
export interface SelectOptions {
    textProp?: string;
    valueProp?: string;
    subTextProp?: string;
    descriptionProp?: string;
    iconProp?: string;
    selectedTextProp?: string;
    disabledItemProp?: string;
    styleProp?: string;

    title?: string;
    liveSearch?: boolean;
    iconRenderer?: (item: any) => string;
    disabled?: boolean;
    checkAll?: boolean;
    multiselect?: boolean;
    maxOptions?: number;
    maxOptionsText?: string;
    selectedTextFormat?: 'values' | 'count' | 'count > x' | string;
    dropup?: boolean;
    btnStyle?: 'btn-default' | 'btn-primary' | 'btn-info' | 'btn-success' | 'btn-warning' | 'btn-danger';
    width?: string;
    optionsWidth?: string;
    height?: number;
    fitWidth?: boolean;
    showMenuArrow?: boolean;
    multipleSeparator?: string;
    editable?: boolean;   
    fixedPosition?: boolean;
    columns?: any[];
}