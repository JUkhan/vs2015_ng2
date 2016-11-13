
import {Component, Input, OnInit, ChangeDetectionStrategy, ViewEncapsulation, ElementRef, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import {ColumnDefs} from './MyGrid';
@Component({
    moduleId: module.id,
    template: `<div [ngSwitch]="getSwitch()" style="position:relative">
                  <template [ngSwitchCase]="'render'">
                       <div [class.renderer]="renderer"> <div [innerHtml]="options.render(row[options.field],row) | safeHtml"></div></div>
                  </template>
                  <template [ngSwitchCase]="'button'" >
                        <button [disabled]="options.disabled(val, row)" [ngClass]="options.class(row[options.field], row)" [ngStyle]="options.style(row[options.field], row)" [title]="options.title" (click)="options.click(row[options.field], row)">{{options.text}}</button>
                  </template>
                  <template [ngSwitchCase]="'text'" >
                        <input type="text" [disabled]="options.disabled(val, row)" [ngClass]="options.class(row[options.field], row)" [ngStyle]="options.style(row[options.field], row)" [title]="options.title" [(ngModel)]="row[options.field]" />
                  </template>
                  <template [ngSwitchCase]="'textarea'" >
                        <textarea [disabled]="options.disabled(val, row)" [ngClass]="options.class(row[options.field], row)" [ngStyle]="options.style(row[options.field], row)" [title]="options.title" [(ngModel)]="row[options.field]" ></textarea>
                  </template>
                  <template [ngSwitchCase]="'checkbox'" >
                        <input type="checkbox" [disabled]="options.disabled(val, row)" [ngClass]="options.class(row[options.field], row)" [ngStyle]="options.style(row[options.field], row)" [title]="options.title" [(ngModel)]="row[options.field]" />
                  </template>
                  <template [ngSwitchCase]="'select'" >
                     <juSelect
                        (option-change)="options.change($event)" 
                        [config]="options"
                        [model]="row"
                        [value]="row[options.field]"                        
                        [property-name]="options.field"                       
                        [data]="options.data"
                        [options]="options.selectOptions||{}"
                        [index]="index"></juSelect>
                  </template>                     
                  <span *ngSwitchDefault style="padding:0 4px">{{row[options.field]}}</span>
                </div>`,
    selector: '[cell-com]', changeDetection: ChangeDetectionStrategy.OnPush,    
    host: {
        '[class.center]': "options.align==='center'",
        '[class.left]': "options.align==='left'",
        '[class.right]': "options.align==='right'"
    },
    encapsulation: ViewEncapsulation.None
})
export class Cell implements OnInit, AfterViewInit
{
    @Input() options: ColumnDefs = <ColumnDefs>{};   
    @Input() row: any;
    @Input() index: number=0;
    isActive: boolean = true;
    protected renderer: boolean = false;
    constructor(private el: ElementRef, private cd: ChangeDetectorRef) { }
    ngOnInit()
    {

    }
    ngAfterViewInit() {
       
        console.log(this.renderer);
        setTimeout(() => {
            this.renderer = true;
            this.cd.markForCheck();
            console.log(this.renderer);
        }, 300);
    }
    getSwitch()
    {
        if (this.options.render) return 'render';
        else if (this.options.type) return this.options.type;
        return '';
    }
}

import { DomSanitizer } from '@angular/platform-browser'
import {Pipe, PipeTransform} from '@angular/core';
@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe implements PipeTransform {
    constructor(private sanitized: DomSanitizer) { }
    transform(value) {
        return this.sanitized.bypassSecurityTrustHtml(value);
    }
}