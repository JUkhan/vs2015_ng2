import {juForm} from './juForm';
export declare type TABS={[key:string]:[FormElement|any]};


export interface FormElement{
    field?:string;
    label?:string;
    type?:'groupLayout'|'html'|'juSelect'|'file'|string;
    change?:(event:{})=>void;
    validators?:Function|Array<Function>;
    viewMode?:'select'|'checkbox'|'radio';
    sort?:boolean;
    data?:Array<any>;
    size?:number;
    offset?:number;
    labelPos?: 'left'|'top';
     /**
     * This is groupLayout property
     * {type:'groupLayout', items:[
     *      {groupName:'Group-1' , inputs:[...]}
     * ]
     */     
    groupName?:string;
    /**
     * This is groupLayout property
     * {type:'groupLayout', items:[
     *      {groupName:'Group-1' isContainer:true , tabs:[...]}
     * ]
     */   
    isContainer?:boolean;
    /**
     * This is groupLayout property
     * {type:'groupLayout', items:[
     * {groupName:'Group-1' exp='[ngStyle]="config.disappear(model.country)"', tabs:{...}}
     * ]
     */
    exp?:string;
    /**
     * This is groupLayout property
     * {type:'groupLayout', items:[
     * {groupName:'Group-1'  items:[]|tabs|inputs}
     * ]
     */
    items?:[FormElement|any];
     /**
     * This is groupLayout property
     * {type:'groupLayout', items:[
     * {groupName:'Group-1', inputs:[]}
     * ]
     */
    inputs?:[FormElement|any];
     /**
     * This is groupLayout property
     * {type:'groupLayout', items:[
     * {groupName:'Group-1' tabs:{...}}
     * ]
     */
    tabs?:TABS;
    /**
     * tabConfig property is required if you use enable tab property
     *  {tabConfig: true, enable: (form, model) => { return !!model.firstName; }}
     */
    tabConfig?:boolean,
    /**
     * This enable callback property used for enable|disble tab on demand
     * {tabConfig: true, enable: (form, model) => { return !!model.firstName; }}
     */
    enable?:(form:any, model:any)=>boolean;
    content?:string;
}

export interface FormOptions{
    title?:string;
    labelPos?: 'left'|'top';
    labelSize?: number;
    refreshBy?:{};    
    inputs?:[FormElement|any];
    tabs?:TABS;
    buttons?:{[key:string]:{type:'submit'|'close'|'button',cssClass?:string,  click?:(event:any)=>void}};
    api?:juForm;
    [key: string]:any;
    
}