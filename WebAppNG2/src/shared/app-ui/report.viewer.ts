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
          <h4 class="modal-title">{{options.title}}</h4>
        </div>
        <div class="modal-body">
                <div class="report-viewer" [style.height.px]="options.height" style="overflow:auto">
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
				 <button type="button" (click)="print()" class="btn btn-default">Print</button>
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
    public ngOnInit() {
		jQuery('.modal',this._elementRef.nativeElement).on('hidden.bs.modal', (e: any) => {
               // this.onModalClose.next(null);
        });
		if ('width' in this.options) {
			jQuery('.modal-dialog').css('width', this.options.width);
        }
	}
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
        jQuery('.modal',this._elementRef.nativeElement).modal(isDisplayed ? 'show' : 'hide');
              
    }
	private print(){	
		const divElements =jQuery('.report-viewer',this._elementRef.nativeElement).html();
		var newWin=window.open('','Print-Window');
		newWin.document.open();
		newWin.document.write('<html><body onload="window.print()">'+divElements+'</body></html>');
		newWin.document.close();
		setTimeout(function(){newWin.close();},10);
	}
}

export interface ReportViewerOpptions
{
    title?: string;
    grid?: GridOptions;
    approvedGroup?: string;
    [key: string]: any;
	width?:number;
	height?:number;
}