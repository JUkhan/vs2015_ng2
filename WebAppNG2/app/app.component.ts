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
            {
                name: 'Settings',  icon: 'fa fa-gear', items: [
                    { name: 'Grid', link: 'setting', icon: 'fa fa-home' },
                    { name: 'Upload', link: 'setting/upload', icon: 'fa fa-home' }
                ]
            },
            { name: 'Claim', link: 'setting/claim', icon: 'fa fa-home' },
        ];
    }
 }
