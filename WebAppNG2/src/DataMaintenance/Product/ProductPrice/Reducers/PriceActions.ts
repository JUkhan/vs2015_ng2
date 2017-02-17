
import {Injectable} from '@angular/core';

export class PriceActions {
    constructor() {

    }
    static INIT = 'init-price';
    init() {
        return { type: PriceActions.INIT };
    }
}