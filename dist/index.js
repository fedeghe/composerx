/*
composerx (v.0.0.10)
~1.54KB
*/
const $ = {
    els: {},
    _th: v => { throw new Error(v);},

    /* checkName */
    _cn: (n /* name */) => 
        (typeof n !== 'string' || !n.trim()) 
        && $._th('non-empty string expected'),

    /* checkString */
    _cs: n /* name */ => 
        typeof n !== 'string'
        && $._th(`a string is needed`),
    get: n /* name*/ => {
        $._cn(n);
        return $.els[n];
    },
    add: (n /* name */, rx) => {
        $._cn(n);
        if (! (rx instanceof RegExp )) {
            $._th('expected valid rx');
        }
        $.els[n] = rx;
        return $;
    },
    remove: n =>  {
        $._cn(n);
        delete $.els[n];
        return $;
    },
    clear: () => {
        $.els = {};
        return $;
    },
    match: (n = '', s = '', {definedOnly : dx = false} = {}) => {
        $._cn(n);
        $._cs(s);
        if (!(n in $.els)) return undefined;
        const r = s.match($.els[n]);
        return dx && r ? r.filter(e => typeof e !== 'undefined') : r;
    },
    /* name, template */
    compose: (n, t = '') =>  {
        $._cn(n);
        $._cn(t);
        const rin =  t,
            r = rin;
        $.els[n] = new RegExp(
            Object.entries($.els).reduce(
                (acc, [nm, rx]) => {
                    const ph = `cx(${nm})`;
                    let nAcc = `${acc}`;
                    while (nAcc.includes(ph)) nAcc = nAcc.replace(ph, rx.source);
                    return nAcc;
                },r
            )
        );
        return $;
    }
};

module.exports =  $;