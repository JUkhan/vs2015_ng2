
import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
    moduleId: module.id,
    template: `<div class="juRow">  
                   <div class="juCol juHeader" *ngFor="let item of options.columns">{{item.header}}</div>
                   <div class="juCol" style="width:20px;border-right: none;">&nbsp;</div> 
               </div>`,
    selector: 'header-com',
    encapsulation: ViewEncapsulation.None
})
export class Header implements OnInit
{
    @Input() options: any = {};
    constructor(){ } 
    ngOnInit()
    {
        console.log(this.options);
    }
}