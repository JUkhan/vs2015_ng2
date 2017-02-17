
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { juForm, FormElement, FormOptions } from '../shared/juForm/juForm';
import { SetupProfileSubModule } from './SetupProfileSubModule/SetupProfileSub.module';
import { ProfileDetails } from './SetupProfileSubModule/ProfileDetails';
import { COT } from './SetupProfileSubModule/COT';
import { Estimation } from './SetupProfileSubModule/Estimation';
import { Matrix } from './SetupProfileSubModule/Matrix';
import { RelatedProducts } from './SetupProfileSubModule/RelatedProducts';
import { Transaction } from './SetupProfileSubModule/Transaction';
import { Variables } from './SetupProfileSubModule/Variables';
import { Exclusion } from './SetupProfileSubModule/Exclusion';
import { Products } from './SetupProfileSubModule/Products';

import {Store} from '../Store';

@Component({
    moduleId: module.id,
    selector: 'ps',
    template: `
      <div><h5>HCRS Dev > Medicaid > Setup Profile</h5></div>
    <div juForm (onLoad)="loadForm($event)" [options]="options"></div>`
})
export class SetupProfile implements OnInit, OnDestroy {
    protected options: FormOptions;
    protected form: juForm;
    status: string = 'none';
    profileDetails: ProfileDetails;
    products: Products;
    constructor(private route: ActivatedRoute, private store:Store) {
        this.store.dispatch({type:'NONE'});
        this.status = route.snapshot.data['status'];
        this.initForm();
    }
    public ngOnInit() {

    }
    public ngOnDestroy() {

    }
    protected initForm() {
        this.options = {
            viewMode: 'form', modules: [SetupProfileSubModule], tabClick:this.tabClick.bind(this),
            tabs: {
                'Profile Details': [{ type: 'html', content: '<profile-details (onLoad)="config.loadProfileDetails($event)"></profile-details>' }],
                'Products': [{ type: 'html', content: '<products (onLoad)="config.loadProducts($event)"></products>' }],
                'Classes of Trade': [{ type: 'html', content: '<trade></trade>' }],
                'COT Exceptions': [{ type: 'html', content: '<cot></cot>' }],
                'Transaction Types': [{ type: 'html', content: '<transaction></transaction>' }],
                'Matrix Exceptions': [{ type: 'html', content: '<matrix></matrix>' }],
                'Related Products': [{ type: 'html', content: '<related-products></related-products>' }],
                'Exclusions': [{ type: 'html', content: '<exclusion></exclusion>' }],
                'Variables': [{ type: 'html', content: '<variables></variables>' }]
            },
            loadProfileDetails: (pd: ProfileDetails) => {
                this.profileDetails = pd;
            },
            loadProducts:(product: Products)=> {                
                this.products = product;
            }
        }
    }
    protected loadForm(form: juForm) {
        this.form = form;
        console.log('formLoaded');
    }
    protected tabClick(tabName){
        switch(tabName){
            case 'Products': this.products.onDemand();break;
            
        }
    }

}