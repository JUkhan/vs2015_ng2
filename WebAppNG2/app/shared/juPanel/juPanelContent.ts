import {Component,
    OnInit,
    OnDestroy,
    ElementRef,
    ViewEncapsulation,
    AfterContentInit,
    trigger,
    state,
    style,
    transition,
    animate
} from '@angular/core';
import {juPanel} from './juPanel';

@Component({
    moduleId: module.id,
    selector: 'content, [content]',
    templateUrl: './juPanelContent.html',
    inputs: ['title', 'active'],
    encapsulation: ViewEncapsulation.None,
    animations:[
        trigger('slide',[
            state('up', style({opacity:0, height:0})),
            state('down', style({opacity:1, height:'*'})),
            transition('up => down', animate('300ms ease-in')),
            transition('down => up', animate('300ms ease-out'))
        ])
    ]
})

export class juPanelContent implements OnInit, OnDestroy {
    title: string;
    private _active: boolean = false;
    private _clickOnToggle: boolean = false;
    private slideState:string='';
    constructor(private panel: juPanel, public elementRef: ElementRef) {
        panel.insertContent(this);
    }
    ngOnInit() {
       
    }
    ngAfterContentInit() {      
        this.slideState=this.active?'down':'up';
    }
    ngOnDestroy() {
        this.panel.removeContent(this);
    }
    set active(val) {
        this._active = val;
        if (!this._clickOnToggle) {           
            this.slideState=this.active?'down':'up';
        } else {
            this._clickOnToggle = false;
        }
    }
    get active() {
        return this._active;
    }
    slideToggle() {
        this._clickOnToggle = true;
        this.active = !this.active;
        this.slideState=this.active?'down':'up';
    }
}