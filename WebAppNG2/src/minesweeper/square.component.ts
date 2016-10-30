
import { Component, Input, Output, ChangeDetectionStrategy, EventEmitter, OnInit } from '@angular/core';

@Component({
    moduleId: module.id,
    selector:'Square',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `<button [ngClass]="{'square':options.mode,'square-d':!options.mode, 'boom':options.boom,'won' : options.won}"
            (click)="clickSquare.emit(null)" (contextmenu)="mouseRightClick($event)">
            {{getValue()}}
        </button>`
})
export class Square implements OnInit {
    @Input() options: { mode: boolean, value: any, boom: boolean, won: boolean } = <any>{};
    @Output() clickSquare= new EventEmitter();
    constructor() {

    }
    
    getValue() {         
        if (this.options.value && this.options.mode) {
            return this.options.value >= 100 ? '*' : this.options.value;
        }
        return '';
    }
    mouseRightClick(e:any){console.log('boom');
         e.preventDefault();
         this.options.boom=true;
    }
    ngOnInit(){        
      
    }
}