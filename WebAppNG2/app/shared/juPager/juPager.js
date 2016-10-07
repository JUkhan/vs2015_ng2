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
var core_1 = require('@angular/core');
var Rx_1 = require('rxjs/Rx');
var juPager = (function () {
    function juPager(cd) {
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
    juPager.prototype.ngAfterViewInit = function () {
        var _this = this;
        Rx_1.Observable.fromEvent(this.txtPageNoRef.nativeElement, 'keyup')
            .debounceTime(300)
            .distinctUntilChanged()
            .pluck('target', 'value')
            .map(function (_) { return parseInt(_); })
            .filter(function (_) { return _ > 0 && _ <= _this.getTotalPage(); })
            .subscribe(function (_) { return _this.powerAction(_); });
    };
    juPager.prototype.ngOnChanges = function (changes) {
        if (this.data) {
            this.firePageChange();
        }
    };
    juPager.prototype.ngOnInit = function () {
        this.pageSize = +this.pageSize;
        this.linkPages = +this.linkPages;
        this.groupNumber = +this.groupNumber;
        this.onInit.next(this);
        this.firePageChange();
    };
    juPager.prototype.ngOnDestroy = function () { };
    juPager.prototype.changePageSize = function (size) {
        this.pageSize = +size;
        this.groupNumber = 1;
        this.activePage = 1;
        this.firePageChange();
    };
    juPager.prototype.set_sspFn = function (callback) {
        this.sspFn = callback;
        this.firePageChange();
    };
    juPager.prototype.isDisabledPrev = function () {
        if (this.sspFn) {
            return !(this.groupNumber > 1);
        }
        if (!this.data) {
            return true;
        }
        return !(this.groupNumber > 1);
    };
    juPager.prototype.isDisabledNext = function () {
        if (this.sspFn) {
            return !this.hasNext();
        }
        if (!this.data) {
            return true;
        }
        return !this.hasNext();
    };
    juPager.prototype.clickNext = function () {
        if (this.hasNext()) {
            this.groupNumber++;
            this.firePageChange();
        }
    };
    juPager.prototype.clickPrev = function () {
        this.groupNumber--;
        if (this.groupNumber <= 0) {
            this.groupNumber++;
        }
        else {
            this.firePageChange();
        }
    };
    juPager.prototype.clickStart = function () {
        if (this.groupNumber > 1) {
            this.groupNumber = 1;
            this.activePage = 1;
            this.firePageChange();
        }
    };
    juPager.prototype.clickEnd = function () {
        if (this.hasNext()) {
            this.groupNumber = parseInt((this.totalPage / this.linkPages).toString()) + ((this.totalPage % this.linkPages) ? 1 : 0);
            this.activePage = this.getTotalPage();
            this.firePageChange();
        }
    };
    juPager.prototype.clickPage = function (index) {
        this.activePage = index;
        this.firePageChange();
    };
    juPager.prototype.search = function (searchText) {
        this.searchText = searchText;
        this.activePage = 1;
        this.firePageChange();
    };
    juPager.prototype.sort = function (sortProp, isAsc) {
        this._sort = sortProp + '|' + (isAsc ? 'desc' : 'asc');
        this.firePageChange();
    };
    juPager.prototype.filter = function (filterArr) {
        this._filter = filterArr;
        this.groupNumber = 1;
        this.activePage = 1;
        this.firePageChange();
    };
    juPager.prototype.refresh = function () {
        this.groupNumber = 1;
        this.activePage = 1;
        this.firePageChange();
    };
    juPager.prototype.firePageChange = function (isFire) {
        var _this = this;
        if (isFire === void 0) { isFire = false; }
        if (this.sspFn) {
            this.sspFn({ pageSize: this.pageSize, pageNo: this.activePage, searchText: this.searchText, sort: this._sort, filter: this._filter })
                .subscribe(function (res) {
                _this.totalRecords = res.totalRecords;
                _this.totalPage = _this.getTotalPage();
                _this.pageChange.next(res.data);
                _this.calculatePager();
            });
        }
        else {
            if (!this.data)
                return;
            var startIndex = (this.activePage - 1) * this.pageSize;
            this.pageChange.next(this.data.slice(startIndex, startIndex + this.pageSize));
            this.calculatePager();
        }
    };
    juPager.prototype.calculatePager = function () {
        if (this.enablePowerPage) {
            this.calculateBackwordPowerList();
            this.calculateForwordPowerList();
        }
        this.calculatePagelinkes();
        this.cd.markForCheck();
    };
    juPager.prototype.calculateBackwordPowerList = function () {
        this.powerListBW = [];
        var curPos = this.groupNumber * this.linkPages + 1;
        if (curPos > this._pbdiff) {
            var index = curPos - this._pbdiff, times = this._pbtimes;
            while (index > 0 && times > 0) {
                this.powerListBW.push(index);
                index -= this._pbdiff;
                times--;
            }
            this.powerListBW.reverse();
        }
    };
    juPager.prototype.calculateForwordPowerList = function () {
        this.powerList = [];
        var curPos = this.groupNumber * this.linkPages + 1, restPages = this.getTotalPage() - curPos, totalPage = this.getTotalPage();
        if (restPages > this._pbdiff) {
            var index = curPos + this._pbdiff, times = this._pbtimes;
            while (index < totalPage && times > 0) {
                this.powerList.push(index);
                index += this._pbdiff;
                times--;
            }
        }
    };
    juPager.prototype.calculatePagelinkes = function () {
        var start = 1;
        if (this.groupNumber > 1) {
            start = (this.groupNumber - 1) * this.linkPages + 1;
        }
        var end = this.groupNumber * this.linkPages, totalPage = this.getTotalPage();
        if (end > totalPage) {
            end = totalPage;
        }
        this.list = [];
        for (var index = start; index <= end; index++) {
            this.list.push(index);
        }
    };
    juPager.prototype.powerAction = function (pageNo) {
        this.groupNumber = Math.ceil(pageNo / this.linkPages);
        this.activePage = pageNo;
        this.firePageChange();
    };
    juPager.prototype.hasNext = function () {
        if (this.sspFn) {
            var totalPage_1 = this.getTotalPage();
            return totalPage_1 > this.groupNumber * this.linkPages;
        }
        if (!this.data)
            false;
        var len = this.data.length;
        if (len == 0)
            return false;
        var totalPage = this.getTotalPage();
        return totalPage > this.groupNumber * this.linkPages;
    };
    juPager.prototype.getTotalPage = function () {
        if (this.sspFn) {
            return parseInt((this.totalRecords / this.pageSize).toString()) + ((this.totalRecords % this.pageSize) > 0 ? 1 : 0);
        }
        if (!this.data)
            return 0;
        var len = this.data.length;
        if (len == 0)
            return 0;
        return parseInt((len / this.pageSize).toString()) + ((len % this.pageSize) > 0 ? 1 : 0);
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
            template: "<nav [style.display]=\"list.length?'block':'none'\">\n    <span style=\"position:relative;top:-8px\">\n        <span>Page Size </span>\n        <select style=\"display:inline-block;width:52px;color:#333\" #psize [ngModel]=\"pageSize\" (change)=\"changePageSize(psize.value)\">\n            <option value=\"5\">5</option>\n            <option value=\"10\">10</option>\n            <option value=\"20\">20</option>\n            <option value=\"30\">30</option>\n            <option value=\"40\">40</option>\n            <option value=\"50\">50</option>\n            <option value=\"100\">100</option>\n        </select>\n    </span>\n    <span style=\"position:relative;top:-8px\">Page {{activePage}} of {{getTotalPage()}}</span>\n  <ul class=\"pagination\">\n     <li class=\"page-item\" [class.disabled]=\"isDisabledPrev()\">\n      <a class=\"page-link\" href=\"javascript:;\" (click)=\"clickStart()\" aria-label=\"Previous\">\n        <span>Start</span>       \n      </a>\n    </li>\n    <li class=\"page-item\" [class.disabled]=\"isDisabledPrev()\">\n      <a class=\"page-link\" href=\"javascript:;\" (click)=\"clickPrev()\" aria-label=\"Previous\">\n        <span>&laquo;</span>       \n      </a>\n    </li>\n    <li class=\"page-item\" *ngFor=\"let pib of powerListBW\">\n          <a class=\"page-link\" (click)=\"powerAction(pib)\" href=\"javascript:;\">{{pib}}</a>\n   </li> \n    <li class=\"page-item\" [class.active]=\"ax==activePage\" *ngFor=\"let ax of list\">\n      <a class=\"page-link\" (click)=\"clickPage(ax)\" href=\"javascript:;\">{{ax}}</a>\n    </li> \n\n     <li class=\"page-item\" *ngFor=\"let pi of powerList\">\n          <a class=\"page-link\" (click)=\"powerAction(pi)\" href=\"javascript:;\">{{pi}}</a>\n     </li> \n        \n    <li class=\"page-item\" [class.disabled]=\"isDisabledNext()\">\n      <a class=\"page-link\" href=\"javascript:;\" (click)=\"clickNext()\" aria-label=\"Next\">\n        <span>&raquo;</span>       \n      </a>\n    </li>\n     <li class=\"page-item\" [class.disabled]=\"isDisabledNext()\">\n      <a class=\"page-link\" href=\"javascript:;\" (click)=\"clickEnd()\" aria-label=\"Next\">\n        <span>End</span>       \n      </a>\n    </li>\n  </ul>\n    <span [style.display]=\"enablePageSearch?'inline-block':'none'\" style=\"position:relative;top:-8px\" title=\"Enter Page Number\">\n        <input #txtPageNo type=\"text\" style=\"display:inline-block;width:50px;text-align:center;color:#333;\" />\n    </span>\n</nav>"
        }), 
        __metadata('design:paramtypes', [core_1.ChangeDetectorRef])
    ], juPager);
    return juPager;
}());
exports.juPager = juPager;
//# sourceMappingURL=juPager.js.map