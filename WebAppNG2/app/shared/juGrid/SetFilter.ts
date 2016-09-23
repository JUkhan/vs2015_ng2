import {BaseFilter} from './juGrid';
import {Observable, Subscription} from 'rxjs/Rx';

export class SetFilter implements BaseFilter {
    private _isActive: boolean = false;
    private _gui: HTMLElement;    
    private _col: any;
    public data: any[];
    searchCategory: string = '';
    get searchText(){
        return this.selectedItems.join('$$$');
    }
    init(params: any) {
        this._col = params;
        this.setupGui();
    }
    getGui(): HTMLElement {        
        return this._gui;
    }
    isFilterActive(): boolean {
        return this._isActive;
    }
    doesFilterPass(params: any): boolean {
        let passed = true, colValue = params.valueGetter(params)||'';
        if (this.selectedItems.indexOf(colValue.toString()) < 0) {
            passed = false;
        }
        return passed;
    }
    destroy() {
        this.unsubscribeCkhList();
        this.subsList.forEach(_=>{
            
                _.unsubscribe();
                _.remove(_);
           
        });      
    }
    //internal
    private subsList:Subscription[]=[];    
    private setupGui() {
        this._gui = document.createElement('div');
        this._gui.style.minWidth = '200px';
        this._gui.style.minHeight = '200px';
        this._gui.innerHTML = this.getContent();

        this.subsList.push(Observable.fromEvent(this._gui.querySelector('#txtSearch'), 'keyup')
            .map((e: any) => e.target.value.toLowerCase())
            .subscribe(val => {                
                this.updateItems(this.getData().filter((it:string)=>it.toLowerCase().indexOf(val)>=0));
            }));
        this.subsList.push(Observable.fromEvent(this._gui.querySelector('#selectAll'), 'click')
            .map((e: any) => e.target.checked)
            .subscribe(val => {                
                this._isActive = true;
                this.checkAll(val);
                this.doFilter();
                this._isActive = !val;
            }));
        if (this._col.params.value) {
            this.bindData(this._col.params.value);
        }
    }
    private updateItems(list:string[]){
        let items=this._gui.querySelectorAll('.set-content .item');
        for (var i = 0; i < items.length; i++) {
            items[i].className=list.indexOf((<any>items[i].querySelector('input.chk')).value)>=0
            ?'item':'item icon-hide';
             
        }
    }
    private selectedItems: any[];
    private doFilter() {
        this.selectedItems = this.getList(it => it.checked);
        this._col.filterChangedCallback();
    }
    private checkAll(checkedFlag: any) {
        let matches = this._gui.querySelectorAll('.set-content  input.chk');
        for (var index = 0; index < matches.length; index++) {
            (<any>matches[index]).checked = checkedFlag;
        }
    }
    private getList(ex: (el: any) => boolean) {
        let matches = this._gui.querySelectorAll('.set-content  input.chk'), res: any[] = [];
        for (var index = 0; index < matches.length; index++) {
            if (ex(matches[index])) {
                res.push((<any>matches[index]).value);
            }
        }
        return res;
    }
    private getData(): any[] {
        return (this.data || this._col.params.value);
    }
    private getContent() {        
        let tpl: any[] = [];
        tpl.push('<div style="padding:5px"><input id="txtSearch" placeholder="Search..." type="text"></div>');
        tpl.push('<div class="select-all"><label><input id="selectAll" checked type="checkbox"> (Select All)</label></div>');
        tpl.push('<div class="set-content">');
        tpl.push('</div>');
        return tpl.join('');
    }
    private chkSubscriptionList: Subscription[] = [];
    private unsubscribeCkhList() {
        this.chkSubscriptionList.forEach(it => {
                          
                it.unsubscribe();
                it.remove(it);
            
        })
    }    
    private removeItems(){
        let items=this._gui.querySelectorAll('.set-content .item');
        for (var i = 0; i < items.length; i++) {
          items[i].remove();        
        }
    }
    public bindData(data: any[]) {        
        this.unsubscribeCkhList();
        let tpl: any[] = [], uncheckedList = this.getList(it => it.checked === false);
        this.removeItems();
        data.forEach((it: any, index: number) => {
            tpl.push('<div class="item">');
            if (this._col.params.cellRenderer) {
                tpl.push(`<label><input class="chk" ${uncheckedList.indexOf(it) < 0 ? 'checked' : ''} type="checkbox" value="${it}"> ${this._col.params.cellRenderer(it, index)}</label>`);
            } else {
                tpl.push(`<label><input class="chk" ${uncheckedList.indexOf(it) < 0 ? 'checked' : ''} type="checkbox" value="${it}"> ${it}</label>`);
            }
            tpl.push('</div>');
        });
        this._gui.querySelector('.set-content').innerHTML = tpl.join('');
        let chkList = this._gui.querySelectorAll('.set-content input.chk'),
            chkAll:any=this._gui.querySelector('#selectAll');
        for (let i = 0; i < chkList.length; i++) {
            this.chkSubscriptionList.push(
                Observable.fromEvent(chkList[i], 'click').subscribe(next => {
                    this._isActive = true;
                    let ischecked=this.getList(it => it.checked === true).length===this.getData().length;
                    chkAll.checked=ischecked;
                    this.doFilter();
                    this._isActive = !ischecked;
                }));
        }
    }
}