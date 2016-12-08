import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';


@Component({
    selector: 'word',
    template: `
    <span [title]="token" [class.ctrlKey]="ctrlKey" [class.selected]="selected" [class.maped]="maped" class="word" (click)="wordClick($event)">{{text}}</span>
    `,
    styles: [`
        .word{ margin:2px; padding:2px; cursor:pointer;}
        .word:hover{color:red;}
        .selected{border:solid 1px red;background-color: #ededed; border-radius: 4px;}
        .maped{    background-color: #ededed;
                    color: #333;
                    border: solid 1px #333;
                    border-radius: 4px;
               }
        .ctrlKey{ color:blue;}
    `]
})

export class Word implements OnInit {

    @Input() index: number;
    @Input() text: string;
    selected: boolean;
    maped: boolean;
    token: string='';
    @Output() onWordClick = new EventEmitter();
    constructor() { }

    ngOnInit() {
        
    }
    ctrlKey: boolean = false;
    private wordClick(e) {        
        this.selected = !this.selected;
        this.ctrlKey = e.ctrlKey;
        if (this.ctrlKey) { this.selected = true; }
        this.onWordClick.emit(this);
    }
}