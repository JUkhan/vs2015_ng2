
import {Component} from '@angular/core';

@Component({
    moduleId: module.id,
    selector: '.renderer',
    template:'<span style="color:red">ren:</span><ng-content></ng-content>'
})
export class Renderer {
    constructor() {
        console.log('render...');
    }
}