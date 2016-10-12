import {Component, OnInit} from '@angular/core';
import {juWindowService} from '../../shared/juWindow/juWindowService';
import {CrudExample} from '../grid/crudExample';
@Component({
    selector: 'window-component',
    template: `
    <div class="wnav">
        <input type="button" class="btn btn-success" value="Form" (click)="service.createWindow('form')">
        <input type="button" class="btn btn-success" value="Grid" (click)="service.createWindow('grid')">
        <input type="button" class="btn btn-success" value="About" (click)="service.createWindow('about')">
    </div>
    <div class="pw" height="500"></div>
    `
})

export class WindowComponent implements OnInit {

    constructor(private service: juWindowService) { }

    ngOnInit() {
        this.service.windowConfig = {
            'about': { title: 'About us', width: 600, height: 400, loader: () => CrudExample },
            //'form': { title: 'Sample Form', width: 900, height: 450, loader: () => require('../home/home.component').HomeComponent },
           // 'grid': { title: 'Sample Grid', width: 800, height: 400, loader: () => require('../settings/grid/grid').gridExample }
        };
    }

}