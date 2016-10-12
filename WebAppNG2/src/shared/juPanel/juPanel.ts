import {Component, EventEmitter, OnInit, OnDestroy, ElementRef, ViewEncapsulation} from '@angular/core';
import {juPanelContent} from './juPanelContent';
declare var jQuery: any;
@Component({
    moduleId: module.id,
    selector: 'juPanel,[juPanel]',   
    //styleUrls: ['juPanel.css'],
    inputs: ['viewMode'],
    outputs: ['onActive'],
    encapsulation: ViewEncapsulation.None,
    template:`<div [class.card]="viewMode==='tab'">
    <ul class="nav nav-tabs" *ngIf="viewMode==='tab'">
        <li *ngFor="let pane of contentList" (click)="select(pane)" role="presentation" [class.active]="pane.active">
            <a>{{pane.title}}</a>
        </li>
    </ul>
    <div [class.tab-content]="viewMode==='tab'">
        <ng-content></ng-content>
    </div>
</div>`
})

export class juPanel {
    viewMode: string = 'accordion';
    onActive: EventEmitter<juPanelContent> = new EventEmitter<juPanelContent>();
    contentList: Array<juPanelContent> = [];    
    constructor(private el: ElementRef) { }

    insertContent(content: juPanelContent) {
        this.contentList.push(content);
    }
    removeContent(content: juPanelContent) {
        this.contentList.splice(this.contentList.indexOf(content), 1);
    }
    select(content: juPanelContent) {
        this.contentList.forEach((p: juPanelContent) => p.active = p == content);        
        this.onActive.next(content);
    }   
    
}