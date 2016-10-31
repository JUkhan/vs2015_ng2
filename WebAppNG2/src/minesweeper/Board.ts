

import { Component, Input, Output, ChangeDetectionStrategy, EventEmitter } from '@angular/core';

@Component({
    moduleId: module.id,
    selector:'Board',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `<div class="board-row" *ngFor="let r of numRows;">
                    <Square *ngFor="let c of numCols" (clickSquare)="squareclickHandler.emit((9*r)+c)" [options]="squares[(9*r)+c]"></Square>
               </div>
               `
})
export class Board {
   private numRows:any[]=[0,1,2,3,4,5,6,7,8,9,10,11];
   private numCols:any[]=[0,1,2,3,4,5,6,7,8];
   @Input() squares:any[]=[];
   @Output() squareclickHandler=new EventEmitter();
  
}