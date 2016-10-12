import { Component } from '@angular/core';
import { MessageDialog }   from './shared/app-ui/message.dialog';
import { ConfirmDialog }   from './shared/app-ui/confirm.dialog';
import {AppService} from './shared/app.service'
@Component({
    moduleId: module.id,
    selector: 'my-app',
    templateUrl: './app.component.html'
})
export class AppComponent {
    menuData: any[];
    constructor(private service: AppService) { }
    ngOnInit() {        
        this.setMenu();
        this.service.notifier$.subscribe(it =>
        {
            switch (it.key)
            {
                case 'messageDialog':
                    this.messageDialog.showDialog(it.value.title, it.value.message);
                    break;
                case 'confirmDialog':
                    this.confirmDialog.showDialog(it.value.title, it.value.message, it.value.yesCallback, it.value.noCallback);
                    break;               
            }
        });
    }
    private setMenu() {
        this.menuData = [
            { name: 'Home', link: 'home', icon: 'fa fa-home' },            
            { name: 'CRUD', link: 'setting', icon: 'fa fa-home' },
            { name: 'Tree View', link: 'setting/treeView', icon: 'fa fa-home' },
            { name: 'Cell Edit', link: 'setting/cellEdit', icon: 'fa fa-home' },
            { name: 'Window', link: 'setting/window', icon: 'fa fa-home' },
            {
                name: 'Settings',  icon: 'fa fa-gear', items: [
                    { name: 'CRUD Example', link: 'setting', icon: 'fa fa-home' },
                    { name: 'Upload', link: 'setting/upload', icon: 'fa fa-home' }
                ]
            },
        ];
    }
    private messageDialog: MessageDialog;
    private confirmDialog: ConfirmDialog;
    private messageLoad(message: MessageDialog)
    {
        this.messageDialog = message;
    }
    
    private confirmLoad(confirm: ConfirmDialog)
    {
        this.service.confirmDialogInstance=confirm;
        this.confirmDialog = confirm;
    }
 }
