const c  = require('../dist/index.js');


describe('composerx', () => {
    
    it('build some simple working rx', () => {
        // add two simple elements
        c.add('word', /([a-zA-Z]+)/);
        c.add('number', /(\d+)/);
        
        /**
         * now we want to compose one or more rx only using the existing elements
         */
        c.compose('rx1', 'RC(word)#RC(number)');
        const r1 = c.match('rx1', 'abc#123').results;
        expect(r1[1]).toBe('abc');
        expect(r1[2]).toBe('123');
        
        c.compose('rx2', 'RC(word):RC(word)');
        const r2 = c.match('rx2', 'abc:sss').results;
        expect(r2[1]).toBe('abc');
        expect(r2[2]).toBe('sss');
        
        c.compose('rx3', 'RC(number)/RC(number)');
        const r3 = c.match('rx3', '123/456').results;
        expect(r3[1]).toBe('123');
        expect(r3[2]).toBe('456');
        
        c.compose('rxOR', 'RC(number)|RC(word)', {group:true});
        const rOR1 = c.match('rxOR', '123').results;
        expect(rOR1[1]).toBe('123');

        const rOR2_1 = c.match('rxOR', 'aaas').results;
        expect(rOR2_1[1]).toBe('aaas');

        const rOR2_2 = c.match('rxOR', 'aaas1212').results;
        expect(rOR2_2).toBe(null);

    });

    describe('day of month example', () => {
        beforeAll(() => {
            // add two simple elements
            c.add('1-31', /(\d|[1-2]\d|3[01])/);
            c.add('1-7', /([1-7]+)/);
            c.compose('dow', 'RC(1-31)/RC(1-7)');
        });
        describe('positive cases', () => {
            test.each([
                [ '2/7', ['2', '7'] ],
                [ '31/7', ['31', '7'] ]
            ])('%s', (input, expected) => {
                const r = c.match('dow', input).results;
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
                const r = c.match('dow', input).results;
                expect(r).toBe(null);
                
            });
        });
    });


    describe('other static methods', () => {
        it('should check element name', () => {
            expect(() => c.add('', /test/)).toThrow('Element must be a non-empty string');
            expect(() => c.add(123, /test/)).toThrow('Element must be a non-empty string');
        });

        it('should check element regex', () => {
            expect(() => c.add('test', 'not-a-regexp')).toThrow('expected valid rx');
        });

        it('should remove an element', () => {
            c.add('test', /test/);
            c.remove('test');
            expect(() => c.match('test', 'some string')).toThrow('element not found');
        });
        it('should throw an error when attempting to remove an element which does not exist', () => {
            expect(() => c.remove('nonexistent')).toThrow('element not found');
        });


        it('should clear all elements', () => {
            c.clearAll();
            expect(Object.keys(c.els).length).toBe(0);
            expect(c.results).toBe(null);
        });

        it('compose should throw and error when trying to create an already existing element', () => {
            c.add('test', /test/);
            expect(() => c.compose('test', 'RC(test)')).toThrow('Element already exists');
        });
    });

    describe('errors', () => {
        it('should throw error on invalid element name', () => {
            expect(() => c.add('', /test/)).toThrow('Element must be a non-empty string');
            expect(() => c.add(123, /test/)).toThrow('Element must be a non-empty string');
        });

        it('should throw error on invalid element regex', () => {
            expect(() => c.add('test', 'not-a-regexp')).toThrow('expected valid rx');
        });

        it('should throw error on duplicate element name', () => {
            c.clearAll();
            c.add('test', /test/);
            expect(() => c.add('test', /another-test/)).toThrow('Element already exists');
        });

        it('should remove an element', () => {
            c.remove('test');
            expect(() => c.match('test', 'some string')).toThrow('element not found');
        });

        it('should throw ', () => {
            expect(() => c.match()).toThrow('name must be a non-empty string');
        });

        it('should clear all elements', () => {
            c.clearAll();
            expect(Object.keys(c.els).length).toBe(0);
        });
        it('should throw an error when the template name is an empty string or is not passed', () => {
            const err = 'Template must be a non-empty string';
            expect(() => c.compose('a', '')).toThrow(err);
            expect(() => c.compose('b')).toThrow(err);
            expect(() => c.compose('b', true)).toThrow(err);
            expect(() => c.compose('c', /^$/)).toThrow(err);
        });
    });
});
