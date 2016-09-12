import { Component } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'my-app',
    templateUrl: './app.component.html'
})
export class AppComponent {
    menuData: any[];
    ngOnInit() {        
        this.setMenu();
    }
    private setMenu() {
        this.menuData = [
            { name: 'Home', link: 'home', icon: 'fa fa-home' },            
            { name: 'CRUD', link: 'setting', icon: 'fa fa-home' },
            { name: 'Tree View', link: 'setting/treeView', icon: 'fa fa-home' },
            { name: 'Cell Edit', link: 'setting/cellEdit', icon: 'fa fa-home' },
            {
                name: 'Settings',  icon: 'fa fa-gear', items: [
                    { name: 'CRUD Example', link: 'setting', icon: 'fa fa-home' },
                    { name: 'Upload', link: 'setting/upload', icon: 'fa fa-home' }
                ]
            },
        ];
    }
 }
