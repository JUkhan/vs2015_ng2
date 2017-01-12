
import {Injectable} from '@angular/core';


@Injectable()
export class DECActions {
    static INIT = 'INIT';
    init() {
        return { type: DECActions.INIT };
    }

    static HELLO = 'Hello';
    hello() {
        return { type: DECActions.HELLO };
    }

    static BUTTON_DEACTIVE = 'button_deactive';
    buttonDeactive(obj:{ok?:boolean, add?:boolean, delete?:boolean}) {
        return { type: DECActions.BUTTON_DEACTIVE , payload:obj};
    }

    static LOAD_RPR = '[load]rpr';
    loadRpr() {
        return { type: DECActions.LOAD_RPR };
    }

    static LOAD_RPR_SUCCESS = '[load-success]rpr';
    loadRprSuccess(rprs) {
        return { type: DECActions.LOAD_RPR_SUCCESS , payload:rprs};
    }

    static SAVE_RPR = '[save]rprdd';
    saveRpr(records:any[]) {
        return { type: DECActions.SAVE_RPR , payload:records};
    }

    static ADD_RPR = '[add]rpr';
    AddRpr(index) {
        return { type: DECActions.ADD_RPR , payload:index};
    }
    static REMOVE_RPR = '[remove]rpr';
    removeRpr(record) {
        return { type: DECActions.REMOVE_RPR , payload:record};
    }
    static REMOVE_RPR_SUCCESS = '[remove-success]rpr';
    removeRPRSuccess(record) {
        return { type: DECActions.REMOVE_RPR_SUCCESS , payload:record};
    }


    static LOAD_HCFA = '[load]hcfa';
    loadHcfa() {
        return { type: DECActions.LOAD_HCFA };
    }

    static LOAD_HCFA_SUCCESS = '[load-success]hcfa';
    loadHcfaSuccess(hcfas) {
        return { type: DECActions.LOAD_HCFA_SUCCESS, payload: hcfas};
    }

    static ADD_HCFA = '[add]hcfa';
    AddHcfa(index) {
        return { type: DECActions.ADD_HCFA , payload:index};
    }
    static REMOVE_HCFA = '[remove]hcfa';
    removeHcfa(record) {
        return { type: DECActions.REMOVE_HCFA , payload:record};
    }

    static SAVE_HCFA = '[save]hcfadd';
    saveHcfa(records:any[]) {
        return { type: DECActions.SAVE_HCFA , payload:records};
    }
    static REMOVE_HCFA_SUCCESS = '[remove-success]hcfa';
    removeHCFASuccess(record) {
        return { type: DECActions.REMOVE_HCFA_SUCCESS , payload:record};
    }

    static LOAD_DDL_DATA = 'load-ddl-data';
    loadDdlData() {
        return { type: DECActions.LOAD_DDL_DATA };
    }
    
}