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
var compiler_1 = require('@angular/compiler');
var juFormBuilder = (function () {
    function juFormBuilder(compiler) {
        this.compiler = compiler;
        this._cacheOfFactories = {};
    }
    juFormBuilder.prototype.getTemplate = function (options) {
        return "<h3>Dynamic form</h3>";
    };
    juFormBuilder.prototype.createComponentFactory = function (options) {
        var _this = this;
        var factory = this._cacheOfFactories[options];
        if (factory) {
            console.log("Module and Type are returned from cache");
            return new Promise(function (resolve) {
                resolve(factory);
            });
        }
        var type = this.createNewComponent(this.getTemplate(options));
        var module = this.createComponentModule(type);
        return new Promise(function (resolve) {
            _this.compiler
                .compileModuleAndAllComponentsAsync(module)
                .then(function (moduleWithFactories) {
                factory = _.find(moduleWithFactories.componentFactories, { componentType: type });
                _this._cacheOfFactories[options] = factory;
                resolve(factory);
            });
        });
    };
    juFormBuilder.prototype.createNewComponent = function (tmpl) {
        var DynamicFormComponent = (function () {
            function DynamicFormComponent() {
            }
            __decorate([
                core_1.Input(), 
                __metadata('design:type', Object)
            ], DynamicFormComponent.prototype, "entity", void 0);
            DynamicFormComponent = __decorate([
                core_1.Component({
                    selector: 'dynamic-form',
                    template: tmpl,
                }), 
                __metadata('design:paramtypes', [])
            ], DynamicFormComponent);
            return DynamicFormComponent;
        }());
        ;
        return DynamicFormComponent;
    };
    juFormBuilder.prototype.createComponentModule = function (componentType) {
        var RuntimeComponentModuleForJuForm = (function () {
            function RuntimeComponentModuleForJuForm() {
            }
            RuntimeComponentModuleForJuForm = __decorate([
                core_1.NgModule({
                    imports: [],
                    declarations: [
                        componentType
                    ],
                }), 
                __metadata('design:paramtypes', [])
            ], RuntimeComponentModuleForJuForm);
            return RuntimeComponentModuleForJuForm;
        }());
        return RuntimeComponentModuleForJuForm;
    };
    juFormBuilder = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [compiler_1.RuntimeCompiler])
    ], juFormBuilder);
    return juFormBuilder;
}());
exports.juFormBuilder = juFormBuilder;
//# sourceMappingURL=juForm.builder.js.map