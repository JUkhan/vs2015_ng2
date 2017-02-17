import { Component } from '@angular/core';
import { juGrid, GridOptions}                   from '../../../shared/juGrid/juGrid';
import { juForm, FormOptions, FormElement}                   from '../../../shared/juForm/juForm';
import {Store} from '../../../Shared/Store/Store';
import {PriceActions} from './Reducers/PriceActions';
import {EffectsSubscription} from '../../../Shared/Store/effects-subscription';
import {Observable, Subscription} from 'rxjs/Rx';
import {ProductPriceService} from './ProductPriceService';
@Component({
    moduleId: module.id,
    selector: 'product-family-brand-tab',   
    template: `<div><h5>HCRS Dev &gt; Data Maintenance &gt; Product Price [ {{getPermission()}} ]</h5></div>
            <div juForm (onLoad)="loadForm($event)" [options]="formOptions" style="width:1000px"></div>
            <div style="padding-left:15px;"><b>Price Overrides of Default Price Type Amounts</b></div>
            <div  class="juGrid" [options]="gridOptions" [data]="gridData" (onLoad)="loadGrid($event)"></div>
            <div style="padding-left:810px;padding-top:10px">
                <button type="button" class="btn btn-primary" (click)="save()">Save</button>
                <button type="button" class="btn btn-primary" (click)="add()">Add</button>
                <button type="button" class="btn btn-primary" (click)="delete()">Delete</button>
            </div>
            `,
    styles: [`.tbl-body-content{min-height:500px;} .juGrid{padding-left:15px;}`]
})
export class ProductPrice {
    private form: juForm;
    private grid: juGrid;
    private formOptions: FormOptions;
    private gridOptions: GridOptions;
    private subs: Subscription[] = []; gridData=[];
    constructor(private store: Store, private actions: PriceActions, private service: ProductPriceService, private es: EffectsSubscription) {
        this.initUI();
        //this.store.dispatch(this.actions.init());
        this.store.select('intro').subscribe(res => console.log('subs', res));
       
    }
    ngOnDestroy() {
        this.subs.forEach(_ => _.unsubscribe());
        this.es.ngOnDestroy();
    }
    private loadGrid(grid: juGrid) {
        this.grid = grid;
    }

    private loadForm(form: juForm) {
        this.form = form;
        this.loadFormData();
    }

    private getPermission() {
        return 'Maintenance';
    }
    private loadFormData()
    {
        this.service.loadPrice().subscribe(res => this.form.setData('find.price', res));
        this.service.loadFiendLabeler().subscribe(res=>this.form.setData('find.labeler',res));
        this.service.loadSearchLabeler().subscribe(res=>this.form.setData('search.labeler',res));
    }
    private initUI() {
        this.initForm().initGrid();
    }
    private initForm() {
        this.formOptions = {
            viewMode: 'form', labelPos: 'left', refreshBy: { find: {}, search: {}, findFlag:true, searchFlag:true},
            inputs: [
                {
                    type: 'groupLayout', items: [
                        [
                            {
                                groupName: 'Price Type', size: 6, inputs: [
                                    [{ field: 'find.price', label: 'Price', size: 7, change: obj => this.form.getModel().findFlag = false,  type: 'juSelect', options: { width: '100%' } }],
                                    [
                                        { field: 'find.labeler', label: 'Labeler', type: 'juSelect', size: 7 },
                                        { label: 'Fiend', offset: 2, exp: `class="btn btn-primary" [disabled]="model.findFlag"`, type: 'button', size: 2, click:this.find.bind(this) }
                                    ],
                                    [{ field: 'find.history', label: 'Show History', type: 'checkbox', exp: `style="margin-left:12px"` }],
                                    {type:'html', content:'<div style="height:18px">&nbsp;</div>'}
                                ]                               
                            },
                            {
                                groupName: 'NDC', size: 6, inputs: [
                                    [{ field: 'search.labeler', label: 'Labeler', size: 7, type: 'juSelect', options: { width: '100%' } }],
                                    [{ field: 'search.product', label: 'product', type: 'text', size: 7 } ],
                                    [
                                        { field: 'search.package', label: 'Package', type: 'text', size: 7 },
                                        { label: 'Search', offset: 2, exp: `class="btn btn-primary"`, type: 'button', size: 2, click: this.search.bind(this) }
                                    ]
                                ]
                            }
                        ]
                        
                    ]
                }
            ]
        };
        return this;
    }
           
    private initGrid() {
        
        this.gridOptions = {
            viewMode: '!panel', noPager: true, pageSize: 10000,enableCellEditing:true,
            columnDefs: [
                { headerName: 'Labeler', field: 'NDC_LBL', width: 120, sort: true },
                { headerName: 'Prod', field: 'NDC_PROD', width: 120, sort: true },
                { headerName: 'Pckg', field: 'NDC_PCKG', width: 120, sort: true },
                { headerName: 'Product Name', field: 'PROD_NM', width: 240, sort: true },
                { headerName: 'Effective', field: 'EFF_DT', width: 120, sort: true },
                { headerName: 'End', field: 'END_DT', width: 120, sort: true },
                { headerName: 'Price Ampunt', field: 'PRICE_AMT', width: 120, sort: true }
            ]
        };
        return this;
    }
    private save() { }
    private add() { }
    private delete() { }
    private find() {
        const model=this.form.getModel();
        console.log(model);

     }
    private search() { }
}