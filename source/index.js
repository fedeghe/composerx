const $ = {
    els: {},
    _th: v => { throw new Error(v);},

    /* checkName */
    _cn: (n /* name */, w /* what */) => 
        (typeof n !== 'string' || !n.trim()) 
        && $._th(`${w} must be a non-empty string`),

    /* checkString */
    _cs: n /* name */ => 
        typeof n !== 'string'
        && $._th(`a string is needed`),
    get: n /* name*/ => {
        $._cn(n, 'element');
        return $.els[n];
    },
    add: (n /* name */, rx) => {
        $._cn(n, 'element');
        if (! (rx instanceof RegExp )) {
            $._th('expected valid rx');
        }
        $.els[n] = rx;
        return $;
    },
    remove: n =>  {
        $._cn(n, 'element');
        delete $.els[n];
        return $;
    },
    clear: () => {
        $.els = {};
        return $;
    },
    match: (n = '', s = '', {definedOnly = false} = {}) => {
        $._cn(n, 'name');
        $._cs(s);
        if (!(n in $.els)) return undefined;
        const r = s.match($.els[n]);
        return definedOnly && r ? r.filter(e => typeof e !== 'undefined') : r;
    },
    /* name, template */
    compose: (n, t = '', {autogroup = false} = {}) =>  {
        $._cn(n, 'Compose');
        $._cn(t, 'Template');
        $.els[n] = new RegExp(
            Object.entries($.els).reduce((acc, [nm, rx]) => {
                const ph = `cx(${nm})`;
                let nAcc = `${acc}`;
                while (nAcc.includes(ph)) {
                    nAcc = nAcc.replace(ph, rx.source);
                }
                return nAcc;
            },
            `^${autogroup? '(': ''}${t}${autogroup? ')': ''}$`)
        );
        return $;
    }
};

module.exports =  $;