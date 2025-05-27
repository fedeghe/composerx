/*
composerx (v.0.0.4)
~1.76KB
*/
class CRX {
    static els = {};
    static th(v){
        throw new Error(v);
    }
    static checkName(name, what) {
        if (typeof name !== 'string' || !name.trim()) {
            CRX.th(`${what} must be a non-empty string`);
        }
    }
    static checkStr(name) {
        if (typeof name !== 'string') {
            CRX.th(`a string is needed`);
        }
    }
    static get(name) {
        CRX.checkName(name, 'element');
        return CRX.els[name];
    }
    static add(name, rx) {
        CRX.checkName(name, 'element');
        if (! (rx instanceof RegExp )) {
            CRX.th('expected valid rx');
        }
        CRX.els[name] = rx;
        return CRX;
    }
    static remove(name) {
        CRX.checkName(name, 'element');
        delete CRX.els[name];
        return CRX;
    }
    static clear() {
        CRX.els = {};
        return CRX;
    }
    static match(name = '', str = '') {
        CRX.checkName(name, 'name');
        CRX.checkStr(str);
        if (!(name in CRX.els)) {
            return undefined;
        }
        return str.match(CRX.els[name]);
    }
    static compose(name, tpl = '', {autogroup = false} = {}) {
        CRX.checkName(name, 'Compose');
        CRX.checkName(tpl, 'Template');
        const resultStart = `^${autogroup? '(': ''}${tpl}${autogroup? ')': ''}$`,
            result = Object.entries(CRX.els).reduce((acc, [name, rx]) => {
                const ph = `cx(${name})`;
                let newAcc = `${acc}`;
                while (newAcc.includes(ph)) {
                    newAcc = newAcc.replace(ph, rx.source);
                }
                return newAcc;
            }, resultStart);

        CRX.els[name] = new RegExp(result);
        return CRX;
    }
}

module.exports =  CRX;