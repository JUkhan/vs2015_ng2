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
const core_1 = require('@angular/core');
const platform_browser_1 = require('@angular/platform-browser');
const common_1 = require('@angular/common');
const http_1 = require('@angular/http');
const router_1 = require('@angular/router');
const app_component_1 = require('./app.component');
const home_component_1 = require('./home/home.component');
const shared_module_1 = require('./shared/shared.module');
const app_routes_1 = require('./app.routes');
let AppModule = class AppModule {
};
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            common_1.CommonModule,
            http_1.HttpModule,
            router_1.RouterModule,
            app_routes_1.routing,
            shared_module_1.SharedModule.forRoot()
        ],
        declarations: [app_component_1.AppComponent, home_component_1.HomeComponent],
        bootstrap: [app_component_1.AppComponent],
        providers: [{ provide: common_1.APP_BASE_HREF, useValue: '#' }]
    }), 
    __metadata('design:paramtypes', [])
], AppModule);
exports.AppModule = AppModule;
