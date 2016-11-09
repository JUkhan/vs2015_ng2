import {Component, ComponentFactory, NgModule, Input, Injectable, ElementRef} from '@angular/core';
import {RuntimeCompiler} from '@angular/compiler';
import { CommonModule }         from '@angular/common';
import { FormsModule }          from '@angular/forms';
@Injectable()
export class GridBuilder
{
    private options: any;
    constructor(protected compiler: RuntimeCompiler) { }
    protected getTemplate(): string
    {
        let tpl: any[] = [];
        tpl.push('<div>Hello Grid...</div>');
        return tpl.join('');
    }
    public createComponentFactory(options: any) : Promise<ComponentFactory<any>>
    {
        this.options = options;        
        const type = this.createNewComponent(this.getTemplate());
        const module = this.createComponentModule(type);

        return new Promise((resolve) =>
        {
            this.compiler
                .compileModuleAndAllComponentsAsync(module)
                .then((moduleWithFactories) =>
                {                    
                    resolve(moduleWithFactories.componentFactories.find(_ => _.componentType === type));
                });
        });
    }
    protected createNewComponent(tmpl: string)
    {
        @Component({
            selector: 'dynamic-grid2',
            template: tmpl,
        })
        class DynamicGridComponent2
        {
            
        }
        return DynamicGridComponent2;
    }
    protected createComponentModule(componentType: any)
    {
        const childComponents: any[] = this.options.childComponents || [];
        @NgModule({
            imports: [ CommonModule, FormsModule ],
            declarations: [componentType, ...childComponents],
        })
        class RuntimeComponentModuleForGrid
        {
        }
        return RuntimeComponentModuleForGrid;
    } 
}