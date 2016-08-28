import {Component, EventEmitter, OnInit, OnDestroy, ElementRef, ViewEncapsulation} from '@angular/core';
import {juPanelContent} from './juPanelContent';
declare var jQuery: any;
@Component({
    moduleId: module.id,
    selector: 'juPanel,[juPanel]',
    templateUrl: './juPanel.html',
    styleUrls: ['./juPanel.css'],
    inputs: ['viewMode'],
    outputs: ['onActive'],
    encapsulation: ViewEncapsulation.None
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