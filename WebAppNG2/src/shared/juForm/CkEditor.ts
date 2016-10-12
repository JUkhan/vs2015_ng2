import {Directive, OnInit, Input, ElementRef, OnDestroy, AfterViewInit, HostListener} from '@angular/core';

declare var CKEDITOR: any;
@Directive({
    selector: '[ckeditor]'
})
export class CkEditor implements OnInit, OnDestroy {
    @Input() config: any = {};

    constructor(private el: ElementRef) { }
    ngOnInit() {
        this.config.api = CKEDITOR.replace(this.el.nativeElement);
    }
    ngOnDestroy() { }
}

@Directive({ selector: '[fileSelect]' })
export class FileSelect {
    @Input() model: any;
    @Input() propName: string;
    @Input() ext: Array<string>;
    @Input() config: any;
    @Input() form: any;
   
    constructor(private element: ElementRef) {
       
    }

    @HostListener('change')
    onChangeFile() {
        if (!this.model.FILES) {
            this.model.FILES = {};
        }        
        this.setFileNames();
    }    
    setFileNames() {       
        let fileList: FileList = this.element.nativeElement.files;
        if (fileList.length == 0)
        {
            console.log(this.element.nativeElement);
            return '';
        }
        let filesName: Array<string> = [];
        let files:Array<File>=[];
        for (var index = 0; index < fileList.length; index++) {
            if (this.hasValidExt(fileList.item(index).name)) {
                filesName.push(fileList.item(index).name);
                files.push(fileList.item(index));
            }
        }
        this.model[this.propName] = filesName.join(';');
        this.model.FILES[this.propName]=files;
        this.form.componentRef.instance
                        .vlidate_input(filesName.join(';'), this.config);
    }
    hasValidExt(name: string) {
        if (this.ext && this.ext.length > 0) {
            let res=this.ext.filter(ex=>name.endsWith(ex));
            return res && res.length>0;
        }
        return true;
    }
}