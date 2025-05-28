const c  = require('../dist/index.js');


describe('wild tests', () => {

    beforeEach(() => {
        c.clear();
        // add some common rx elements
        [
            ['word', /([a-zA-Z]+)/],
            ['number', /(\d+)/],
            ['date', /(\d{4}-\d{2}-\d{2})/],
            ['email', /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/],
            ['url', /(https?:\/\/[^\s]+)/],
            ['phone', /(\+?\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?(\d{3,4}[-.\s]?\d{4})/],
            ['hexcolor', /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/],
            ['ipv4', /((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){4}/],
            ['time', /(([01]?\d|2[0-3]):([0-5]\d))/],
            ['uuid', /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/],
            ['currency', /(\$|€|£)?\d+(\.\d{2})?/],
            ['ipaddress', /((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){4}/]
        ].forEach(([name, rx]) => c.add(name, rx));
        //compose some now even using | and & 
        c.compose('wordOrNumber', 'cx(word)|cx(number)', {autogroup: true});
        c.compose('dateAndTime', 'cx(date) cx(time)', {autogroup: true});
        c.compose('emailOrUrl', 'cx(email)|cx(url)', {autogroup: true});
        c.compose('phoneOrEmail', 'cx(phone)|cx(email)', {autogroup: true});
        
    });

    test.each([
        ['wordOrNumber', 'abc', ['abc','abc','abc',undefined]],
        ['wordOrNumber', '123', ['123', '123',undefined, '123']],
        ['wordOrNumber', 'abc123', null],
        ['dateAndTime', '2023-10-01 12:30', ['2023-10-01 12:30','2023-10-01 12:30','2023-10-01','12:30', '12', '30']],
        ['dateAndTime', '2023-10-01 25:61', null],
        ['emailOrUrl', 'fedeghe@gmail.com', ['fedeghe@gmail.com', 'fedeghe@gmail.com','fedeghe@gmail.com', undefined]],
        ['emailOrUrl', 'https://example.com', ['https://example.com', 'https://example.com', undefined, 'https://example.com']],
        ['emailOrUrl', 'not-an-email-or-url', null],
        ['phoneOrEmail', '+1234567890', ['+1234567890', '+1234567890','+123', undefined,'4567890', undefined]],
        ['phoneOrEmail', 'fedeghe@gmail.com', ['fedeghe@gmail.com','fedeghe@gmail.com',undefined, undefined, undefined, 'fedeghe@gmail.com']]
    ])('%s', (rxName, input, expected) => {
        const result = c.match(rxName, input);
        if (expected === null) {
            expect(result).toBeNull();
            return;
        }
        expect(result).toBeTruthy();
        // expect(result.length).toBe(expected.length + 1); // +1 for the full match
        expect([...result]).toMatchObject(expected);
    });

    test.each([
        ['wordOrNumber', 'abc', ['abc','abc','abc']],
        ['wordOrNumber', '123', ['123', '123', '123']],
        ['wordOrNumber', 'abc123', null],
        ['dateAndTime', '2023-10-01 12:30', ['2023-10-01 12:30','2023-10-01 12:30','2023-10-01','12:30', '12', '30']],
        ['dateAndTime', '2023-10-01 25:61', null],
        ['emailOrUrl', 'fedeghe@gmail.com', ['fedeghe@gmail.com', 'fedeghe@gmail.com','fedeghe@gmail.com']],
        ['emailOrUrl', 'https://example.com', ['https://example.com', 'https://example.com', 'https://example.com']],
        ['emailOrUrl', 'not-an-email-or-url', null],
        ['phoneOrEmail', '+1234567890', ['+1234567890', '+1234567890','+123','4567890']],
        ['phoneOrEmail', 'fedeghe@gmail.com', ['fedeghe@gmail.com','fedeghe@gmail.com', 'fedeghe@gmail.com']]
    ])('%s', (rxName, input, expected) => {
        const result = c.match(rxName, input, {definedOnly: true});
        if (expected === null) {
            expect(result).toBeNull();
            return;
        }
        expect(result).toBeTruthy();
        // expect(result.length).toBe(expected.length + 1); // +1 for the full match
        expect([...result]).toMatchObject(expected);
    });
   
    
});
