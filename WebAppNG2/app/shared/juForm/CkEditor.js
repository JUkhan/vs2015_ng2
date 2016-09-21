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
var CkEditor = (function () {
    function CkEditor(el) {
        this.el = el;
        this.config = {};
    }
    CkEditor.prototype.ngOnInit = function () {
        this.config.api = CKEDITOR.replace(this.el.nativeElement);
    };
    CkEditor.prototype.ngOnDestroy = function () { };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], CkEditor.prototype, "config", void 0);
    CkEditor = __decorate([
        core_1.Directive({
            selector: '[ckeditor]'
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], CkEditor);
    return CkEditor;
}());
exports.CkEditor = CkEditor;
var FileSelect = (function () {
    function FileSelect(element) {
        this.element = element;
    }
    FileSelect.prototype.onChangeFile = function () {
        if (!this.model.FILES) {
            this.model.FILES = {};
        }
        this.setFileNames();
    };
    FileSelect.prototype.setFileNames = function () {
        var fileList = this.element.nativeElement.files;
        if (fileList.length == 0) {
            console.log(this.element.nativeElement);
            return '';
        }
        var filesName = [];
        var files = [];
        for (var index = 0; index < fileList.length; index++) {
            if (this.hasValidExt(fileList.item(index).name)) {
                filesName.push(fileList.item(index).name);
                files.push(fileList.item(index));
            }
        }
        this.model[this.propName] = filesName.join(';');
        this.model.FILES[this.propName] = files;
        this.form.componentRef.instance
            .vlidate_input(filesName.join(';'), this.config);
    };
    FileSelect.prototype.hasValidExt = function (name) {
        if (this.ext && this.ext.length > 0) {
            var res = this.ext.filter(function (ex) { return name.endsWith(ex); });
            return res && res.length > 0;
        }
        return true;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], FileSelect.prototype, "model", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], FileSelect.prototype, "propName", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], FileSelect.prototype, "ext", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], FileSelect.prototype, "config", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], FileSelect.prototype, "form", void 0);
    __decorate([
        core_1.HostListener('change'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], FileSelect.prototype, "onChangeFile", null);
    FileSelect = __decorate([
        core_1.Directive({ selector: '[fileSelect]' }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], FileSelect);
    return FileSelect;
}());
exports.FileSelect = FileSelect;
//# sourceMappingURL=CkEditor.js.map