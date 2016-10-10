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
const Rx_1 = require('rxjs/Rx');
let juPager = class juPager {
    constructor(cd) {
        this.cd = cd;
        this.pageChange = new core_1.EventEmitter();
        this.onInit = new core_1.EventEmitter();
        this.linkPages = 10;
        this.pageSize = 10;
        this.enablePowerPage = false;
        this.enablePageSearch = true;
        this.powerList = [];
        this.powerListBW = [];
        this.totalPage = 0;
        this.activePage = 1;
        this.list = [];
        this.searchText = '';
        this.totalRecords = 0;
        this._sort = '';
        this._filter = [];
        this.groupNumber = 1;
        this._pbdiff = 20;
        this._pbtimes = 5;
    }
    ngAfterViewInit() {
        Rx_1.Observable.fromEvent(this.txtPageNoRef.nativeElement, 'keyup')
            .debounceTime(300)
            .distinctUntilChanged()
            .pluck('target', 'value')
            .map((_) => parseInt(_))
            .filter(_ => _ > 0 && _ <= this.getTotalPage())
            .subscribe(_ => this.powerAction(_));
    }
    ngOnChanges(changes) {
        if (this.data) {
            this.firePageChange();
        }
    }
    ngOnInit() {
        this.pageSize = +this.pageSize;
        this.linkPages = +this.linkPages;
        this.groupNumber = +this.groupNumber;
        this.onInit.next(this);
        this.firePageChange();
    }
    ngOnDestroy() { }
    changePageSize(size) {
        this.pageSize = +size;
        this.groupNumber = 1;
        this.activePage = 1;
        this.firePageChange();
    }
    set_sspFn(callback) {
        this.sspFn = callback;
        this.firePageChange();
    }
    isDisabledPrev() {
        if (this.sspFn) {
            return !(this.groupNumber > 1);
        }
        if (!this.data) {
            return true;
        }
        return !(this.groupNumber > 1);
    }
    isDisabledNext() {
        if (this.sspFn) {
            return !this.hasNext();
        }
        if (!this.data) {
            return true;
        }
        return !this.hasNext();
    }
    clickNext() {
        if (this.hasNext()) {
            this.groupNumber++;
            this.firePageChange();
        }
    }
    clickPrev() {
        this.groupNumber--;
        if (this.groupNumber <= 0) {
            this.groupNumber++;
        }
        else {
            this.firePageChange();
        }
    }
    clickStart() {
        if (this.groupNumber > 1) {
            this.groupNumber = 1;
            this.activePage = 1;
            this.firePageChange();
        }
    }
    clickEnd() {
        if (this.hasNext()) {
            this.groupNumber = parseInt((this.totalPage / this.linkPages).toString()) + ((this.totalPage % this.linkPages) ? 1 : 0);
            this.activePage = this.getTotalPage();
            this.firePageChange();
        }
    }
    clickPage(index) {
        this.activePage = index;
        this.firePageChange();
    }
    search(searchText) {
        this.searchText = searchText;
        this.activePage = 1;
        this.firePageChange();
    }
    sort(sortProp, isAsc) {
        this._sort = sortProp + '|' + (isAsc ? 'desc' : 'asc');
        this.firePageChange();
    }
    filter(filterArr) {
        this._filter = filterArr;
        this.groupNumber = 1;
        this.activePage = 1;
        this.firePageChange();
    }
    refresh() {
        this.groupNumber = 1;
        this.activePage = 1;
        this.firePageChange();
    }
    firePageChange(isFire = false) {
        if (this.sspFn) {
            this.sspFn({ pageSize: this.pageSize, pageNo: this.activePage, searchText: this.searchText, sort: this._sort, filter: this._filter })
                .subscribe(res => {
                this.totalRecords = res.totalRecords;
                this.totalPage = this.getTotalPage();
                this.pageChange.next(res.data);
                this.calculatePager();
            });
        }
        else {
            if (!this.data)
                return;
            let startIndex = (this.activePage - 1) * this.pageSize;
            this.pageChange.next(this.data.slice(startIndex, startIndex + this.pageSize));
            this.calculatePager();
        }
    }
    calculatePager() {
        if (this.enablePowerPage) {
            this.calculateBackwordPowerList();
            this.calculateForwordPowerList();
        }
        this.calculatePagelinkes();
        this.cd.markForCheck();
    }
    calculateBackwordPowerList() {
        this.powerListBW = [];
        let curPos = this.groupNumber * this.linkPages + 1;
        if (curPos > this._pbdiff) {
            let index = curPos - this._pbdiff, times = this._pbtimes;
            while (index > 0 && times > 0) {
                this.powerListBW.push(index);
                index -= this._pbdiff;
                times--;
            }
            this.powerListBW.reverse();
        }
    }
    calculateForwordPowerList() {
        this.powerList = [];
        let curPos = this.groupNumber * this.linkPages + 1, restPages = this.getTotalPage() - curPos, totalPage = this.getTotalPage();
        if (restPages > this._pbdiff) {
            let index = curPos + this._pbdiff, times = this._pbtimes;
            while (index < totalPage && times > 0) {
                this.powerList.push(index);
                index += this._pbdiff;
                times--;
            }
        }
    }
    calculatePagelinkes() {
        let start = 1;
        if (this.groupNumber > 1) {
            start = (this.groupNumber - 1) * this.linkPages + 1;
        }
        let end = this.groupNumber * this.linkPages, totalPage = this.getTotalPage();
        if (end > totalPage) {
            end = totalPage;
        }
        this.list = [];
        for (var index = start; index <= end; index++) {
            this.list.push(index);
        }
    }
    powerAction(pageNo) {
        this.groupNumber = Math.ceil(pageNo / this.linkPages);
        this.activePage = pageNo;
        this.firePageChange();
    }
    hasNext() {
        if (this.sspFn) {
            let totalPage = this.getTotalPage();
            return totalPage > this.groupNumber * this.linkPages;
        }
        if (!this.data)
            false;
        let len = this.data.length;
        if (len == 0)
            return false;
        let totalPage = this.getTotalPage();
        return totalPage > this.groupNumber * this.linkPages;
    }
    getTotalPage() {
        if (this.sspFn) {
            return parseInt((this.totalRecords / this.pageSize).toString()) + ((this.totalRecords % this.pageSize) > 0 ? 1 : 0);
        }
        if (!this.data)
            return 0;
        let len = this.data.length;
        if (len == 0)
            return 0;
        return parseInt((len / this.pageSize).toString()) + ((len % this.pageSize) > 0 ? 1 : 0);
    }
};
__decorate([
    core_1.Output(), 
    __metadata('design:type', Object)
], juPager.prototype, "pageChange", void 0);
__decorate([
    core_1.Output(), 
    __metadata('design:type', Object)
], juPager.prototype, "onInit", void 0);
__decorate([
    core_1.Input(), 
    __metadata('design:type', Number)
], juPager.prototype, "linkPages", void 0);
__decorate([
    core_1.Input(), 
    __metadata('design:type', Number)
], juPager.prototype, "pageSize", void 0);
__decorate([
    core_1.Input(), 
    __metadata('design:type', Boolean)
], juPager.prototype, "enablePowerPage", void 0);
__decorate([
    core_1.Input(), 
    __metadata('design:type', Boolean)
], juPager.prototype, "enablePageSearch", void 0);
__decorate([
    core_1.Input(), 
    __metadata('design:type', Object)
], juPager.prototype, "data", void 0);
__decorate([
    core_1.ViewChild('txtPageNo'), 
    __metadata('design:type', core_1.ElementRef)
], juPager.prototype, "txtPageNoRef", void 0);
juPager = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: '.juPager, [juPager]',
        styles: ['.juPager select{height:26px;padding:2px;}'],
        encapsulation: core_1.ViewEncapsulation.None,
        changeDetection: core_1.ChangeDetectionStrategy.OnPush,
        template: `<nav [style.display]="list.length?'block':'none'">
    <span style="position:relative;top:-8px">
        <span>Page Size </span>
        <select style="display:inline-block;width:52px;color:#333" #psize [ngModel]="pageSize" (change)="changePageSize(psize.value)">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
            <option value="100">100</option>
        </select>
    </span>
    <span style="position:relative;top:-8px">Page {{activePage}} of {{getTotalPage()}}</span>
  <ul class="pagination">
     <li class="page-item" [class.disabled]="isDisabledPrev()">
      <a class="page-link" href="javascript:;" (click)="clickStart()" aria-label="Previous">
        <span>Start</span>       
      </a>
    </li>
    <li class="page-item" [class.disabled]="isDisabledPrev()">
      <a class="page-link" href="javascript:;" (click)="clickPrev()" aria-label="Previous">
        <span>&laquo;</span>       
      </a>
    </li>
    <li class="page-item" *ngFor="let pib of powerListBW">
          <a class="page-link" (click)="powerAction(pib)" href="javascript:;">{{pib}}</a>
   </li> 
    <li class="page-item" [class.active]="ax==activePage" *ngFor="let ax of list">
      <a class="page-link" (click)="clickPage(ax)" href="javascript:;">{{ax}}</a>
    </li> 

     <li class="page-item" *ngFor="let pi of powerList">
          <a class="page-link" (click)="powerAction(pi)" href="javascript:;">{{pi}}</a>
     </li> 
        
    <li class="page-item" [class.disabled]="isDisabledNext()">
      <a class="page-link" href="javascript:;" (click)="clickNext()" aria-label="Next">
        <span>&raquo;</span>       
      </a>
    </li>
     <li class="page-item" [class.disabled]="isDisabledNext()">
      <a class="page-link" href="javascript:;" (click)="clickEnd()" aria-label="Next">
        <span>End</span>       
      </a>
    </li>
  </ul>
    <span [style.display]="enablePageSearch?'inline-block':'none'" style="position:relative;top:-8px" title="Enter Page Number">
        <input #txtPageNo type="text" style="display:inline-block;width:50px;text-align:center;color:#333;" />
    </span>
</nav>`
    }), 
    __metadata('design:paramtypes', [core_1.ChangeDetectorRef])
], juPager);
exports.juPager = juPager;
