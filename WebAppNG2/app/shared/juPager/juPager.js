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
        this.powerList = [];
        this.totalPage = 0;
        this.activePage = 1;
        this.list = [];
        this.searchText = '';
        this._sort = '';
        this._filter = [];
        this.groupNumber = 1;
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
    juPager.prototype.changePageSize = function (size) {
        this.pageSize = +size;
        this.groupNumber = 1;
        this.activePage = 1;
        this.sspFn ?
            this.firePageChange()
            : this.calculatePagelinkes();
    };
    juPager.prototype.set_sspFn = function (callback) {
        this.sspFn = callback;
        this.firePageChange();
    };
    juPager.prototype.ngOnChanges = function (changes) {
        if (this.data) {
            this.calculatePagelinkes();
        }
    };
    juPager.prototype.ngOnInit = function () {
        this.pageSize = +this.pageSize;
        this.linkPages = +this.linkPages;
        this.groupNumber = +this.groupNumber;
        this.onInit.next(this);
        this.calculatePagelinkes();
    };
    juPager.prototype.ngOnDestroy = function () { };
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
            this.calculatePagelinkes();
        }
    };
    juPager.prototype.clickPrev = function () {
        this.groupNumber--;
        if (this.groupNumber <= 0) {
            this.groupNumber++;
        }
        else {
            this.calculatePagelinkes();
        }
    };
    juPager.prototype.clickStart = function () {
        if (this.groupNumber > 1) {
            this.groupNumber = 1;
            this.calculatePagelinkes();
        }
    };
    juPager.prototype.clickEnd = function () {
        if (this.hasNext()) {
            this.groupNumber = parseInt((this.totalPage / this.linkPages).toString()) + ((this.totalPage % this.linkPages) ? 1 : 0);
            this.calculatePagelinkes();
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
        this._sort = sortProp + '_' + (isAsc ? 'desc' : 'asc');
        this.firePageChange();
    };
    juPager.prototype.filter = function (filterArr) {
        this._filter = filterArr;
        this.groupNumber = 1;
        this.activePage = 1;
        this.firePageChange();
        this.calculatePagelinkes();
    };
    juPager.prototype.calculatePowerList = function () {
        this.powerList = [];
        var curPos = this.groupNumber * this.linkPages + 1, restPages = this.getTotalPage() - curPos, totalPage = this.getTotalPage();
        if (restPages > 30) {
            var index = curPos + 30, times = 5;
            while (index < totalPage && times > 0) {
                this.powerList.push(index);
                index += 30;
                times--;
            }
        }
    };
    juPager.prototype.firePageChange = function (isFire) {
        var _this = this;
        if (isFire === void 0) { isFire = false; }
        if (this.sspFn) {
            this.sspFn({ pageSize: this.pageSize, pageNo: this.activePage, searchText: this.searchText, sort: this._sort, filter: this._filter })
                .subscribe(function (res) {
                _this.totalPage = res.totalPage;
                _this.calculatePowerList();
                _this.pageChange.next(res.data);
                if (_this.activePage == 1 || isFire) {
                    _this.calculatePagelinkes(false);
                }
            });
        }
        else {
            if (!this.data)
                return;
            var startIndex = (this.activePage - 1) * this.pageSize;
            this.pageChange.next(this.data.slice(startIndex, startIndex + this.pageSize));
            this.calculatePowerList();
        }
    };
    juPager.prototype.calculatePagelinkes = function (isFire) {
        if (isFire === void 0) { isFire = true; }
        var start = 1, end = 0;
        if (this.groupNumber > 1) {
            start = (this.groupNumber - 1) * this.linkPages + 1;
        }
        this.activePage = start;
        end = this.groupNumber * this.linkPages;
        var totalPage = this.getTotalPage();
        if (end > totalPage) {
            end = totalPage;
        }
        this.list = [];
        for (var index = start; index <= end; index++) {
            this.list.push(index);
        }
        this.cd.markForCheck();
        if (isFire) {
            this.firePageChange(isFire);
        }
    };
    juPager.prototype.powerAction = function (pageNo) {
        this.groupNumber = Math.ceil(pageNo / this.linkPages);
        this.calculatePagelinkes(false);
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
            return this.totalPage;
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
            template: "<nav [style.display]=\"list.length?'block':'none'\">\n    <span style=\"position:relative;top:-8px\">\n        <span>Page Size </span>\n        <select style=\"display:inline-block;width:52px;color:#333\" #psize [ngModel]=\"pageSize\" (change)=\"changePageSize(psize.value)\">\n            <option value=\"5\">5</option>\n            <option value=\"10\">10</option>\n            <option value=\"20\">20</option>\n            <option value=\"30\">30</option>\n            <option value=\"40\">40</option>\n            <option value=\"50\">50</option>\n            <option value=\"100\">100</option>\n        </select>\n    </span>\n    <span style=\"position:relative;top:-8px\">Page {{activePage}} of {{getTotalPage()}}</span>\n  <ul class=\"pagination\">\n     <li class=\"page-item\" [class.disabled]=\"isDisabledPrev()\">\n      <a class=\"page-link\" href=\"javascript:;\" (click)=\"clickStart()\" aria-label=\"Previous\">\n        <span>Start</span>       \n      </a>\n    </li>\n    <li class=\"page-item\" [class.disabled]=\"isDisabledPrev()\">\n      <a class=\"page-link\" href=\"javascript:;\" (click)=\"clickPrev()\" aria-label=\"Previous\">\n        <span>&laquo;</span>       \n      </a>\n    </li>\n    <li class=\"page-item\" [class.active]=\"ax==activePage\" *ngFor=\"let ax of list\">\n      <a class=\"page-link\" (click)=\"clickPage(ax)\" href=\"javascript:;\">{{ax}}</a>\n    </li> \n\n     <li class=\"page-item\" *ngFor=\"let pi of powerList\">\n          <a class=\"page-link\" (click)=\"powerAction(pi)\" href=\"javascript:;\">{{pi}}</a>\n     </li> \n        \n    <li class=\"page-item\" [class.disabled]=\"isDisabledNext()\">\n      <a class=\"page-link\" href=\"javascript:;\" (click)=\"clickNext()\" aria-label=\"Next\">\n        <span>&raquo;</span>       \n      </a>\n    </li>\n     <li class=\"page-item\" [class.disabled]=\"isDisabledNext()\">\n      <a class=\"page-link\" href=\"javascript:;\" (click)=\"clickEnd()\" aria-label=\"Next\">\n        <span>End</span>       \n      </a>\n    </li>\n  </ul>\n    <span style=\"position:relative;top:-8px\" title=\"Enter Page Number\">\n        <input #txtPageNo type=\"text\" style=\"display:inline-block;width:50px;text-align:center\" />\n    </span>\n</nav>"
        }), 
        __metadata('design:paramtypes', [core_1.ChangeDetectorRef])
    ], juPager);
    return juPager;
}());
exports.juPager = juPager;
//# sourceMappingURL=juPager.js.map