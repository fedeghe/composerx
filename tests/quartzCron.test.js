const c  = require('../dist/index.js');


describe('quartzcron like', () => {
    describe('dom', () => {
        beforeEach(() => {
            c.clear();
            // add some common rx elements
            [
                ['md', /([1-9]|1[0-9]|2[0-9]|3[01])/], // monthDay
                ['wd', /([1-7])/], // weekDay
                ['wdLab', /(SUN|MON|TUE|WED|THU|FRI|SAT)/], // weekDay labels
                ['w#', /([1-5])/], // week number
                ['0-59', /([0-5]{1}[0-9]{1}|[0-9]{1})/],
                ['0-23', /([01]\d|2[0-3]|\d)/],
            ].forEach(([name, rx]) => c.add(name, rx));
            
            // compose some
            c.compose('md/md', '^cx(md)/cx(md)$');
            c.compose('md-md', '^cx(md)-cx(md)$');
            c.compose('md-md/md', '^cx(md)-cx(md)/cx(md)$');
            c.compose('mdW', '^cx(md)W$');
            c.compose('L-md', '^L-cx(md)$');

            c.compose('mdORmd/md', '^(cx(md)|cx(md)/cx(md))$');
            c.compose('wdOR*/wd', '^cx(wd)|(\\*/cx(wd))$');
            c.compose('wdORwd/wd', '^cx(wd)|(cx(wd)/cx(wd))$');
            c.compose('wd-wd', '^cx(wd)-cx(wd)$');
            c.compose('wd-wd/wd', '^cx(wd)-cx(wd)/cx(wd)$');
            c.compose('wd#wdn', '^cx(wd)#cx(w#)$');
            c.compose('wdL', '^cx(wd)L$');
        });
// ␀
        test.each([
            ['md/md', '',           '12/28', ['12/28', '12', '28', undefined]],
            ['md-md', '',           '12-28', ['12-28', '12', '28', undefined]],
            ['md-md', '∅',         '12-58', null],
            ['md-md/md', 'plain',   '12-28/3', ['12-28/3', '12', '28', '3', undefined]],
            ['md-md/md', '∅',      '32-28/3', null],
            ['mdW', 'plain',        '12W', ['12W', '12']],
            ['mdW', '∅',           '42W', null],
            ['L-md', 'plain',       'L-23', ['L-23', '23']],
            ['L-md', '∅',          'L23', null],
            
            ['mdORmd/md', 'first',      '23', ['23', '23', '23']],
            ['mdORmd/md', 'OR branch',  '23/24', ['23/24', '23/24', undefined, '23','24']],
            ['mdORmd/md', '∅',         '43/24', null],

            ['wdOR*/wd', 'first',       '3', ['3', '3', undefined, undefined]],
            ['wdOR*/wd', 'OR branch',   '*/3', ['*/3', undefined, '*/3', '3']],
            ['wdOR*/wd', '∅',          '*6/3', null],
            ['wdOR*/wd', '1st ∅',          '8', null],
            ['wdOR*/wd', '2nd ∅',          '*/9', null],
            
            ['wd-wd', 'plain',       '3-5', ['3-5', '3', '5', undefined]],
            ['wd-wd', '1st ∅',       '8-5', null],
            ['wd-wd', '2nd ∅',       '5-8', null],
            
            ['wd-wd/wd', 'plain',       '3-5/2', ['3-5/2', '3', '5', '2']],
            ['wd-wd/wd', '1st ∅',       '32-5/2', null],
            ['wd-wd/wd', '2nd ∅',       '2-45/2', null],
            ['wd-wd/wd', '3rd ∅',       '2-5/82', null],
            
            ['wd#wdn', 'plain',       '3#2', ['3#2', '3', '2']],
            ['wd#wdn', 'plain 2',       '7#1', ['7#1', '7', '1']],
            ['wd#wdn', 'plain 3',       '7#5', ['7#5', '7', '5']],
            ['wd#wdn', '1st ∅',       '8#2', null],
            ['wd#wdn', '2nd ∅',       '2#6', null],
            ['wd#wdn', '3rd ∅',       '7#6', null],

            ['wdL', 'plain 3',       '3L', ['3L', '3']],
            ['wdL', 'plain 1',       '1L', ['1L', '1']],
            ['wdL', '0 ∅',       '0L', null],
            
        // eslint-disable-next-line no-unused-vars
        ])('%s %s', (rxName, _, input, expected) => {
            const result = c.match(rxName, input);
            // console.log(c.get(rxName));
            // console.log(result);
            if (expected === null) {
                expect(result).toBeNull();
                return;
            } else {
                expect(result).toBeTruthy();
                expect([...result]).toMatchObject(expected);
            }
        });

    
        
    });
    
    describe('full 7 fields', () => {
        beforeEach(() => {
            c.clear();
            // add some common rx elements
            c.add('*', /(\*)/);
            c.add('0-59', /([0-5]?\d)/);
            c.compose('*0-59', '^(cx(*)|cx(0-59))$');
            c.compose('0-59-with-cadence', '^(cx(0-59)/cx(0-59))$');
            c.compose('0-59-range', '^(cx(0-59)-cx(0-59))$');
            c.compose('0-59-range-with-cadence', '^(cx(0-59)-cx(0-59)/cx(0-59))$');
            c.compose(
                '0-59-full',
                '^(cx(*)|cx(*0-59)|cx(0-59)|cx(0-59-with-cadence)|cx(0-59-range)|cx(0-59-range-with-cadence))$'
            );
        });
        
        test.each([
            ['0-59-full',
                '*', [
                    "*", "*", "*", 
                ]
            ],
            ['0-59-full',
                '45', [
                    '45', "45",
                    undefined, "45", undefined, "45"
                ]
            ],
            ['0-59-full',
                '45/5', [
                    '45/5', "45/5",
                    undefined, undefined, undefined, undefined, undefined, "45/5", "45", "5"
                ]
            ],
            ['0-59-full',
                '45-55', [
                    '45-55', "45-55",
                    undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
                    "45-55", "45", "55"
                ]
            ],
            ['0-59-full',
                '5-15/3', [
                    '5-15/3', "5-15/3",
                    undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
                    "5-15/3", "5", "15", "3"
                ]
            ],
        // eslint-disable-next-line no-unused-vars
        ])('%s %s', (rxName, input, expected) => {
            const result = c.match(rxName, input);
            
            if (expected === null) {
                expect(result).toBeNull();
                return;
            } else {
                expect(result).toBeTruthy();
                expect([...result]).toMatchObject(expected);
            }
        });
        
    });
    
});
