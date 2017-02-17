import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'hello, .hello, [hello]',
    template: `
        <input [(ngModel)]="msg">
        <button>Click Me</button>
       {{msg}}
        <table class="table table-bordered table-striped theader">
            <thead>
                <tr (click)="options.rowClick()">
                    <th *ngFor="let col of options.columns">{{col.header}}</th>
                </tr>
            </thead>
            <tbody>
                  <tr *ngFor="let row of data">
                    <td *ngFor="let col of options.columns">
<input type="text" value="{{row[col.field]}}">
</td>
                 </tr>
            </tbody>
        </table>
    `
})
export class hello implements OnInit, OnDestroy
{
    @Output() moneyExchange = new EventEmitter();
    @Input() msg: string;
    @Input() options: any = {};
    @Input() data: any[];
    constructor()
    {
        console.log('constructor');
    }
    btnClick()
    {
        console.log(this.msg);
        this.moneyExchange.emit(this.msg)
    }
    ngOnInit()
    {
        console.log('onInit');
    }

    ngOnDestroy()
    {
        console.log('onDestroy');
    }
}