const c  = require('../dist/index.js');


describe('composerx', () => {
    
    describe('build some simple working rx', () => {
        beforeEach(() => {
            c.clear();
            // add two simple elements
            c.add('word', /([a-zA-Z]+)/);
            c.add('number', /(\d+)/);
        });
        it('#1', () => {
            c.compose('rx1', 'cx(word)#cx(number)');
            const r1 = c.match('rx1', 'abc#123');
            expect(r1[1]).toBe('abc');
            expect(r1[2]).toBe('123');
        });
        it('#2', () => {
            c.compose('rx2', 'cx(word):cx(word)');
            const r2 = c.match('rx2', 'abc:sss');
            expect(r2[1]).toBe('abc');
            expect(r2[2]).toBe('sss');
        });
        it('#3', () => {
            c.compose('rx3', 'cx(number)/cx(number)');
            const r3 = c.match('rx3', '123/456');
            expect(r3[1]).toBe('123');
            expect(r3[2]).toBe('456');
        });
        it('#4', () => {
            c.compose('rxOR', '^(cx(number)|cx(word))$');
            const rOR1 = c.match('rxOR', '123');
            expect(rOR1[1]).toBe('123');

            const rOR2_1 = c.match('rxOR', 'aaas');
            expect(rOR2_1[1]).toBe('aaas');

            const rOR2_2 = c.match('rxOR', 'aaas1212');
            expect(rOR2_2).toBe(null);
        });
    });
    describe('test', () => {
        beforeEach(() => {
            c.clear();
            // add two simple elements
            c.add('word', /([a-z]{3})/i);
            c.add('number', /(\d{3})/);
        });
        it('#1', () => {
            c.compose('rx1', '^cx(word)#cx(number)$');
            expect(c.test('rx1', 'abc#123')).toBeTruthy();
            expect(c.test('rx1', 'abc#1234')).toBeFalsy();
        });
        it('#2', () => {
            c.compose('rx2', '^cx(word):cx(word)$');
            expect(c.test('rx2', 'abc:sss')).toBeTruthy();
            expect(c.test('rx2', 'abc:')).toBeFalsy();
        });
        it('#3', () => {
            c.compose('rx3', '^cx(number)/cx(number)$');
            expect(c.test('rx3', '123/456')).toBeTruthy();
            expect(c.test('rx3', '123/4567')).toBeFalsy();
        });
        it('#4', () => {
            expect(c.test('asdas', 'dontExists')).toBeUndefined();
        });
    });

    describe('autoanchor', () => {
        beforeEach(() => {
            c.clear();
            // add two simple elements
            c.add('word', /([a-zA-Z]+)/);
            c.add('number', /(\d+)/);
            c.compose('autoAnchor', '^cx(word)#cx(number)$');
            c.compose('noAutoAnchor', 'cx(word)#cx(number)');
        });
        test.each([
                [ '---fede#1976---', 'autoAnchor',  (rx, i, inp) => i.match(rx, inp), null ],
                [ '---fede#1976---', 'noAutoAnchor',  (rx, i, inp) => i.match(rx, inp), ['fede#1976', 'fede', '1976'] ],
            ])('%s', (input, rx, prep, expected) => {
                const r = prep(rx, c, input);
                if(expected === null) {
                    expect(r).toBeNull();
                } else {
                    expect(r[0]).toBe(expected[0]);
                    expect(r[1]).toBe(expected[1]);
                    expect(r[2]).toBe(expected[2]);
                }
            });
    });

    describe('day of month example', () => {
        beforeAll(() => {
            // add two simple elements
            c.add('1-31', /(\d|[1-2]\d|3[01])/);
            c.add('1-7', /([1-7]+)/);
            c.compose('dow', '^cx(1-31)/cx(1-7)$');
        });
        describe('positive cases', () => {
            test.each([
                [ '2/7', ['2', '7'] ],
                [ '31/7', ['31', '7'] ]
            ])('%s', (input, expected) => {
                const r = c.match('dow', input);
                expect(r).toBeTruthy();
                expect(r.length).toBe(3);
                expect(r[1]).toBe(expected[0]);
                expect(r[2]).toBe(expected[1]);
            });
        });
        describe('negative cases', () => {
            test.each([
                ['32/7'],
                ['31/8'],
            ])('%s', input => {
                const r = c.match('dow', input);
                expect(r).toBe(null);
                
            });
        });
    });

    describe('other static methods', () => {
        beforeEach(() => c.clear());
        
        it('should get an element', () => {
            c.add('test', /test/);
            c.add('anotherTest', /anotherTest/);
            c.compose('composedTest', 'cx(test)|cx(anotherTest)');
            expect(c.get('test')).toEqual(/test/);
            expect(c.get('anotherTest')).toEqual(/anotherTest/);
            expect(c.get('composedTest')).toEqual(/test|anotherTest/);
        });

        it('should attempt gracefully the deletion of a non exisinting element', () => {
            c.add('test', /test/);
            expect(() => c.remove('nonExistent')).not.toThrow();
            expect(c.get('test')).toEqual(/test/);
        });

        it('should override an element', () => {
            c.add('test', /test/);
            expect(c.get('test')).toEqual(/test/);
            c.add('test', /newTest/);
            expect(c.get('test')).toEqual(/newTest/);
        });

        it('should return undefined when matching a non existent element', () => {
            expect(c.match('test', 'whatever')).toBeUndefined();
        });

        it('should clear all elements', () => {
            c.clear();
            expect(Object.keys(c.els).length).toBe(0);
        });

        it('compose should override when composing an already existing element', () => {
            c.add('test1', /test1/);
            c.add('test2', /test2/);
            c.compose('test', 'cx(test1)|cx(test2)');
            expect(c.get('test')).toEqual(/test1|test2/);
            c.compose('test', '^cx(test2):cx(test1)$');
            expect(c.get('test')).toEqual(/^test2:test1$/);
        });
    });

    describe('errors', () => {
        beforeEach(() => c.clear());
        it('should check element regex', () => {
            expect(() => c.add('test', 'not-a-regexp')).toThrow('expected valid rx');
        });

        it('should remove an element', () => {
            c.add('test', /test/);
            c.remove('test');
            expect(c.get('test')).toBeUndefined();
        });
        it('should throw error on invalid element name', () => {
            expect(() => c.add('', /test/)).toThrow('non-empty string expected');
            expect(() => c.add(123, /test/)).toThrow('non-empty string expected');
        });

        it('should throw error on invalid element regex', () => {
            expect(() => c.add('test', 'not-a-regexp')).toThrow('expected valid rx');
        });

        
        it('should throw an error when attempting to remove an element not passing a valid string', () => {
            expect(() => c.remove()).toThrow('non-empty string expected');
        });
        

        it('should throw ', () => {
            expect(() => c.match()).toThrow('non-empty string expected');
        });
        it('should throw with no string search', () => {
            c.add('test', /test/);
            expect(() => c.match('test', 1)).toThrow('a string is needed');
        });

        
        it('should throw an error when the template name is an empty string or is not passed', () => {
            const err = 'non-empty string expected';
            expect(() => c.compose('a', '')).toThrow(err);
            expect(() => c.compose('b')).toThrow(err);
            expect(() => c.compose('b', true)).toThrow(err);
            expect(() => c.compose('c', /^$/)).toThrow(err);
        });

        it('test ', () => {
            expect(() => c.test('', '')).toThrow('non-empty string expected');
            expect(() => c.test()).toThrow('non-empty string expected');
        });
    });
});
