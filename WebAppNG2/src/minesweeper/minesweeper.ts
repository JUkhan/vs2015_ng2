
import { Component, ChangeDetectionStrategy } from '@angular/core';
@Component({
    moduleId: module.id,
    template: `
        <div class="game">
                <div class="game-board">
                    <Board [squares]="squares" (squareclickHandler)="handleClick($event)" ></Board>
                </div>
                <div class="game-info">
                    <div><a href="script:0;" (click)="startGame($event)">Start Game</a></div>
                    <div>{{status}}</div>
                </div>                
            </div>
            <br>
            <div class="juTable" style="width:200px;">
                <div>Table title</div>
                <div style="border:solid 1px #ddd;">
                    <div style="overflow:hidden;" #headerDiv>
                        <div style="width:380px;">
                            <div class="juRow">
                                <div class="juCol juHeader">Name</div>
                                <div class="juCol juHeader">Address</div>
                                <div class="juCol juHeader">Age</div>
                                <div class="juCol" style="width:20px;border-right: none;">&nbsp;</div>
                            </div>
                        </div>
                    </div>
                    <div style="max-height:100px;overflow:auto;" (scroll)="tblScroll($event, headerDiv)">
                        <div style="width:360px;">   
                            <div class="juRow">
                                <div class="juCol">Jasim</div>
                                <div class="juCol">Tangail</div>
                                <div class="juCol">32</div>
                            </div>
                            <div class="juRow">
                                <div class="juCol">Ripon</div>
                                <div class="juCol">Tangail</div>
                                <div class="juCol">32</div>
                            </div>
                            <div class="juRow">
                                <div class="juCol">Nahida</div>
                                <div class="juCol">Tangail</div>
                                <div class="juCol">56</div>
                            </div>
                        </div>
                    </div>
                </div>
           </div>          
    `,
    templateUrl: './game.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class minesweeper {

    private squares: any[] = [];
    private status: string;
    constructor() {
        this.squares = this.getInitialSquare();
    }
    private tblScroll(e, headerDiv) {
        headerDiv.scrollLeft = e.target.scrollLeft;
    }
    getInitialSquare() {
        let arr = [], booms = 20, squares = 108, boomObj = {};

        for (let i = 0; i < squares; i++) {
            arr.push({ value: 0, visited: false, mode: false, boom: false, won: false });
        }
        for (let i = 0; i < booms; i++) {
            let boomIndex = Math.round(Math.random() * 107);

            while (boomObj[boomIndex]) {
                boomIndex = Math.round(Math.random() * 107);
            }
            arr[boomIndex].value = 100;
            boomObj[boomIndex] = true;
            let rowNo = parseInt((boomIndex / 9).toLocaleString()), mod = boomIndex % 9;

            if (rowNo === 0) {
                this.setSquareValue(arr, boomIndex, mod);
                this.setSquareValue(arr, boomIndex + 9, mod);
            }
            else if (rowNo === 11) {
                this.setSquareValue(arr, boomIndex, mod);
                this.setSquareValue(arr, boomIndex - 9, mod);
            }
            else {
                this.setSquareValue(arr, boomIndex, mod);
                this.setSquareValue(arr, boomIndex + 9, mod);
                this.setSquareValue(arr, boomIndex - 9, mod);
            }
        }
        return arr;
    }
    setSquareValue(arr, index, mod) {
        if (mod === 0) {
            arr[index].value++;
            arr[index + 1].value++;
        }
        else if (mod === 8) {
            arr[index].value++;
            arr[index - 1].value++;
        }
        else {

            arr[index].value++;
            arr[index + 1].value++;
            arr[index - 1].value++;
        }
    }
    calculateWiner() {
        return this.squares.filter(_ => !_.mode).length == 20;
    }
    handleClick(i) {
        let square = this.squares[i];
        if (this.status === 'GAME OVER' || square.mode) return;
        if (square.boom) {
            square.boom = false;
            return;
        }
        if (square.value == 0) {
            this.updateSquare(this.squares, i)
        }
        else if (square.value >= 100) {
            this.squares.forEach((item: any, index: number) => {
                if (!item.mode)
                    this.squares[index] = Object.assign({}, item, { mode: true, boom: item.value >= 100 });
            });
            this.status = 'GAME OVER';
        }
        else square.mode = true;
        if (this.calculateWiner()) {
            this.squares.forEach((item: any, index: any) => {
                if (item.value >= 100) {
                    this.squares[index] = { value: item.value, mode: true, boom: false, won: true };
                }
            });
            this.status = 'You WON!';
        }

    }
    updateSquare(arr, index) {

        let rowNo = parseInt((index / 9).toString()), mod = index % 9;

        if (rowNo === 0) {
            this.updateSquareHelper(arr, index, mod);
            this.updateSquareHelper(arr, index + 9, mod);
        }
        else if (rowNo === 11) {
            this.updateSquareHelper(arr, index, mod);
            this.updateSquareHelper(arr, index - 9, mod);
        }
        else {
            this.updateSquareHelper(arr, index, mod);
            this.updateSquareHelper(arr, index + 9, mod);
            this.updateSquareHelper(arr, index - 9, mod);
        }

    }
    setSquareState(arr, index, ignore = false) {
        if (arr[index].value == 0) {
            arr[index] = Object.assign({}, arr[index], { mode: true });
            if (!ignore && !arr[index].visited) {
                arr[index].visited = true;
                this.updateSquare(arr, index);
            }
        }
        else if (arr[index].value <= 100) {
            arr[index] = Object.assign({}, arr[index], { mode: true });
        }
    }
    updateSquareHelper(arr, index, mod) {
        if (mod === 0) {
            this.setSquareState(arr, index, true);
            this.setSquareState(arr, index + 1);

        }
        else if (mod === 8) {
            this.setSquareState(arr, index, true);
            this.setSquareState(arr, index - 1);
        }
        else {
            this.setSquareState(arr, index, true);
            this.setSquareState(arr, index + 1);
            this.setSquareState(arr, index - 1);
        }
    }
    startGame() {

        this.status = '';
        this.squares = this.getInitialSquare();
    }
}