import {Injectable} from '@angular/core';
import {AppService} from '../shared/app.service';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class DisputeService {
    constructor(public appService: AppService) {

    }

    loadRPR() {
        return Observable.of([
            { RPR_DSPT_RSN_SHRT_DESCR: 'A', AUTO_DSPT_FLG: true, RPR_DSPT_RSN_DESCR: 'DDDASE', HCFA_DSPT_RSN_CD: 1, ACTV_FLG: false },
            { RPR_DSPT_RSN_SHRT_DESCR: 'B', AUTO_DSPT_FLG: false, RPR_DSPT_RSN_DESCR: 'CXD..', HCFA_DSPT_RSN_CD: 1, ACTV_FLG: true }
        ]);
    }
    saveRpr(data: any[]) {
        return Observable.of(1234);
    }

    loadHCFA() {
        console.log('loadHCFA');
        return Observable.of([
            { HCFA_DSPT_RSN_CD: 'Mx', HCFA_DSPT_RSN_TYP_CD: '', HCFA_DSPT_RSN_DESCR: 'Description--1' },
            { HCFA_DSPT_RSN_CD: 'Cx1', HCFA_DSPT_RSN_TYP_CD: '', HCFA_DSPT_RSN_DESCR: 'Description.HCFA_DSPT_RSN_CD.HCFA_DSPT_RSN_CD.2' },
            { HCFA_DSPT_RSN_CD: 'Mx2', HCFA_DSPT_RSN_TYP_CD: '', HCFA_DSPT_RSN_DESCR: 'Description--1' },
            { HCFA_DSPT_RSN_CD: 'Cx3', HCFA_DSPT_RSN_TYP_CD: '', HCFA_DSPT_RSN_DESCR: 'Description.HCFA_DSPT_RSN_CD.HCFA_DSPT_RSN_CD.2' },
            { HCFA_DSPT_RSN_CD: 'Mx4', HCFA_DSPT_RSN_TYP_CD: '', HCFA_DSPT_RSN_DESCR: 'Description--1' },
            { HCFA_DSPT_RSN_CD: 'Cx5', HCFA_DSPT_RSN_TYP_CD: '', HCFA_DSPT_RSN_DESCR: 'Description.HCFA_DSPT_RSN_CD.HCFA_DSPT_RSN_CD.2' },
            { HCFA_DSPT_RSN_CD: 'Mx6', HCFA_DSPT_RSN_TYP_CD: '', HCFA_DSPT_RSN_DESCR: 'Description--1' },
            { HCFA_DSPT_RSN_CD: 'Cx7', HCFA_DSPT_RSN_TYP_CD: '', HCFA_DSPT_RSN_DESCR: 'Description.HCFA_DSPT_RSN_CD.HCFA_DSPT_RSN_CD.2' },
        ]);
    }
    saveHCFA(data: any[]) {
        console.log('saveHCFA', data);
        return Observable.of(33333333);
    }
    removeHcfa(record) {
        return Observable.of(record);
    }
    removeRpr(record) {
        return Observable.of(record);
    }
}