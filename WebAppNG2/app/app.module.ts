import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { CommonModule, APP_BASE_HREF }        from '@angular/common';
import { HttpModule, JsonpModule } from '@angular/http';
import { ROUTER_DIRECTIVES, RouterModule } from '@angular/router';
import { provideRouter, RouterConfig } from '@angular/router';

import { AppComponent }  from './app.component';
import { HomeComponent } from './home/home.component';

//modules
import { SharedModule }   from './shared/shared.module';

import {routing} from './app.routes';


@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        HttpModule,
        RouterModule,
        routing,
        SharedModule.forRoot()        
    ],
    declarations: [AppComponent, HomeComponent],
    bootstrap: [AppComponent],
    providers: [{ provide: APP_BASE_HREF, useValue: '#' }]
})
export class AppModule { }
