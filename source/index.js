const $ = {
    els: {},
    _th: v => { throw new Error(v);},

    /* checkName */
    _cn: (n /* name */) => 
        (typeof n !== 'string' || !n.trim()) 
        ? $._th('non-empty string expected') : n,

    /* checkString */
    _cs: n /* name */ => 
        typeof n !== 'string'
        ? $._th(`a string is needed`) : n,
    get: n /* name*/ => $.els[$._cn(n)],
    add: (n /* name */, rx) => {;
        if (! (rx instanceof RegExp )) {
            $._th('expected valid rx');
        }
        $.els[$._cn(n)] = rx;
        return $;
    },
    remove: n =>  {
        delete $.els[$._cn(n)];
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
    test: (n = '', s = '') => {
        $._cn(n);
        $._cs(s);
        if (!(n in $.els)) return undefined;
        return $.els[n].test(s);
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