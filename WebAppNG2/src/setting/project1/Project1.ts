import {Component, OnInit, ViewChildren, QueryList} from '@angular/core';
import {Word} from './Word';

@Component({
    selector: 'project1',
    template: `
    <h1>Project-1</h1>
    <div class="row">
        <div class="col-md-6">
            <word  *ngFor="let word of words;let i=index;" [text]="word" [index]="i" (onWordClick)="onWordClick($event)"></word>
            <div>
            <label>Invoice<input type="text" [(ngModel)]="invoice"></label>
            <label>Total<input type="text" [(ngModel)]="total"></label>
            <label>Currency<input type="text" [(ngModel)]="currency"></label>
            </div>
        </div>
        <div class="col-md-6">
            <juSelect [data]="dataList" (option-change)="optionChange($event)" [options]="{title:'Please map the tokens'}"></juSelect>
            <div><textarea rows="15" cols="50" [(ngModel)]="text"></textarea></div>
            <div>
                <button class="btn btn-primary" (click)="map()">Map</button>
                <button class="btn btn-primary" (click)="calculate()">Calculate</button>
                 <button class="btn btn-primary" (click)="changeIndex()">ChangeIndex</button>
            </div>
        </div>
    </div>
    `,
    styles: [`
        
    `]
})

export class Project1 implements OnInit {
    dataList: any[];
    words: string[];
    @ViewChildren(Word) wordList = new QueryList<Word>();
    tokens: any = {};
    activeToken: string;
    text: string = `extra G00DMAYES 0345 679298 STILL WATER £5.95 35 £0.17 £5.95 TOTAL £11.00 CASH CHANGE DU xxxxxxxxxxxxxxxxxx** xxxxxx WTxxxxxxx JOIN CLUBCARD TODAY This vis could have earned you Clubcard points To join, visit 01 n text 'doin' to 80850 or call us on either 0800 591688 or 0330 1231688 A chance to win a E1000 Tesco Gift Card by telling us about your trip at www. tescovi ews.com and collect 25 Clubcard points. Terms and conditions apply, please see website for details. 17/10/16 19:53 2569 027 1230 8687`;
    invoice: string;
    total: string;
    currency: string;
    constructor() { }

    ngOnInit() {
        this.dataList = [
            { text: 'Name', value: 'name' },
            { text: 'Invoice No', value: 'invoice' },
            { text: 'Amount', value: 'total' },
        ];
        this.words = [];
    }
    private optionChange(token: string) {
        this.activeToken = token;
        if (!this.tokens[token]) {
            this.tokens[token] = [];
        }        
        this.wordList.toArray().forEach(w => w.selected = false);
        this.tokens[token].forEach(w => w.selected = true);
        for (var prop in this.tokens) {
            prop === token ? this.setWord(this.tokens[prop], true, prop) :
                this.setWord(this.tokens[prop], false, prop)
        }

    }
    private setWord(words, isSelected, token) {
        words.forEach(_ => { _.selected = isSelected; _.maped = !isSelected; _.token = token; });
    }
    private onWordClick(word: Word) {

        if (this.tokens[this.activeToken]) {
            if (word.ctrlKey) {
                this.tokens[this.activeToken].forEach(_ => _.ctrlKey = false);
                if (this.tokens[this.activeToken].indexOf(word) !== -1) {                    
                    word.ctrlKey = true; return;
                }
            }
            word.selected ? this.tokens[this.activeToken].push(word) :
                this.tokens[this.activeToken].splice(this.tokens[this.activeToken].indexOf(word), 1)
        } else { word.selected = false; }
        console.log(this.tokens);
    }
    private map() {
        this.words = this.text.split(/\s+/gm);        
    }
    private calculate() {        
        const totalRes = this.getValue(this.tokens.total);
        this.total = totalRes.substr(1);
        this.currency = totalRes.substr(0, 1);
    }
    private getValue(arr: any[]) {
        arr = arr.sort((a, b) => a.index - b.index);
        if (arr.length == 0) {
            return '';
        }
        else if (arr.length == 1) {
            return this.words[arr[0].index];
        }
        const item = arr.find(_ => _.ctrlKey);
        if (item) {
            const index = arr.indexOf(item), len = arr.length;
            let find: boolean = false;
            if (index - 1 >= 0) {
                const it = arr[index - 1];
                if (it.text === this.words[it.index]) {
                    find = true;
                }
            }
            if (index + 1 < len) {
                const it = arr[index + 1];
                if (it.text === this.words[it.index]) {
                    find = true;
                }
            }
            if (find) {
                return this.words[item.index];
            }
            if (index - 1 >= 0) {
                const it = this.words.find(_=>_===arr[index - 1].text);
                if (it) {
                    return this.words[this.words.indexOf(it) + 1];
                }
            }
            if (index + 1 < len) {
                const it = this.words.find(_ => _ === arr[index + 1].text);
                if (it) {
                    return this.words[this.words.indexOf(it) - 1];
                }
            }

        }
         console.log(arr);
    }

    private changeIndex() {
        this.tokens.total.forEach(_ => _.index -= 1);
    }
}