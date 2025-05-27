/*
composerx (v.0.0.1)
~1.88KB
*/
class RXC {
    static els = {};
    static results = null;
    static th(v){
        throw new Error(v);
    }
    static checkName(name, what) {
        if (typeof name !== 'string' || !name.trim()) {
            RXC.th(`${what} must be a non-empty string`);
        }
    }
    static add(name, rx) {
        RXC.checkName(name, 'Element');
        if (! (rx instanceof RegExp )) {
            RXC.th('expected valid rx');
        }
        if (name in RXC.els) {
            RXC.th('Element already exists');
        }
        RXC.els[name] = rx;
        return RXC;
    }
    static remove(name) {
        RXC.checkName(name, 'Element');
        if (!(name in RXC.els)) {
            RXC.th('element not found');
        }
        delete RXC.els[name];
        return RXC;
    }
    static clearAll() {
        RXC.els = {};
        RXC.results = null;
        return RXC;
    }
    static match(name = '', str = '') {
        RXC.checkName(name, 'name');
        RXC.checkName(str, 'str');
        if (!(name in RXC.els)) {
            RXC.th('element not found');
        }
        RXC.results = str.match(RXC.els[name]);
        return RXC;
    }
    static compose(name, tpl = '', {group = false} = {}) {
        RXC.checkName(name, 'Compose');
        RXC.checkName(tpl, 'Template');
        if (name in RXC.els) {
            RXC.th('Element already exists');
        }
        const resultStart = `^${group? '(': ''}${tpl}${group? ')': ''}$`,
            result = Object.entries(RXC.els).reduce((acc, [name, rx]) => {
                const ph = `RC(${name})`;
                let newAcc = `${acc}`;
                while (newAcc.includes(ph)) {
                    newAcc = newAcc.replace(ph, rx.source);
                }
                return newAcc;
            }, resultStart);

        RXC.els[name] = new RegExp(result);
        return RXC;
    }
}

module.exports =  RXC;