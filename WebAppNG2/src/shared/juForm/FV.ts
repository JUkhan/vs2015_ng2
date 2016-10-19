export class FV {
    static required(val: any, fieldName): any {
        if (val) {
            return true;
        }
        return `${fieldName} is required.`;
    }
    static minLength(limit: number, message?: string): Function {
        return function (val: any, fieldName): any {
            val = (val || '').toString();
            if (val.length < limit) {
                return message || `Minimum length is ${limit} characters.`;
            }
            return true;
        }
    }
    static maxLength(limit: number, message?: string): Function {
        return function (val: any, fieldName): any {
            val = (val || '').toString();
            if (val.length > limit) {
                return message || `Maximum length is ${limit} characters.`;
            }
            return true;
        }
    }
    static email(message?: string): Function {
        return function (val: any, fieldName): any {
            val = (val || '').toString();
            let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!re.test(val)) {
                return message || 'Invalid email ID.';
            }
            return true;
        }
    }
    static regex(exp: RegExp, message: string): Function {
        return function (val: any, fieldName): any {
            val = (val || '').toString();
            if (!exp.test(val)) {                
                return message;
            }
            return true;
        }
    }
    static validate(fx: (val: any) => boolean, message: string): Function
    {
        return function (val: any, fieldName): any
        {            
            if (!fx(val)) return message;             
            return true;
        }
    }
}