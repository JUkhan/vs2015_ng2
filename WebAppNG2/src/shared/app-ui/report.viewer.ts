import {Component, ElementRef, OnChanges, OnDestroy, OnInit, Input, Output, EventEmitter, TemplateRef, ViewContainerRef, ContentChild} from '@angular/core';
import {juForm, FormOptions, FormElement} from '../juForm/juForm';
import {juGrid, GridOptions} from '../juGrid/juGrid';
declare var jQuery: any;
@Component({
    moduleId: module.id,
    selector: 'rv, [rv] .rv',
    template: `
<div class="modal fade" id="myModal" role="dialog">
    <div class="modal-dialog"> 
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Modal Header</h4>
        </div>
        <div class="modal-body">
                <div class="report-viewer">
                    <div class="header">
                            <span>{{options.title}}</span>
                    </div> 
                    <div *ngIf="options.approvedGroup"><b>Check Approved Group: {{options.approvedGroup}}</b></div>                   
                    <div class="form-options">
                        <template [ngTemplateOutlet]="formTemplate" [ngOutletContext]="{ref:options}">
                        </template>
                    </div>
                    <div class="grid-options">
                        <div juGrid [options]="options.grid"></div>
                    </div>                
                </div>
           </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div> 
`
            
})
export class ReportViewer implements OnInit, OnChanges
{
    @Input() options: ReportViewerOpptions = <ReportViewerOpptions>{ grid: {}};
    @ContentChild(TemplateRef) formTemplate;
    constructor(private _elementRef: ElementRef) { }
    private gridOptions: GridOptions;
    private formOprions: FormOptions = <FormOptions>{ viewMode:'panel' };
    public ngOnInit() {  }
    public ngOnChanges(changes)
    {

    }
    ngAfterContentInit()
    {

    }    
    private gridLoad(grid: juGrid)
    {
       
    }
    public showModal(isDisplayed: boolean = true)
    {
        console.log(this._elementRef.nativeElement);
        jQuery(this._elementRef.nativeElement.firstChild).modal(isDisplayed ? 'show' : 'hide');
              
    }
}

export interface ReportViewerOpptions
{
    title: string;
    grid: GridOptions;
    approvedGroup: string;
    [key: string]: any;
}