import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {juWindowService} from '../../shared/juWindow/juWindowService';

import { CrudExample }         from './crudExample';
import { TreeExample }         from './treeExample';
import {CellEditExample}       from './cellEditExample';
import { FV}          from '../../shared/juForm/FV';
//<div class="wnav" >
//    <input type="button" class="btn btn-success" value= "Form"(click) = "service.createWindow('form')" >
//        <input type="button" class="btn btn-success" value= "Grid"(click) = "service.createWindow('grid')" >
//            <input type="button" class="btn btn-success" value= "About"(click) = "service.createWindow('about')" >
//                </div>
//                < div class="pw" height= "500" > </div>

@Component({
    moduleId: module.id,
    selector: 'test-component',
    template: `<div juForm [options]="formDefs"></div>`,
   
    styles: [`
          .wnav{margin-top:1px;}  
    `],
    encapsulation: ViewEncapsulation.None
})

export class WindowComponent implements OnInit {

    constructor(private service: juWindowService) { }
    
    ngOnInit() {
        //this.service.windowConfig = {
        //    'about': { title: 'About us', width: 600, height: 400, loader: () =>CrudExample },
        //    'form': { title: 'Sample Form', width: 900, height: 450, loader: () =>TreeExample },
        //    'grid': { title: 'Sample Grid', width: 800, height: 400, loader: () =>CellEditExample }
        //};
        this.initForm();
    }
    formDefs: any;
    initForm() {
        this.formDefs = {
            title: 'Scholar',
            labelPos: 'left',
            labelSize: 3,
            inputs: [
                { field: 'name', label: 'Name', type: 'text', validators: [FV.required, FV.minLength(5)] },
                { field: 'education', width: 222, label: 'Education', type: 'juSelect', validators: FV.required },
                { field: 'address', label: 'Address', type: 'text', validators: FV.required },
                { field: 'age', label: 'Age', type: 'text', validators: [FV.required, FV.regex(/^\d+$/, 'Age should be a number')] },
                { field: 'description', label: 'Description', type: 'ckeditor' }
            ],
            buttons: {
                'Save Change': { type: 'submit', cssClass: 'btn btn-success', click: this.submitScholar.bind(this) },
                'Close': { type: 'close', cssClass: 'btn btn-default' }
            }
        };
    }
    submitScholar() {
        alert('submitted');
    }
}