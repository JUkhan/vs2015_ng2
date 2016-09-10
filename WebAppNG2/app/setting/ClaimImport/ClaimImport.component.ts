import {Component, OnInit} from '@angular/core';
import {juGrid}       from '../../shared/juGrid/juGrid';
import { FV}          from '../../shared/juForm/FV';
import {GridOptions}  from '../../shared/juGrid/juGrid.d';
import {Observable}   from 'rxjs/Rx';
import {AppService}   from '../../shared/app.service';

@Component({
    moduleId: module.id,
  templateUrl: './ClaimImport.html',
  styleUrls: ['./ClaimImport.css']  
})
export class ClaimImport {
  private formOptions: any;
  private gridOptions: GridOptions;
  private activeProgram: number = 0;
  private saveFormOptions: any;
  private fileName:string='';
  constructor(private service: AppService) { }

  ngOnInit() {
    this.initForm();
    this.initGrid();
    this.initSaveForm();
  }
  private loadData(params: any) {
    if(!this.fileName){
      return Observable.of({data:null});
    }
    params.fileName=this.fileName;
    return this.service.get(this.service.getUrl('Utilization/GetFormattedClaimData', params))
      .do(res => {
        let records: any[] = this.gridOptions.api.grid.getUpdatedRecords();
        if (records.length) {
          this.service.post('Utilization/UpdateClaimRecords', { dataList: records, fileName:this.fileName }).subscribe();
        }
      });
  }
  private initForm() {
    this.formOptions = {
      labelPos: 'left', refreshBy: { program: 0 },
      inputs: [
        {
          type: 'groupLayout', items: [
            {
              groupName: 'File Location', labelSize: 2, inputs: [
                [{ field: 'file1', type: 'file', size: 5, label: 'File', validators: FV.required },
                  { type: 'html', content: `<div class="col-md-1"><button class="btn btn-success" [disabled]="!config.api.valid" (click)="config.upload()">Import</button></div>` },
                  {
                    type: 'html', content: `
          <div class="col-md-3">
            <button type="button" class="btn btn-default">View File</button> &nbsp;
            <button type="button" class="btn btn-default">Reset</button> 
          </div>`}
                ]
              ]
            }
          ]
        },
        {
          type: 'groupLayout', items: [
            [{
              groupName: 'CMS format', labelSize: 4, size: 4, inputs: [
                [{ field: 'program', size: 8, label: 'Program', type: 'select' },
                  { type: 'html', content: `<button type="button" [disabled]="model.program.toString()==='0'" (click)="config.updateAll()" class="btn btn-default">Update All</button>` }]
              ]
            },
              {
                groupName: 'State format', size: 2, inputs: [
                  { type: 'html', content: `<div style="text-align:center;padding-bottom:20px;"><label><input type="checkbox"> CA</label></div>` }
                ]
              },
              {
                  groupName: '', labelPos: 'top', size: 6, isContainer: true, inputs: [
                  [
                    { field: 'invoiceNo', size: 4, label: 'Invoice Number', type: 'text' },
                    { field: 'postmarkDate', size: 4, label: 'Postmark Date', type: 'datepicker' },
                    { field: 'receivedDate', size: 4, label: 'Received Date', type: 'datepicker' }
                  ]
                ]
              }]
          ]
        }
      ],
      upload: () => {
        this.service.upload('Utilization/ImportClaimDataFile', this.formOptions.api.getModel()).subscribe((res:any) => {
          if (!res.error)
            this.fileName=res.msg;
            this.gridOptions.api.pager.firePageChange();
        });

      },
      updateAll: () => {
        this.activeProgram = this.formOptions.api.getModel().program;
        this.service.get( this.service.getUrl('Utilization/UpdateClaimProgramId',{programId:this.activeProgram, fileName:this.fileName}))
          .subscribe(res => {
            this.gridOptions.api.pager.firePageChange();
          });
      }
    }
  }

  private initGrid() {
    this.gridOptions = {
      pageSize: 10, linkPages: 20, crud: false, quickSearch: false, enableCellEditing: true,
      sspFn: this.loadData.bind(this), headerHeight: 60,
      columnDefs: [
        { headerName: 'Status', field: 'status', sort: true },
        { headerName: 'Line', field: 'line', sort: true },
        { headerName: 'PgmId', field: 'pgmId', sort: true, width: 120, type: 'select' },
        { headerName: 'State Cd', field: 'stateCd', type: 'text',  sort: true },
        { headerName: 'NDC11', field: 'ndc11', sort: true, type: 'text', width: 120 },
        { headerName: 'Period CoveredQYYYY', field: 'periodCoveredQYYYY', sort: true, type: 'number' },
        { headerName: 'Unit Rebate Amount', field: 'unitRebateAmount', sort: true, cellRenderer: row => this.formatData(row.unitRebateAmount, 1000000) },
        { headerName: 'Unit Reimbursed', field: 'unitReimbursed', sort: true, cellRenderer: row => this.formatData(row.unitReimbursed, 1000) },
        { headerName: 'Rebate Claimed Amount', width:200, field: 'rebateClaimedAmount', sort: true, cellRenderer: row => '$' + this.formatData(row.rebateClaimedAmount, 100) },
        { headerName: 'Script Cnt', field: 'scriptCnt', sort: true },
        { headerName: 'Medicaid Reimb Amount', field: 'medicaidReimbAmount', sort: true, cellRenderer: row => '$' + this.formatData(row.medicaidReimbAmount, 100) },
        { headerName: 'NonMedicaid Reimb Amount', field: 'nonMedicaidReimbAmount', sort: true, cellRenderer: row => '$' + this.formatData(row.nonMedicaidReimbAmount, 100) },
        { headerName: 'Total Reimb Amount', field: 'totalReimbAmount', sort: true, cellRenderer: row => '$' + this.formatData(row.totalReimbAmount, 100) },
        { headerName: 'Corr Flag', field: 'corrFlag', sort: true },
        { headerName: 'Error Description', field: 'errorDescription', sort: true }
      ]
    }
  }
  private formatData(val, divBy): any {
    return val.toString().indexOf('.') >= 0 ? val : val / divBy;
  }

  private onLoadFilter(form: any) {
    this.service.get('Utilization/GetProgramData').
      subscribe(res => {
        form.setData('program', res.data);
        this.gridOptions.api.grid.setDropdownData('pgmId', res.data);
      });

  }

  private initSaveForm() {
    this.saveFormOptions = {
      labelPos: 'left', refreshBy: {},
      inputs: [
        {
          type: 'groupLayout', items: [
            [{
              groupName: 'Validation', size: 3, inputs: [
                {
                  type: 'html', content: `
                    <label><input type="radio" name="validation"> Schedule now &nbsp;</label>
                    <label><input type="radio" name="validation"> Delay until 6pm &nbsp;</label>
                    <label><input type="radio" name="validation"> Do not schedule</label>
                  ` }]
            },
              {
                groupName: '', labelPos: 'top', size:6, isContainer: true, inputs: [
                  [
                    {
                      type: 'html', content: `<div style="padding:30px;">
                    <button type="button" class="btn btn-default">Error Check</button>&nbsp;
                    <button type="button" class="btn btn-default">Delete</button> <b style="width:50px;display:inline-block"></b>
                    <button type="button" (click)="config.save()" class="btn btn-default">Save</button>&nbsp;
                    <button type="button" class="btn btn-default">Close</button>
                    </div>
                    ` }

                  ]
                ]
              }]
          ]
        }
      ],
      save: () => {
        this.saveFormOptions.api.showMessage('Saved successfully');
        this.service.showMessage('Saved successfully');
      }
    };
  }
}
