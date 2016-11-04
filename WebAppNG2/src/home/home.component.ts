import {Component, OnInit, OnDestroy} from '@angular/core';
import {juForm, FormElement, FormOptions} from '../shared/juForm/juForm';
import {FV} from '../shared/juForm/FV';
import {MailComponent} from '../shared/app-ui/mail';
import {ReportViewerOpptions} from '../shared/app-ui/report.viewer';
import {SelectOptions} from '../shared/juForm/juSelect';
import {Observable} from 'rxjs/Rx';
import {Router} from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'my-home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy
{
    myGridOptions: any = {
        rowSelect: (row, isSelected) => console.log(row, isSelected),
        multiselect:true,
        columns: [
            { header: 'Name', field: 'name', },
            { header: 'Address', field: 'address' },
            { header: 'Age', field: 'age', textAlign:'right' }
        ]
    };
    myGridData = [
        { name: 'Abdulla', address: 'Borisal', age: 18 },
        { name: 'Abdul Rahim', address: 'Tangail', age: 23 },
        { name: 'Abdul Razzak', address: 'Borisal', age: 22 }
    ];
    changeGridRow()
    {
        this.myGridData[0].name = 'Abdulla-up';
        this.myGridData=this.myGridData.slice();
        console.log('Change done');
    }
    constructor(private router: Router)
    {
        
    }
    rvOptions: ReportViewerOpptions = <ReportViewerOpptions>{
        title: 'Hello World is nothing but mistery', approvedGroup: '2348567',  height:700, width:900,
        grid: {enableCellEditing:true,
            viewMode: '!panel', columnDefs: [
                { headerName: 'Name', field: 'name' },
                { headerName: 'Comment', field: 'comment', type:'ckeditor', width:700 }
            ]
        }
    };
    msg = 'say:Hello World...'; 
    dataList = [
        { text: 'Beautiful Bangladesg', value: 1, disabled: !true },
        { text: 'Pakistan', value: 2, style:'label label-danger label-important'},
        { text: 'India', value: 3 },
        { text: 'Barma', value: 4 },
        { text: 'China', value: 5, subText:'kungfu', description:'Seven start mantis kungfu'},
        { text: 'Japan', value: 6, icon:'film' },
        { text: 'South Kowria', value: 7, icon:'heart' },
        { text: 'USA', value: 8 },
        { text: 'UK', value: 9 },
        { text: 'Austrlia', value: 10 }
    ];
    mySelectOptions: SelectOptions;
    attachmentList: any[] = [
        { name: 'Abdulla', description:'description'},
         { name: 'Jamil', description:'description'}
    ]
    ngOnInit() {
        this.initForm();
        this.mySelectOptions = {
            title: 'Select item', disabled: !true, fitWidth: true, liveSearch: true, checkAll: true,
            height: 250, multiselect: true, selectedTextFormat: 'count>2', editable:!true
        };
        
    }
    ngOnDestroy() { }
    myOptions: FormOptions;
    
    initForm()
    {         
        this.myOptions = {
            viewMode:'panel', panelMode:'primary',
            labelPos: 'left', title: 'Complex Form Example',
            labelSize: 2,
            refreshBy: { products: [{ name: 'Jasim', price: 2 }, { name: 'JArif' }], address1: {}, address2: {}, aboutMe:'I love c#' },           
            tabs: {
                'Tab-1': [
                    {
                        type: 'groupLayout', items: [
                            [{
                                groupName: 'Group-1', size: 8, inputs: [
                                    <FormElement>{ field: 'name', label: 'Name1', type: 'file', validators: [FV.required, FV.minLength(5)] },
                                    { field: 'country', change: e => console.log(e), label: 'Country', type: 'juSelect', validators: FV.required },
                                    { field: 'address', label: 'Address', type: 'text', validators: FV.required },
                                    [{ field: 'age', labelSize: 4, size: 6 }, { field: 'address1.post', label: 'Post', type: 'datepicker', size: 4, offset: 2, validators: FV.required }],
                                    { field: 'Gender', label: 'Gender', type: 'juSelect', data: [{ text: 'Male', value: 1 }, { text: 'Female', value: 2 }], options:<SelectOptions>{title:'Select gender'} },
                                    { field: 'description', label: 'Description', type: 'textarea' }
                                ]
                            },
                                {
                                    groupName: 'Group-2', size: 4, labelPos: 'top', isContainer: true, items: [
                                        [{
                                            groupName: 'Address1', labelSize: 4, exp: '[ngStyle]="config.disappear(model.country)"', size: 12, inputs: [
                                                { field: 'address1.name', label: 'Name', type: 'text' },
                                                { field: 'address1.country', label: 'Country', type: 'juSelect', options: {width:'100%', title:'Select address'} }
                                            ]
                                        },
                                            {
                                                groupName: 'Address2', labelPos: 'top', size: 12, inputs: [
                                                    <FormElement>{ field: 'address2.name', label: 'Name', type: 'text' },
                                                    { field: 'address2.country',  label: 'Country', type: 'juSelect', options:<SelectOptions>{title:'Nothing selected', multiselect:true}}
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
                                    field: 'district', size: 3, label: 'District', validators: FV.required, search: true, change: this.changeThana, type: 'juSelect',
                                    data: [{ text: 'Tangail', value: 1, subText: 'Rx', description: 'Async data streaming with observable' }, { text: 'Unknown', value: 2 }]
                                },
                                { field: 'Thana', label:'Thana', size: 3, type: 'juSelect', validators: FV.required }
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
                        this.myOptions.api.setModel({ country:1, address:'tangail', products: [{ name: 'Jasim', price: 2 }, { name: 'JArif', price: 34 }, { name: 'Abdulla', price: 134, district: 1, Thana: 2 }], address1: { post: '07/14/2016' }, address2: {country:2}, aboutMe: 'I love JS' });
                      
                    }
                }
            },
            disappear: (val) => ({ display: val ? +val === 1 ? 'block' : 'none' : 'block' }),
        };
    }


    myFormLoad(form: juForm)
    {
        
        form.setData('country', [{ text: 'Bangladesh', value: 1 }, { text: 'India', value: 2 }])
            .setData('address1.country', [{ text: 'Bangladesh', value: 1 }, { text: 'India', value: 2 }])
            .setData('address2.country', [{ text: 'Bangladesh', value: 1 }, { text: 'India', value: 2 }])
            .setLabel('age', 'Age').setLabel('aboutMe', 'Ambot Me');

        //form.valueChanges('address')       
        //.subscribe(res=>console.log(res));
        form.valueChanges('form').filter(_ => form.valid)
            .subscribe(res => console.log(res));
		 form.valueChanges('name')
            .subscribe(res => console.log(res));	
         //form.disabled('address1.country', true);
         
    }
    
    changeThana(e) {
        if (e.value && e.value == 1) {
            e.form.setData('Thana', [{ text: 'asd', value: 1 }, { text: 'MXZ', value: 2 }]);
        }
        else if (e.value && e.value == 2) {
            e.form.setData('Thana', [{ text: 'suna', value: 1 }, { text: 'kotha', value: 2 }]);
        }
    }
    attach: string = 'sss';
    mailList: any[]=[];
    mailLoad(mail: MailComponent)
    {
        mail.setAttachment('helloq.zip');
        mail.setMailList([{ text: 'jasim@gmail.com', value: 'jasim@gmail.com' }, { text: 'arif@gmail.com', value: 'arif@gmail.com' }]);
    }
    mailData(model)
    {
        console.log(model);
    }
}

