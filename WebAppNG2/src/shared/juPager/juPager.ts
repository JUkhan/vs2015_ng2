import {Component, ViewChild, ElementRef, OnInit, ViewEncapsulation, OnDestroy, Input, Output, EventEmitter, OnChanges, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {Observable} from 'rxjs/Rx';
@Component({
    moduleId: module.id,
    selector: '.juPager, [juPager]',
    styles: ['.juPager select{height:26px;padding:2px;}'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
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
})

export class juPager implements OnInit, OnChanges
{
    @Output() pageChange = new EventEmitter();
    @Output() onInit = new EventEmitter();
    @Input() linkPages: number = 10;
    @Input() pageSize: number = 10;
    @Input() enablePowerPage: boolean = false;
    @Input() enablePageSearch: boolean = true;
    @Input() data;

    powerList: any[] = [];
    powerListBW: any[] = [];
    sspFn: Function;
    totalPage: number = 0;
    activePage: number = 1;
    list: any[] = [];
    searchText: any = '';
    totalRecords: any = 0;
    _sort: string = '';
    _filter: any[] = [];
   
    private groupNumber: number = 1;

    constructor(private cd: ChangeDetectorRef)
    {

    }
    @ViewChild('txtPageNo') txtPageNoRef: ElementRef;
    ngAfterViewInit()
    {
        Observable.fromEvent(this.txtPageNoRef.nativeElement, 'keyup')
            .debounceTime(300)
            .distinctUntilChanged()
            .pluck('target', 'value')
            .map((_: any) => parseInt(_))
            .filter(_ => _ > 0 && _ <= this.getTotalPage())
            .subscribe(_ => this.powerAction(_));
    }

    ngOnChanges(changes)
    {
        if (this.data)
        {
            this.firePageChange();
        }
    }
    ngOnInit()
    {
        this.pageSize = +this.pageSize;
        this.linkPages = +this.linkPages;
        this.groupNumber = +this.groupNumber;
        this.onInit.next(this);
        this.firePageChange();
    }
    ngOnDestroy() { }
    private changePageSize(size)
    {
        this.pageSize = +size;
        this.groupNumber = 1;
        this.activePage = 1;
        this.firePageChange()
    }
    public set_sspFn(callback: Function)
    {
        this.sspFn = callback;
        this.firePageChange();
    }
    private isDisabledPrev()
    {
        if (this.sspFn)
        {
            return !(this.groupNumber > 1);
        }
        if (!this.data)
        {
            return true;
        }
        return !(this.groupNumber > 1);
    }
    private isDisabledNext()
    {
        if (this.sspFn)
        {
            return !this.hasNext();
        }
        if (!this.data)
        {
            return true;
        }
        return !this.hasNext();
    }
    private clickNext()
    {
        if (this.hasNext())
        {
            this.groupNumber++;
            this.firePageChange();
        }
    }
    private clickPrev()
    {
        this.groupNumber--;
        if (this.groupNumber <= 0)
        {
            this.groupNumber++;
        } else
        {
            this.firePageChange();
        }

    }
    private clickStart()
    {
        if (this.groupNumber > 1)
        {
            this.groupNumber = 1;
            this.activePage = 1;
            this.firePageChange();
        }
    }
    private clickEnd()
    {
        if (this.hasNext())
        {
            this.groupNumber = parseInt((this.totalPage / this.linkPages).toString()) + ((this.totalPage % this.linkPages) ? 1 : 0);
            this.activePage = this.getTotalPage();
            this.firePageChange();
        }
    }
    private clickPage(index: number)
    {
        this.activePage = index;         
        this.firePageChange();
    }
    public search(searchText: string)
    {
        this.searchText = searchText;
        this.activePage = 1;
        this.firePageChange();
    }
    public sort(sortProp: string, isAsc)
    {
        this._sort = sortProp + '|' + (isAsc ? 'desc' : 'asc');
        this.firePageChange();
    }
    public filter(filterArr: any[])
    {
        this._filter = filterArr;
        this.groupNumber = 1;
        this.activePage = 1;
        this.firePageChange();

    }
    public refresh()
    {        
        this.groupNumber = 1;
        this.activePage = 1;
        this.firePageChange();
    }
    public firePageChange(isFire: boolean = false)
    {

        if (this.sspFn)
        {
            this.sspFn({ pageSize: this.pageSize, pageNo: this.activePage, searchText: this.searchText, sort: this._sort, filter: this._filter })
                .subscribe(res =>
                {
                    this.totalRecords = res.totalRecords;
                    this.totalPage = this.getTotalPage();
                    this.pageChange.next(res.data);

                    this.calculatePager();
                });
        } else
        {
            if (!this.data) return;
            let startIndex = (this.activePage - 1) * this.pageSize;
            this.pageChange.next(this.data.slice(startIndex, startIndex + this.pageSize));

            this.calculatePager();
        }
    }
    private calculatePager()
    {
        if (this.enablePowerPage)
        {
            this.calculateBackwordPowerList();
            this.calculateForwordPowerList();
        }
        this.calculatePagelinkes();

        this.cd.markForCheck();
    }
    _pbdiff = 20;
    _pbtimes = 5;
    private calculateBackwordPowerList()
    {
        this.powerListBW = [];
        let curPos = this.groupNumber * this.linkPages + 1;
        if (curPos > this._pbdiff)
        {
            let index = curPos - this._pbdiff, times = this._pbtimes;
            while (index > 0 && times > 0)
            {
                this.powerListBW.push(index);
                index -= this._pbdiff;
                times--;
            }
            this.powerListBW.reverse();
        }
    }
    private calculateForwordPowerList()
    {
        this.powerList = [];
        let curPos = this.groupNumber * this.linkPages + 1,
            restPages = this.getTotalPage() - curPos,
            totalPage = this.getTotalPage();
        if (restPages > this._pbdiff)
        {
            let index = curPos + this._pbdiff, times = this._pbtimes;
            while (index < totalPage && times > 0)
            {
                this.powerList.push(index);
                index += this._pbdiff;
                times--;
            }
        }
    }
    
    private calculatePagelinkes()
    {
        let start = 1;
        if (this.groupNumber > 1)
        {
            start = (this.groupNumber - 1) * this.linkPages + 1;
        }
        let end = this.groupNumber * this.linkPages,
            totalPage = this.getTotalPage();
        if (end > totalPage)
        {
            end = totalPage;
        }         
        this.list = [];
        for (var index = start; index <= end; index++)
        {
            this.list.push(index);
        }

    }

    private powerAction(pageNo)
    {
        this.groupNumber = Math.ceil(pageNo / this.linkPages);
        this.activePage = pageNo;
        this.firePageChange();
       
    }
    private hasNext()
    {
        if (this.sspFn)
        {
            let totalPage = this.getTotalPage();
            return totalPage > this.groupNumber * this.linkPages;
        }
        if (!this.data) false;
        let len = this.data.length;
        if (len == 0) return false;

        let totalPage = this.getTotalPage();
        return totalPage > this.groupNumber * this.linkPages;
    }
    private getTotalPage()
    {
        if (this.sspFn)
        {
            return parseInt((this.totalRecords / this.pageSize).toString()) + ((this.totalRecords % this.pageSize) > 0 ? 1 : 0);
        }
        if (!this.data) return 0;
        let len = this.data.length;
        if (len == 0) return 0;

        return parseInt((len / this.pageSize).toString()) + ((len % this.pageSize) > 0 ? 1 : 0);
    }
}