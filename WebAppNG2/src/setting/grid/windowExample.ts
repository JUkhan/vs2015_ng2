import {Component, Directive, OnInit, ViewEncapsulation, ChangeDetectionStrategy} from '@angular/core';
import {juWindowService} from '../../shared/juWindow/juWindowService';

import { CrudExample }         from './crudExample';
import { TreeExample }         from './treeExample';
import {CellEditExample}       from './cellEditExample';
import { FV}          from '../../shared/juForm/FV';
import {Observable} from 'rxjs/Rx';
//<div class="wnav" >
//    <input type="button" class="btn btn-success" value= "Form"(click) = "service.createWindow('form')" >
//        <input type="button" class="btn btn-success" value= "Grid"(click) = "service.createWindow('grid')" >
//            <input type="button" class="btn btn-success" value= "About"(click) = "service.createWindow('about')" >
//                </div>
//                < div class="pw" height= "500" > </div>

@Component({
    moduleId: module.id,
    selector: 'test-component',
    //directives: [LogLifecycleDirective],
    template: `<div juForm [options]="formDefs"></div>
        <p>
            <a (click)="setThings( 'apples' )">Set Apples</a> &mdash;
            <a (click)="setThings( 'bananas' )">Set Bananas</a> &mdash;
            <a (click)="incrementCounter()">Increment counter</a>
        </p>
        <template
            [ngTemplateOutlet]="myTemplate"
            [ngOutletContext]="{ items: things }">
        </template>
        <template #myTemplate let-items="items">
            <p logLifecycle>
                How do you like them {{ items }}?!
            </p>
            <p>
                Counter: {{ counter }} <em>(from lexical context)</em>.
            </p>
        </template>
        <div style="display:table;border:solid 1px #333;">
        <div>
          <div style="display:table-cell;width:120px;border-right:solid 1px #333;width:230px">Jsim sdds sddsd sdsdds sdsd sdsd sdsd sdd sdds sdsd sdd  wewe wee wewe </div>
          <div style="display:table-cell;width:220px">Jsim Khan</div>
        </div>
        <div style="border-top:solid 1px #333;background-color:#ededed">
          <div style="display:table-cell;width:120px;border-right:solid 1px #333;width:230px">Jsim sdds sddsd sdsdds sdsd sdsd sdsd sdd sdds sdsd sdd  wewe wee wewe </div>
          <div style="display:table-cell;width:220px">Jsim Khan</div>
        </div>
      </div>
    `,
   
    styles: [`
          .wnav{margin-top:1px;}  
    `],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class WindowComponent implements OnInit {

    constructor(private service: juWindowService) {
        this.counter = 0;
        this.things = "apples";
    }
    
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
    // I hold the counter (which is being rendered in the template via a lexical binding).
    public counter: number;

    // I hold the type of things (which is being rendered in the template via the
    // ngOutletContext and the template-local bindings).
    public things: string;


    


    // ---
    // PUBLIC METHODS.
    // ---


    // I increment the counter by one.
    public incrementCounter(): void {

        this.counter++;

    }


    // I set the things.
    public setThings(newThings: string): void {

        this.things = newThings;
        const source = Observable.interval(100);
        const eventNumber = val => val % 2 == 0;
        const eventSource = source.filter(eventNumber);

        const evenNumberCount = eventSource.scan(acc => acc + 1, 0);
        const fiveEventNumbers = evenNumberCount.filter(_ => _ > 5);
        eventSource
            .withLatestFrom(evenNumberCount)
            .map(([even, count]) => `Even ${even} count(${count})`)

            .takeUntil(fiveEventNumbers)

            .subscribe(_ => console.log(_));
    }
}

@Directive({
    selector: "[logLifecycle]"
})
export class LogLifecycleDirective  {

    // I get called once when the directive is being destroyed.
    public ngOnDestroy() {

        console.log("Directive destroyed.");

    }


    // I get called once when the directive has been initialized and the inputs have
    // been bound for the first time.
    public ngOnInit() {

        console.log("Directive initialized.");

    }

}
