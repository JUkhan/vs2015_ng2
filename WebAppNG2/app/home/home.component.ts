import {Component, OnInit, OnDestroy} from '@angular/core';
import {juForm} from '../shared/juForm/juForm';
import {FV} from '../shared/juForm/FV';
import {FormOptions, FormElement} from '../shared/juForm/juForm.d';
@Component({
    moduleId: module.id,
    selector: 'my-home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
    msg = 'say:Hello World...';
    ngOnInit() {
        this.initForm();
    }
    ngOnDestroy() { }
    myOptions: any;
    
    initForm() {

        this.myOptions = {
            labelPos: 'left', title: 'Complex Form Example',
            labelSize: 2,
            refreshBy: { products: [{ name: 'Jasim', price: 2 }, { name: 'JArif' }], address1: {}, address2: {} },           
            tabs: {
                'Tab-1': [
                    {
                        type: 'groupLayout', items: [
                            [{
                                groupName: 'Group-1', size: 8, inputs: [
                                    <FormElement>{ field: 'name', label: 'Name1', type: 'file', validators: [FV.required, FV.minLength(5)] },
                                    { field: 'country', change: e => console.log(e), label: 'Country', type: 'select', validators: FV.required },
                                    { field: 'address', label: 'Address', type: 'text', validators: FV.required },
                                    [{ field: 'age', labelSize: 4, size: 6 }, { field: 'address1.post', label: 'Post', type: 'datepicker', size: 4, offset: 2, validators: FV.required }],
                                    { field: 'Gender', label: 'Gender', type: 'select', data: [{ name: 'Male', value: 1 }, { name: 'Female', value: 2 }] },
                                    { field: 'description', label: 'Description', type: 'textarea' }
                                ]
                            },
                                {
                                    groupName: 'Group-2', size: 4, labelPos: 'top', isContainer: true, items: [
                                        [{
                                            groupName: 'Address1', labelSize: 4, exp: '[ngStyle]="config.disappear(model.country)"', size: 12, inputs: [
                                                { field: 'address1.name', label: 'Name', type: 'text' },
                                                { field: 'address1.country', label: 'Country', type: 'select' }
                                            ]
                                        },
                                            {
                                                groupName: 'Address2', labelPos: 'top', size: 12, inputs: [
                                                    <FormElement>{ field: 'address2.name', label: 'Name', type: 'text' },
                                                    { field: 'address2.country', viewMode: 'checkbox', label: 'Country', type: 'juSelect' }
                                                ]
                                            }]
                                    ]
                                }],
                            {
                                groupName: 'Group-3', isContainer: true, tabs: {
                                    Oxygen: [{ field: 'oxygen', label: 'Oxygen', type: 'text', }],
                                    h20: [
                                        { field: 'h20', label: 'H20', type: 'text' },
                                        { tabConfig: true, enable: (form, model) => { return !!model.oxygen; } }
                                    ]
                                }
                            }

                        ]
                    }
                ],
                'Tab-2': [
                    {
                        field: 'products', type: 'detail', detailInfo: '<b>Detail Info or action button if needed</b>', search: true, options: {
                            refreshBy: { name: 'Abdulla' }, filter: ['name', 'price'],
                            inputs: [[
                                { type: 'html', content: '<div style="width:20px" class="col-md-1"><a href="javascript:;" style="position:relative;top:30px" (click)="config.remove(model)"><b class="fa fa-remove" title="Remove the item" ></b></a></div>' },
                                { field: 'name', size: 2, label: 'Name', type: 'text', validators: [FV.required, FV.minLength(5)] },
                                { field: 'price', size: 3, label: 'Price', type: 'number', validators: [FV.required] },
                                {
                                    field: 'district', size: 3, label: 'District', validators: FV.required, search: true, change: this.changeThana, type: 'juSelect', viewMode: 'select',
                                    data: [{ name: 'Tangail', value: 1, subtitle: 'Rx', description: 'Async data streaming with observable' }, { name: 'Unknown', value: 2 }]
                                },
                                { field: 'Thana', size: 3, type: 'select', validators: FV.required }
                            ]],
                            remove: (model) => {
                                if (confirm('Are you sure to remove this item?')) {
                                    model.removed = true;
                                }
                                console.log(model);
                            }
                        }
                    }
                ],
                'Tab-3': [
                    { field: 'aboutMe', type: 'ckeditor' },
                    { type: 'html', content: 'under construction....' }
                ]
            },
            buttons: {
                'Save Changes': { type: 'submit', cssClass: 'btn btn-success', click: _ => { console.log(this.myOptions.api.getModel()); } },
                'Set Data': {
                    type: 'button', click: () => {
                        this.myOptions.api.setModel({ products: [{ name: 'Jasim', price: 2 }, { name: 'JArif', price: 34 }, { name: 'Abdulla', price: 134, district: 1, Thana: 2 }], address1: { post: '07/14/2016' }, address2: {}, aboutMe: 'I love JS' });

                    }
                }
            },
            disappear: (val) => ({ display: val ? +val === 1 ? 'block' : 'none' : 'block' }),
        };
    }


    myFormLoad(form: juForm) {
        form.setData('country', [{ name: 'Bangladesh', value: 1 }, { name: 'India', value: 2 }])
            .setData('address1.country', [{ name: 'Bangladesh', value: 1 }, { name: 'India', value: 2 }])
            .setData('address2.country', [{ name: 'Bangladesh', value: 1 }, { name: 'India', value: 2 }]);

        //form.valueChanges('address')       
        //.subscribe(res=>console.log(res));
        form.valueChanges('form').filter(_ => form.valid)
            .subscribe(res => console.log(res));
    }

    changeThana(e) {
        if (e.value && e.value == 1) {
            e.form.setData('Thana', [{ name: 'asd', value: 1 }, { name: 'MXZ', value: 2 }]);
        }
        else if (e.value && e.value == 2) {
            e.form.setData('Thana', [{ name: 'suna', value: 1 }, { name: 'kotha', value: 2 }]);
        }
    }
}

