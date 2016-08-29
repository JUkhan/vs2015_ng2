import {Component, OnInit, Input} from '@angular/core';

@Component({
    moduleId: module.id,
    selector: '[juMenu], juMenu',
    templateUrl:'./juMenu.html',
    host:{'class':'collapse navbar-collapse'},
    styleUrls: ['./juMenu.css']
})

export class juMenu implements OnInit {
    
    @Input() menuData: any[];
    constructor() { }

    ngOnInit() {
       
    }
   
}

