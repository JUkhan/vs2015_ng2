import {Component, ViewChild, ElementRef, OnInit, ViewEncapsulation, OnDestroy, Input, Output, EventEmitter, OnChanges, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {Observable} from 'rxjs/Rx';
@Component({
    moduleId: module.id,
    selector: '.juPager, [juPager]',
    templateUrl: './juPager.html',
    styles: ['.juPager select{height:26px;padding:2px;}'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class juPager implements OnInit, OnChanges {
    @Output() pageChange = new EventEmitter();
    @Output() onInit = new EventEmitter();
    @Input() linkPages: number = 10;
    @Input() pageSize: number = 10;
    @Input() data;

    powerList: any[] = [];
    sspFn: Function;
    totalPage: number = 0;
    activePage: number = 1;
    list: any[] = [];
    searchText: any = '';
    _sort: string = '';
    _filter: any[] = [];
   
    private groupNumber: number = 1;

    constructor(private cd: ChangeDetectorRef) {

    }
    @ViewChild('txtPageNo') txtPageNoRef: ElementRef;
    ngAfterViewInit() {
        Observable.fromEvent(this.txtPageNoRef.nativeElement, 'keyup')
            .debounceTime(300)
            .distinctUntilChanged()
            .pluck('target', 'value')
            .map((_:any) =>parseInt(_))
            .filter(_ => _ > 0 && _ <= this.getTotalPage())
            .subscribe(_ => this.powerAction(_));  
    }
    changePageSize(size) {
        this.pageSize = size;
        this.groupNumber = 1;
        this.activePage = 1;
        this.sspFn ?
            this.firePageChange()
            : this.calculatePagelinkes();
    }
    set_sspFn(callback: Function) {
        this.sspFn = callback;
        this.firePageChange();
    }
    ngOnChanges(changes) {
        if (this.data) {
            this.calculatePagelinkes();
        }
    }
    ngOnInit() {
        this.pageSize = +this.pageSize;
        this.linkPages = +this.linkPages;
        this.groupNumber = +this.groupNumber;
        this.onInit.next(this);
        this.calculatePagelinkes();
    }
    ngOnDestroy() { }

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
            this.calculatePagelinkes();
        }
    }
    clickPrev() {
        this.groupNumber--;
        if (this.groupNumber <= 0) {
            this.groupNumber++;
        } else {
            this.calculatePagelinkes();
        }

    }
    clickStart() {
        if (this.groupNumber > 1) {
            this.groupNumber = 1;
            this.calculatePagelinkes();
        }
    }
    clickEnd() {
        if (this.hasNext()) {
            this.groupNumber = parseInt((this.totalPage / this.linkPages).toString()) + ((this.totalPage % this.linkPages) ? 1 : 0);
            this.calculatePagelinkes();
        }
    }
    clickPage(index: number) {
        this.activePage = index;
        this.firePageChange();
    }
    search(searchText: string) {
        this.searchText = searchText;
        this.activePage = 1;
        this.firePageChange();
    }
    sort(sortProp: string, isAsc) {
        this._sort = sortProp + '_' + (isAsc ? 'desc' : 'asc');
        this.firePageChange();
    }
    filter(filterArr: any[]) {
        this._filter = filterArr;
        this.groupNumber = 1;
        this.activePage = 1;
        this.firePageChange();
        this.calculatePagelinkes();
    }
    calculatePowerList() {
        this.powerList = [];
        let curPos = this.groupNumber * this.linkPages + 1,
            restPages = this.getTotalPage() - curPos,
            totalPage = this.getTotalPage();
        if (restPages > 30) {
            let index = curPos + 30, times = 5;
            while (index < totalPage && times > 0) {
                this.powerList.push(index);
                index += 30;
                times--;
            }
        }
    }
    firePageChange(isFire: boolean = false) {
        if (this.sspFn) {
            this.sspFn({ pageSize: this.pageSize, pageNo: this.activePage, searchText: this.searchText, sort: this._sort, filter: this._filter })
                .subscribe(res => {
                    this.totalPage = res.totalPage;
                    this.calculatePowerList();
                    this.pageChange.next(res.data);
                    if (this.activePage == 1 || isFire) {
                        this.calculatePagelinkes(false);
                    }
                });
        } else {
            if (!this.data) return;
            let startIndex = (this.activePage - 1) * this.pageSize;
            this.pageChange.next(this.data.slice(startIndex, startIndex + this.pageSize));
            this.calculatePowerList();
        }
    }
    calculatePagelinkes(isFire: boolean = true) {
        let start = 1, end = 0;
        if (this.groupNumber > 1) {
            start = (this.groupNumber - 1) * this.linkPages + 1;
        }
        this.activePage = start;
        end = this.groupNumber * this.linkPages;
        let totalPage = this.getTotalPage();
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

    }
   
    private powerAction(pageNo) {
        this.groupNumber = Math.ceil(pageNo / this.linkPages);
        this.calculatePagelinkes(false);
        this.activePage = pageNo;
        this.firePageChange();
    }
    private hasNext() {
        if (this.sspFn) {
            let totalPage = this.getTotalPage();
            return totalPage > this.groupNumber * this.linkPages;
        }
        if (!this.data) false;
        let len = this.data.length;
        if (len == 0) return false;

        let totalPage = this.getTotalPage();
        return totalPage > this.groupNumber * this.linkPages;
    }
    private getTotalPage() {
        if (this.sspFn) {
            return this.totalPage;
        }
        if (!this.data) return 0;
        let len = this.data.length;
        if (len == 0) return 0;

        return parseInt((len / this.pageSize).toString()) + ((len % this.pageSize) > 0 ? 1 : 0);
    }
}