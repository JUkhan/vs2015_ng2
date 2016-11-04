
import {Component, Input, OnInit, ChangeDetectionStrategy, ViewEncapsulation} from '@angular/core';

@Component({
    moduleId: module.id,
    template: `<span style="padding:0 4px">{{value}}</span>`,
    selector: '[cell-com]', changeDetection: ChangeDetectionStrategy.OnPush,    
    host: {
        '[class.center]': "options.textAlign==='center'",
        '[class.left]': "options.textAlign==='left'",
        '[class.right]': "options.textAlign==='right'"
    },
    encapsulation: ViewEncapsulation.None
})
export class CellComponent implements OnInit
{
    @Input() options: any = {};
    @Input() value: any[];
    isActive: boolean = true;
    constructor() { }
    ngOnInit()
    {

    }
    getClass()
    {
        let res = {};
        if (this.options.textAlign)
        {
            res[this.options.textAlign] = true;
        }
        return res;
    }
}