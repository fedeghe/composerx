const c  = require('../dist/index.js');


describe('quartzcron', () => {
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
            c.compose('md/md', 'cx(md)/cx(md)');
            c.compose('md-md', 'cx(md)-cx(md)');
            c.compose('md-md/md', 'cx(md)-cx(md)/cx(md)');
            c.compose('mdW', 'cx(md)W');
            c.compose('L-md', 'L-cx(md)');
        });

        test.each([
            ['md/md', '12/28', ['12/28', '12', '28', undefined]],
            ['md-md', '12-28', ['12-28', '12', '28', undefined]],
            ['md-md/md', '12-28/3', ['12-28/3', '12', '28', '3', undefined]],
            ['mdW', '12W', ['12W', '12']],
            ['L-md', 'L-23', ['L-23', '23']],
        ])('%s', (rxName, input, expected) => {
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
