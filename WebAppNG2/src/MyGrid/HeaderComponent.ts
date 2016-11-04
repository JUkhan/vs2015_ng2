
import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
    moduleId: module.id,
    template: `<div class="juRow">  
                   <div class="juCol juHeader" *ngFor="let item of options.columns">{{item.header}}</div>
               </div>`,
    selector: 'my-grid-header',
    encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit
{
    @Input() options: any = {};
    constructor(){ } 
    ngOnInit()
    {
        console.log(this.options);
    }
}