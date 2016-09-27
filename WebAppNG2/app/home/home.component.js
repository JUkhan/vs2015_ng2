"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var FV_1 = require('../shared/juForm/FV');
var HomeComponent = (function () {
    function HomeComponent() {
        this.msg = 'say:Hello World...';
        this.dataList = [
            { text: 'Beautiful Bangladesg', value: 1, disabled: !true },
            { text: 'Pakistan', value: 2, style: 'label label-danger label-important' },
            { text: 'India', value: 3 },
            { text: 'Barma', value: 4 },
            { text: 'China', value: 5, subText: 'kungfu', description: 'Seven start mantis kungfu' },
            { text: 'Japan', value: 6, icon: 'film' },
            { text: 'South Kowria', value: 7, icon: 'heart' },
            { text: 'USA', value: 8 },
            { text: 'UK', value: 9 },
            { text: 'Austrlia', value: 10 }
        ];
    }
    HomeComponent.prototype.ngOnInit = function () {
        this.initForm();
        this.mySelectOptions = {
            title: 'Select item', disabled: !true, fitWidth: true, liveSearch: true, checkAll: true,
            height: 250, multiselect: true, selectedTextFormat: 'count>2'
        };
    };
    HomeComponent.prototype.ngOnDestroy = function () { };
    HomeComponent.prototype.initForm = function () {
        var _this = this;
        this.myOptions = {
            viewMode: 'panel', panelMode: 'primary',
            labelPos: 'left', title: 'Complex Form Example',
            labelSize: 2,
            refreshBy: { products: [{ name: 'Jasim', price: 2 }, { name: 'JArif' }], address1: {}, address2: {}, aboutMe: 'I love c#' },
            tabs: {
                'Tab-1': [
                    {
                        type: 'groupLayout', items: [
                            [{
                                    groupName: 'Group-1', size: 8, inputs: [
                                        { field: 'name', label: 'Name1', type: 'file', validators: [FV_1.FV.required, FV_1.FV.minLength(5)] },
                                        { field: 'country', change: function (e) { return console.log(e); }, label: 'Country', type: 'juSelect', validators: FV_1.FV.required },
                                        { field: 'address', label: 'Address', type: 'text', validators: FV_1.FV.required },
                                        [{ field: 'age', labelSize: 4, size: 6 }, { field: 'address1.post', label: 'Post', type: 'datepicker', size: 4, offset: 2, validators: FV_1.FV.required }],
                                        { field: 'Gender', label: 'Gender', type: 'juSelect', data: [{ text: 'Male', value: 1 }, { text: 'Female', value: 2 }], options: { title: 'Select gender' } },
                                        { field: 'description', label: 'Description', type: 'textarea' }
                                    ]
                                },
                                {
                                    groupName: 'Group-2', size: 4, labelPos: 'top', isContainer: true, items: [
                                        [{
                                                groupName: 'Address1', labelSize: 4, exp: '[ngStyle]="config.disappear(model.country)"', size: 12, inputs: [
                                                    { field: 'address1.name', label: 'Name', type: 'text' },
                                                    { field: 'address1.country', label: 'Country', type: 'juSelect' }
                                                ]
                                            },
                                            {
                                                groupName: 'Address2', labelPos: 'top', size: 12, inputs: [
                                                    { field: 'address2.name', label: 'Name', type: 'text' },
                                                    { field: 'address2.country', label: 'Country', type: 'juSelect', options: { title: 'Nothing selected', multiselect: true } }
                                                ]
                                            }]
                                    ]
                                }],
                            {
                                groupName: 'Group-3', isContainer: true, tabs: {
                                    Oxygen: [{ field: 'oxygen', label: 'Oxygen', type: 'text', }],
                                    h20: [
                                        { field: 'h20', label: 'H20', type: 'text' },
                                        { tabConfig: true, enable: function (form, model) { return !!model.oxygen; } }
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
                                    { field: 'name', size: 2, label: 'Name', type: 'text', validators: [FV_1.FV.required, FV_1.FV.minLength(5)] },
                                    { field: 'price', size: 3, label: 'Price', type: 'number', validators: [FV_1.FV.required] },
                                    {
                                        field: 'district', size: 3, label: 'District', validators: FV_1.FV.required, search: true, change: this.changeThana, type: 'juSelect',
                                        data: [{ text: 'Tangail', value: 1, subText: 'Rx', description: 'Async data streaming with observable' }, { text: 'Unknown', value: 2 }]
                                    },
                                    { field: 'Thana', size: 3, type: 'select', validators: FV_1.FV.required }
                                ]],
                            remove: function (model) {
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
                'Save Changes': { type: 'submit', cssClass: 'btn btn-success', click: function (_) { console.log(_this.myOptions.api.getModel()); } },
                'Set Data': {
                    type: 'button', click: function () {
                        _this.myOptions.api.setModel({ products: [{ name: 'Jasim', price: 2 }, { name: 'JArif', price: 34 }, { name: 'Abdulla', price: 134, district: 1, Thana: 2 }], address1: { post: '07/14/2016' }, address2: { country: 2 }, aboutMe: 'I love JS' });
                    }
                }
            },
            disappear: function (val) { return ({ display: val ? +val === 1 ? 'block' : 'none' : 'block' }); },
        };
    };
    HomeComponent.prototype.myFormLoad = function (form) {
        form.setData('country', [{ text: 'Bangladesh', value: 1 }, { text: 'India', value: 2 }])
            .setData('address1.country', [{ text: 'Bangladesh', value: 1 }, { text: 'India', value: 2 }])
            .setData('address2.country', [{ text: 'Bangladesh', value: 1 }, { text: 'India', value: 2 }]);
        form.valueChanges('form').filter(function (_) { return form.valid; })
            .subscribe(function (res) { return console.log(res); });
    };
    HomeComponent.prototype.changeThana = function (e) {
        if (e.value && e.value == 1) {
            e.form.setData('Thana', [{ name: 'asd', value: 1 }, { name: 'MXZ', value: 2 }]);
        }
        else if (e.value && e.value == 2) {
            e.form.setData('Thana', [{ name: 'suna', value: 1 }, { name: 'kotha', value: 2 }]);
        }
    };
    HomeComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'my-home',
            templateUrl: './home.component.html'
        }), 
        __metadata('design:paramtypes', [])
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=home.component.js.map