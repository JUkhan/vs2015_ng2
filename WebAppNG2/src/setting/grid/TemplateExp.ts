
import {Component, Directive, ContentChildren, QueryList, Input, AfterContentInit, TemplateRef, ContentChild, ViewContainerRef} from '@angular/core';

@Component({ selector: 'header', template: '<ng-content></ng-content>' })
export class Header {
    constructor() {       
    }
}
@Component({ selector: 'template-renderer', template: '' })
export class TemplteRenderer {
    @Input() template: TemplateRef<any>;
    constructor(private viewContainer: ViewContainerRef) {
        console.log('View Container Ref:', viewContainer);
    }
    ngOnInit() {
        this.viewContainer.createEmbeddedView(this.template);
    }
}
@Directive({ selector: '[jTemplate]' })
export class jTemplate {
    @Input() jTemplate: string;

    constructor(public template: TemplateRef<any>) {
        console.log(template);
    }
    ngOnInit() {
       
    }
    getType(): string {
        return this.jTemplate;
    }
}
@Component({ selector: 'j-Column', template: '' })
export class jColumn {
    @Input() header: string;
    @Input() field: string;
    @Input() rowData: any;
    @ContentChildren(jTemplate) jTemplates: QueryList<jTemplate>;

    constructor() {

    }
    ngOnInit() {

    }
    headerTemplate: TemplateRef<any>;
    bodyTemplate: TemplateRef<any>;
    ngAfterContentInit() {
        this.jTemplates.forEach(_ => {            
            switch (_.getType()) {
                case 'header': this.headerTemplate = _.template; break;
                case 'body': this.bodyTemplate = _.template; break;
                default: this.bodyTemplate = _.template; break;
            }
        });
    }
}

@Component({
    selector: 'template-exp',
    template: `
            <h1>Dynamic template anylysis</h1>
            <div *ngIf="header">
                <ng-content select="header"></ng-content>
            </div>
            <div style="border:solid 1px red;height:40px">
                <ng-content select=".one"></ng-content>
            </div>
            <ng-content select=".two"></ng-content>
            <div>Columns</div>
            <div style="display:table">
                <div>
                    <template ngFor [ngForOf]="columns" let-col>
                       <div style="display:table-cell"><b>{{col.header}}</b></div> 
                    </template>
                </div>
                <div>
                    <template ngFor [ngForOf]="columns" let-col>
                       <div style="display:table-cell" *ngIf="!col.bodyTemplate">{{col.rowData[col.field]}}</div> 
                       <div style="display:table-cell" *ngIf="col.bodyTemplate">
                             <template
                                    [ngTemplateOutlet]="col.bodyTemplate"
                                    [ngOutletContext]="{ data: col.rowData }">
                            </template>
                       </div> 
                    </template>
                </div>
            </div>
        `
})
export class TemplateExp {

    @ContentChild(TemplateRef) tpm: TemplateRef<any>;
    @ContentChild(Header) header: TemplateRef<Header>;

    @ContentChildren(jColumn) jColumns: QueryList<jColumn>;

    columns: jColumn[];
    subscription: any;
    ngAfterContentInit() {
        console.log('Hederx', this.header);
        this.columns = this.jColumns.toArray();
        console.log('COLUMNS1st:', this.columns);
        this.subscription = this.jColumns.changes.subscribe(res => {
            this.columns = this.jColumns.toArray();
            console.log('COLUMNS:',this.columns);
        })
    }

    ngOnDestroy() {
        console.log('unsubscribe...');
        this.subscription.unsubscribe();
    }
}

