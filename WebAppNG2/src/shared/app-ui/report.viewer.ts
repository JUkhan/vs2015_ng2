import {Component, ElementRef, OnChanges,ViewEncapsulation, OnDestroy, OnInit, Input, Output, EventEmitter, TemplateRef, ViewContainerRef, ContentChild} from '@angular/core';
import {juForm, FormOptions, FormElement} from '../juForm/juForm';
import {juGrid, GridOptions} from '../juGrid/juGrid';
declare var jQuery: any;
@Component({
    moduleId: module.id,
	 encapsulation: ViewEncapsulation.None,
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
                    <div class="heder-and-form">
						<div class="header" style="position:relative">
								<img src="favicon.ico">
								<div style="width:100%;text-align:center;top:0px;position:absolute">
									<div [style.width.px]="options.titleWidth" style="display:inline-block;text-align:center;">{{options.title}}</div>
								</div>
						</div>                                    
						<div class="form-options">
							<template [ngTemplateOutlet]="formTemplate" [ngOutletContext]="{ref:options}">
							</template>
						</div>
					</div>
                    <div class="grid-options">
                        <div juGrid [data]="data" [options]="options.grid"></div>
                    </div>                
                </div>
				 <div class="modal-footer">
				    <button type="button" (click)="print()" class="btn btn-primary">Print</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                </div>
           </div>
           
        </div>
    </div>
</div> 
`
            
})
export class ReportViewer implements OnInit
{
	@Input() data:any[];
    @Input() options: ReportViewerOpptions = <ReportViewerOpptions>{ grid: {}};
    @ContentChild(TemplateRef) formTemplate;
    constructor(private _elementRef: ElementRef) { }
    private gridOptions: GridOptions;
    private formOprions: FormOptions = <FormOptions>{ viewMode:'panel' };
    public ngOnInit() {
		jQuery('.modal',this._elementRef.nativeElement).on('hidden.bs.modal', (e: any) => {
               // this.onModalClose.next(null);
        });
		if (this.options.width) {
			jQuery('.modal-dialog').css('width', this.options.width);
        }
		this.options.titleWidth=this.options.titleWidth||200;
		if(!this.options.grid)
			this.options.grid={columnDefs:[], viewMode:'!panel'};
		if (!('noPager' in this.options.grid))
        {
            this.options.grid.noPager = true;
        }
		this.options.grid.pageSize = this.options.grid.pageSize||10000;
	}    
    public showModal(isDisplayed: boolean = true)
    {       
        jQuery('.modal',this._elementRef.nativeElement).modal(isDisplayed ? 'show' : 'hide');
              
    }
	private print(){		
		const printContent=this.getPrintContent(jQuery('.report-viewer',this._elementRef.nativeElement));		
		var newWin=window.open('','Print-Window');
		newWin.document.open();
		newWin.document.write(`<html><head><style>${this.getStyle()}</style></head><body onload="window.print()">${printContent}</body></html>`);
		newWin.document.close();
		setTimeout(function(){newWin.close();},10);
	}
	private getPrintContent(divElement:any){
		let html:any[]=[];
		html.push(jQuery('.heder-and-form',divElement).html());
		html.push('<table class="table table-bordered">');
		html.push(jQuery('.tbl-header-content table', divElement).html());		
		html.push('<tbody>');
		jQuery('.tbl-body-content table tbody tr', divElement).each((trin:number, tr:any)=>{		
			html.push('<tr>');
			jQuery('td',tr).each((tdin:number, td:any)=>{
				if(this.options.grid.columnDefs[tdin].type)
					html.push(`<td>${this.data[trin][this.options.grid.columnDefs[tdin].field]}</td>`);
				else				
					html.push(`<td>${td.innerHTML}</td>`);
			});
			html.push('</tr>');
		});
		html.push('</tbody>');
		html.push('</table>');		
		return html.join('');
	}
	private getStyle(){
		const style=`
		.filter-window{display:none}
		.table {
			border-collapse: collapse !important;
		  }
		  .table td,
		  .table th {
			background-color: #fff !important;
		  }
		  .table-bordered th,
		  .table-bordered td {
			border: 1px solid #ddd !important;
		  }
		  .table>tbody>tr>td, .table>tbody>tr>th, .table>tfoot>tr>td, .table>tfoot>tr>th, .table>thead>tr>td, .table>thead>tr>th {
			padding: 4px;
			line-height: 1.42857143;
			vertical-align: top;
			border-top: 1px solid #ddd;
		  }
          .marker
           {
	            background-color: Yellow;
           }
		`;
		return style;
	}
}

export interface ReportViewerOpptions
{
    title?: string;
    grid?: GridOptions;   
    [key: string]: any;
	width?:number;
	height?:number;
	api?:ReportViewer;
	titleWidth?:number;
}