[![codecov](https://codecov.io/gh/fedeghe/composerx/graph/badge.svg?token=WWXU4IU4WT)](https://codecov.io/gh/fedeghe/composerx)
 
![GitHub top language](https://img.shields.io/github/languages/top/fedeghe/composerx?labelColor=%23fede76) ![Static Badge](https://img.shields.io/badge/Human%20coded-100%25-blue?style=plastic) ![npm package minimized gzipped size](https://img.shields.io/bundlejs/size/composerx)


![track](https://click.jmvc.org/p/pBXq70mW/1)


# composerx maltaV('PACKAGE.version')  

Never write the same regexp again, ...ok, ...almost!

In less than 1KB _composerx_ aims to help to:  
1. define a specific _RegExp_ (once)
2. reuse defined ones to define another _RegExp_
3. go back to 1 or 2

```js
const crx = require('composerx');

crx.add('1-31', /^(([1-9])|([1-2]\d)|(3[01]))$/);
crx.add('3letters',  /^([a-z]{3})$/i);
crx.compose(
    'myComposedRx',
    'cx(1-31)|cx(3letters)',
);


const res1 = crx.match('myComposedRx', '3'),
    res2 = crx.match('myComposedRx', 'abf');

console.log(crx.get('myComposedRx').source)


console.log({
    res1,
    // ['3', '3', '3', '3', undefined, ...]
    
    res2 
    // ['abf', undefined, undefined, undefined, undefined, 'abf', ....]
    
    myComposedRx: crx.get('myComposedRx').source
    // (^(([1-9])|([1-2]\d)|(3[01]))$|^([a-z]{3})$)
});
```
# API

All methods are _static_, thus no need for instances.  
All chainable methods show a 🔗  

### `composerx.add(String name, RegExp rx)`  
Adds a named _element_ to the set of the reusable ones.  
- **throws**  
when `name` is not a truthy string  
    when `rx` is not a RegExp  
- **overrides**  
    in case an _element_ with that name exists already  

**returns**: 🔗  

---
### `composerx.get(String name)`  
Retrives an element when existing, `null` otherwise.     
- **throws**  
    when `name` is not a truthy string.  

**returns**:
the named element if it exists, `undefined` otherwise

---
### `composerx.remove(String name)`   
Removes an existing _element_  
- **throws**  
    when `name` is not a string or  is an empty string.  
- **no effect**  
    when the element is not found.  

**returns**: 🔗  

---
### `composerx.compose(String name, String tpl)`  
Creates a new the elements named _name_  (or overrides an existing one) using the template passed to create the new RegExp using previously added elements.  
To use an existing element add for it a placeholder inside the `tpl` parameter (see the example above).  
The placeholder for element named `myRx1` is `cx(myRx1)`.  

- **throws**  
    when `name` or `tpl` is not a string or is empty string.  

**returns**: 🔗  

---
### `composerx.match(String name, String search, {definedOnly = false})`  
Run a match of the _search_ against the elements named _name_  
- **throws**  
    when `name` is not a string or is empty string.  
    when `search` is not string.  

- `options.definedOnly`: when passed as `true` all `undefined` will be filtered out from the resulting array

**returns**:
the rx match output or `undefined` when the element does not exists

---
### `composerx.test(String name, String search, {definedOnly = false})`  
Run a test of the _search_ against the elements named _name_  
- **throws**  
    when `name` is not a string or is empty string.  
    when `search` is not string.  

**returns**: Boolean

---
### `composerx.clear()`  
Removes all stored elements.  

**returns**: 🔗  




