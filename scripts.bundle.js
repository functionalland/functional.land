function _isPlaceholder(a) {
    return a != null && typeof a === 'object' && a['@@functional/placeholder'] === true;
}
function _curry1(fn) {
    return function f1(a) {
        if (arguments.length === 0 || _isPlaceholder(a)) {
            return f1;
        } else {
            return fn.apply(this, arguments);
        }
    };
}
function _curry2(fn) {
    return function f2(a, b) {
        switch(arguments.length){
            case 0:
                return f2;
            case 1:
                return _isPlaceholder(a) ? f2 : _curry1(function(_b) {
                    return fn(a, _b);
                });
            default:
                return _isPlaceholder(a) && _isPlaceholder(b) ? f2 : _isPlaceholder(a) ? _curry1(function(_a) {
                    return fn(_a, b);
                }) : _isPlaceholder(b) ? _curry1(function(_b) {
                    return fn(a, _b);
                }) : fn(a, b);
        }
    };
}
function _curry3(fn) {
    return function f3(a, b, c) {
        switch(arguments.length){
            case 0:
                return f3;
            case 1:
                return _isPlaceholder(a) ? f3 : _curry2(function(_b, _c) {
                    return fn(a, _b, _c);
                });
            case 2:
                return _isPlaceholder(a) && _isPlaceholder(b) ? f3 : _isPlaceholder(a) ? _curry2(function(_a, _c) {
                    return fn(_a, b, _c);
                }) : _isPlaceholder(b) ? _curry2(function(_b, _c) {
                    return fn(a, _b, _c);
                }) : _curry1(function(_c) {
                    return fn(a, b, _c);
                });
            default:
                return _isPlaceholder(a) && _isPlaceholder(b) && _isPlaceholder(c) ? f3 : _isPlaceholder(a) && _isPlaceholder(b) ? _curry2(function(_a, _b) {
                    return fn(_a, _b, c);
                }) : _isPlaceholder(a) && _isPlaceholder(c) ? _curry2(function(_a, _c) {
                    return fn(_a, b, _c);
                }) : _isPlaceholder(b) && _isPlaceholder(c) ? _curry2(function(_b, _c) {
                    return fn(a, _b, _c);
                }) : _isPlaceholder(a) ? _curry1(function(_a) {
                    return fn(_a, b, c);
                }) : _isPlaceholder(b) ? _curry1(function(_b) {
                    return fn(a, _b, c);
                }) : _isPlaceholder(c) ? _curry1(function(_c) {
                    return fn(a, b, _c);
                }) : fn(a, b, c);
        }
    };
}
function _has(prop, obj) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}
var mergeWithKey = _curry3(function mergeWithKey(fn, l, r) {
    var result = {
    };
    var k;
    for(k in l){
        if (_has(k, l)) {
            result[k] = _has(k, r) ? fn(k, l[k], r[k]) : l[k];
        }
    }
    for(k in r){
        if (_has(k, r) && !_has(k, result)) {
            result[k] = r[k];
        }
    }
    return result;
});
function _isObject(x) {
    return Object.prototype.toString.call(x) === '[object Object]';
}
var mergeDeepWithKey = _curry3(function mergeDeepWithKey(fn, lObj, rObj) {
    return mergeWithKey(function(k, lVal, rVal) {
        if (_isObject(lVal) && _isObject(rVal)) {
            return mergeDeepWithKey(fn, lVal, rVal);
        } else {
            return fn(k, lVal, rVal);
        }
    }, lObj, rObj);
});
function _concat(set1, set2) {
    set1 = set1 || [];
    set2 = set2 || [];
    var idx;
    var len1 = set1.length;
    var len2 = set2.length;
    var result = [];
    idx = 0;
    while(idx < len1){
        result[result.length] = set1[idx];
        idx += 1;
    }
    idx = 0;
    while(idx < len2){
        result[result.length] = set2[idx];
        idx += 1;
    }
    return result;
}
var zipObj = _curry2(function zipObj(keys, values) {
    var idx = 0;
    var len = Math.min(keys.length, values.length);
    var out = {
    };
    while(idx < len){
        out[keys[idx]] = values[idx];
        idx += 1;
    }
    return out;
});
function _arity(n, fn) {
    switch(n){
        case 0:
            return function() {
                return fn.apply(this, arguments);
            };
        case 1:
            return function(a0) {
                return fn.apply(this, arguments);
            };
        case 2:
            return function(a0, a1) {
                return fn.apply(this, arguments);
            };
        case 3:
            return function(a0, a1, a2) {
                return fn.apply(this, arguments);
            };
        case 4:
            return function(a0, a1, a2, a3) {
                return fn.apply(this, arguments);
            };
        case 5:
            return function(a0, a1, a2, a3, a4) {
                return fn.apply(this, arguments);
            };
        case 6:
            return function(a0, a1, a2, a3, a4, a5) {
                return fn.apply(this, arguments);
            };
        case 7:
            return function(a0, a1, a2, a3, a4, a5, a6) {
                return fn.apply(this, arguments);
            };
        case 8:
            return function(a0, a1, a2, a3, a4, a5, a6, a7) {
                return fn.apply(this, arguments);
            };
        case 9:
            return function(a0, a1, a2, a3, a4, a5, a6, a7, a8) {
                return fn.apply(this, arguments);
            };
        case 10:
            return function(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
                return fn.apply(this, arguments);
            };
        default:
            throw new Error('First argument to _arity must be a non-negative integer no greater than ten');
    }
}
function _curryN(length, received, fn) {
    return function() {
        var combined = [];
        var argsIdx = 0;
        var left = length;
        var combinedIdx = 0;
        while(combinedIdx < received.length || argsIdx < arguments.length){
            var result;
            if (combinedIdx < received.length && (!_isPlaceholder(received[combinedIdx]) || argsIdx >= arguments.length)) {
                result = received[combinedIdx];
            } else {
                result = arguments[argsIdx];
                argsIdx += 1;
            }
            combined[combinedIdx] = result;
            if (!_isPlaceholder(result)) {
                left -= 1;
            }
            combinedIdx += 1;
        }
        return left <= 0 ? fn.apply(this, combined) : _arity(left, _curryN(length, combined, fn));
    };
}
var curryN = _curry2(function curryN(length, fn) {
    if (length === 1) {
        return _curry1(fn);
    }
    return _arity(length, _curryN(length, [], fn));
});
function _isFunction(x) {
    var type = Object.prototype.toString.call(x);
    return type === '[object Function]' || type === '[object AsyncFunction]' || type === '[object GeneratorFunction]' || type === '[object AsyncGeneratorFunction]';
}
function _objectIs(a, b) {
    if (a === b) {
        return a !== 0 || 1 / a === 1 / b;
    } else {
        return a !== a && b !== b;
    }
}
const __default = typeof Object.is === 'function' ? Object.is : _objectIs;
var type = _curry1(function type(val) {
    return val === null ? 'Null' : val === undefined ? 'Undefined' : Object.prototype.toString.call(val).slice(8, -1);
});
function _functionName(f) {
    var match = String(f).match(/^function (\w*)/);
    return match == null ? '' : match[1];
}
var toString = Object.prototype.toString;
var _isArguments = function() {
    return toString.call(arguments) === '[object Arguments]' ? function _isArguments(x) {
        return toString.call(x) === '[object Arguments]';
    } : function _isArguments(x) {
        return _has('callee', x);
    };
}();
var hasEnumBug = !({
    toString: null
}).propertyIsEnumerable('toString');
var nonEnumerableProps = [
    'constructor',
    'valueOf',
    'isPrototypeOf',
    'toString',
    'propertyIsEnumerable',
    'hasOwnProperty',
    'toLocaleString'
];
var hasArgsEnumBug = function() {
    'use strict';
    return arguments.propertyIsEnumerable('length');
}();
var contains = function contains(list, item) {
    var idx = 0;
    while(idx < list.length){
        if (list[idx] === item) {
            return true;
        }
        idx += 1;
    }
    return false;
};
var keys = typeof Object.keys === 'function' && !hasArgsEnumBug ? _curry1(function keys(obj) {
    return Object(obj) !== obj ? [] : Object.keys(obj);
}) : _curry1(function keys(obj) {
    if (Object(obj) !== obj) {
        return [];
    }
    var prop, nIdx;
    var ks = [];
    var checkArgsLength = hasArgsEnumBug && _isArguments(obj);
    for(prop in obj){
        if (_has(prop, obj) && (!checkArgsLength || prop !== 'length')) {
            ks[ks.length] = prop;
        }
    }
    if (hasEnumBug) {
        nIdx = nonEnumerableProps.length - 1;
        while(nIdx >= 0){
            prop = nonEnumerableProps[nIdx];
            if (_has(prop, obj) && !contains(ks, prop)) {
                ks[ks.length] = prop;
            }
            nIdx -= 1;
        }
    }
    return ks;
});
function _arrayFromIterator(iter) {
    var list = [];
    var next;
    while(!(next = iter.next()).done){
        list.push(next.value);
    }
    return list;
}
function _includesWith(pred, x, list) {
    var idx = 0;
    var len = list.length;
    while(idx < len){
        if (pred(x, list[idx])) {
            return true;
        }
        idx += 1;
    }
    return false;
}
function _uniqContentEquals(aIterator, bIterator, stackA, stackB) {
    var a = _arrayFromIterator(aIterator);
    var b = _arrayFromIterator(bIterator);
    function eq(_a, _b) {
        return _equals(_a, _b, stackA.slice(), stackB.slice());
    }
    return !_includesWith(function(b1, aItem) {
        return !_includesWith(eq, aItem, b1);
    }, b, a);
}
function _equals(a, b, stackA, stackB) {
    if (__default(a, b)) {
        return true;
    }
    var typeA = type(a);
    if (typeA !== type(b)) {
        return false;
    }
    if (typeof a['fantasy-land/equals'] === 'function' || typeof b['fantasy-land/equals'] === 'function') {
        return typeof a['fantasy-land/equals'] === 'function' && a['fantasy-land/equals'](b) && typeof b['fantasy-land/equals'] === 'function' && b['fantasy-land/equals'](a);
    }
    if (typeof a.equals === 'function' || typeof b.equals === 'function') {
        return typeof a.equals === 'function' && a.equals(b) && typeof b.equals === 'function' && b.equals(a);
    }
    switch(typeA){
        case 'Arguments':
        case 'Array':
        case 'Object':
            if (typeof a.constructor === 'function' && _functionName(a.constructor) === 'Promise') {
                return a === b;
            }
            break;
        case 'Boolean':
        case 'Number':
        case 'String':
            if (!(typeof a === typeof b && __default(a.valueOf(), b.valueOf()))) {
                return false;
            }
            break;
        case 'Date':
            if (!__default(a.valueOf(), b.valueOf())) {
                return false;
            }
            break;
        case 'Error':
            return a.name === b.name && a.message === b.message;
        case 'RegExp':
            if (!(a.source === b.source && a.global === b.global && a.ignoreCase === b.ignoreCase && a.multiline === b.multiline && a.sticky === b.sticky && a.unicode === b.unicode)) {
                return false;
            }
            break;
    }
    var idx = stackA.length - 1;
    while(idx >= 0){
        if (stackA[idx] === a) {
            return stackB[idx] === b;
        }
        idx -= 1;
    }
    switch(typeA){
        case 'Map':
            if (a.size !== b.size) {
                return false;
            }
            return _uniqContentEquals(a.entries(), b.entries(), stackA.concat([
                a
            ]), stackB.concat([
                b
            ]));
        case 'Set':
            if (a.size !== b.size) {
                return false;
            }
            return _uniqContentEquals(a.values(), b.values(), stackA.concat([
                a
            ]), stackB.concat([
                b
            ]));
        case 'Arguments':
        case 'Array':
        case 'Object':
        case 'Boolean':
        case 'Number':
        case 'String':
        case 'Date':
        case 'Error':
        case 'RegExp':
        case 'Int8Array':
        case 'Uint8Array':
        case 'Uint8ClampedArray':
        case 'Int16Array':
        case 'Uint16Array':
        case 'Int32Array':
        case 'Uint32Array':
        case 'Float32Array':
        case 'Float64Array':
        case 'ArrayBuffer': break;
        default:
            return false;
    }
    var keysA = keys(a);
    if (keysA.length !== keys(b).length) {
        return false;
    }
    var extendedStackA = stackA.concat([
        a
    ]);
    var extendedStackB = stackB.concat([
        b
    ]);
    idx = keysA.length - 1;
    while(idx >= 0){
        var key = keysA[idx];
        if (!(_has(key, b) && _equals(b[key], a[key], extendedStackA, extendedStackB))) {
            return false;
        }
        idx -= 1;
    }
    return true;
}
var equals = _curry2(function equals(a, b) {
    return _equals(a, b, [], []);
});
function _indexOf(list, a, idx) {
    var inf, item;
    if (typeof list.indexOf === 'function') {
        switch(typeof a){
            case 'number':
                if (a === 0) {
                    inf = 1 / a;
                    while(idx < list.length){
                        item = list[idx];
                        if (item === 0 && 1 / item === inf) {
                            return idx;
                        }
                        idx += 1;
                    }
                    return -1;
                } else if (a !== a) {
                    while(idx < list.length){
                        item = list[idx];
                        if (typeof item === 'number' && item !== item) {
                            return idx;
                        }
                        idx += 1;
                    }
                    return -1;
                }
                return list.indexOf(a, idx);
            case 'string':
            case 'boolean':
            case 'function':
            case 'undefined':
                return list.indexOf(a, idx);
            case 'object':
                if (a === null) {
                    return list.indexOf(a, idx);
                }
        }
    }
    while(idx < list.length){
        if (equals(list[idx], a)) {
            return idx;
        }
        idx += 1;
    }
    return -1;
}
function _includes(a, list) {
    return _indexOf(list, a, 0) >= 0;
}
function _map(fn, functor) {
    var idx = 0;
    var len = functor.length;
    var result = Array(len);
    while(idx < len){
        result[idx] = fn(functor[idx]);
        idx += 1;
    }
    return result;
}
function _quote(s) {
    var escaped = s.replace(/\\/g, '\\\\').replace(/[\b]/g, '\\b').replace(/\f/g, '\\f').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t').replace(/\v/g, '\\v').replace(/\0/g, '\\0');
    return '"' + escaped.replace(/"/g, '\\"') + '"';
}
const __default1 = Array.isArray || function _isArray(val) {
    return val != null && val.length >= 0 && Object.prototype.toString.call(val) === '[object Array]';
};
function _isTransformer(obj) {
    return obj != null && typeof obj['@@transducer/step'] === 'function';
}
function _dispatchable(methodNames, transducerCreator, fn) {
    return function() {
        if (arguments.length === 0) {
            return fn();
        }
        var obj = arguments[arguments.length - 1];
        if (!__default1(obj)) {
            var idx = 0;
            while(idx < methodNames.length){
                if (typeof obj[methodNames[idx]] === 'function') {
                    return obj[methodNames[idx]].apply(obj, Array.prototype.slice.call(arguments, 0, -1));
                }
                idx += 1;
            }
            if (_isTransformer(obj)) {
                var transducer = transducerCreator.apply(null, Array.prototype.slice.call(arguments, 0, -1));
                return transducer(obj);
            }
        }
        return fn.apply(this, arguments);
    };
}
function XFilter(f, xf) {
    this.xf = xf;
    this.f = f;
}
const __default2 = {
    init: function() {
        return this.xf['@@transducer/init']();
    },
    result: function(result) {
        return this.xf['@@transducer/result'](result);
    }
};
XFilter.prototype['@@transducer/init'] = __default2.init;
XFilter.prototype['@@transducer/result'] = __default2.result;
XFilter.prototype['@@transducer/step'] = function(result, input) {
    return this.f(input) ? this.xf['@@transducer/step'](result, input) : result;
};
var _xfilter = _curry2(function _xfilter(f, xf) {
    return new XFilter(f, xf);
});
function XWrap(fn) {
    this.f = fn;
}
XWrap.prototype['@@transducer/init'] = function() {
    throw new Error('init not implemented on XWrap');
};
XWrap.prototype['@@transducer/result'] = function(acc) {
    return acc;
};
XWrap.prototype['@@transducer/step'] = function(acc, x) {
    return this.f(acc, x);
};
function _xwrap(fn) {
    return new XWrap(fn);
}
function _isString(x) {
    return Object.prototype.toString.call(x) === '[object String]';
}
var _isArrayLike = _curry1(function isArrayLike(x) {
    if (__default1(x)) {
        return true;
    }
    if (!x) {
        return false;
    }
    if (typeof x !== 'object') {
        return false;
    }
    if (_isString(x)) {
        return false;
    }
    if (x.length === 0) {
        return true;
    }
    if (x.length > 0) {
        return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
    }
    return false;
});
function _arrayReduce(xf, acc, list) {
    var idx = 0;
    var len = list.length;
    while(idx < len){
        acc = xf['@@transducer/step'](acc, list[idx]);
        if (acc && acc['@@transducer/reduced']) {
            acc = acc['@@transducer/value'];
            break;
        }
        idx += 1;
    }
    return xf['@@transducer/result'](acc);
}
function _iterableReduce(xf, acc, iter) {
    var step = iter.next();
    while(!step.done){
        acc = xf['@@transducer/step'](acc, step.value);
        if (acc && acc['@@transducer/reduced']) {
            acc = acc['@@transducer/value'];
            break;
        }
        step = iter.next();
    }
    return xf['@@transducer/result'](acc);
}
var bind = _curry2(function bind(fn, thisObj) {
    return _arity(fn.length, function() {
        return fn.apply(thisObj, arguments);
    });
});
function _methodReduce(xf, acc, obj, methodName) {
    return xf['@@transducer/result'](obj[methodName](bind(xf['@@transducer/step'], xf), acc));
}
var symIterator = typeof Symbol !== 'undefined' ? Symbol.iterator : '@@iterator';
function _reduce(fn, acc, list) {
    if (typeof fn === 'function') {
        fn = _xwrap(fn);
    }
    if (_isArrayLike(list)) {
        return _arrayReduce(fn, acc, list);
    }
    if (typeof list['fantasy-land/reduce'] === 'function') {
        return _methodReduce(fn, acc, list, 'fantasy-land/reduce');
    }
    if (list[symIterator] != null) {
        return _iterableReduce(fn, acc, list[symIterator]());
    }
    if (typeof list.next === 'function') {
        return _iterableReduce(fn, acc, list);
    }
    if (typeof list.reduce === 'function') {
        return _methodReduce(fn, acc, list, 'reduce');
    }
    throw new TypeError('reduce: list must be array or iterable');
}
function _filter(fn, list) {
    var idx = 0;
    var len = list.length;
    var result = [];
    while(idx < len){
        if (fn(list[idx])) {
            result[result.length] = list[idx];
        }
        idx += 1;
    }
    return result;
}
var filter = _curry2(_dispatchable([
    'fantasy-land/filter',
    'filter'
], _xfilter, function(pred, filterable) {
    return _isObject(filterable) ? _reduce(function(acc, key) {
        if (pred(filterable[key])) {
            acc[key] = filterable[key];
        }
        return acc;
    }, {
    }, keys(filterable)) : _filter(pred, filterable);
}));
function _complement(f) {
    return function() {
        return !f.apply(this, arguments);
    };
}
var reject = _curry2(function reject(pred, filterable) {
    return filter(_complement(pred), filterable);
});
var pad = function pad(n) {
    return (n < 10 ? '0' : '') + n;
};
var _toISOString = typeof Date.prototype.toISOString === 'function' ? function _toISOString(d) {
    return d.toISOString();
} : function _toISOString(d) {
    return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()) + 'T' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds()) + '.' + (d.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) + 'Z';
};
function _toString(x, seen) {
    var recur = function recur(y) {
        var xs = seen.concat([
            x
        ]);
        return _includes(y, xs) ? '<Circular>' : _toString(y, xs);
    };
    var mapPairs = function(obj, keys1) {
        return _map(function(k) {
            return _quote(k) + ': ' + recur(obj[k]);
        }, keys1.slice().sort());
    };
    switch(Object.prototype.toString.call(x)){
        case '[object Arguments]':
            return '(function() { return arguments; }(' + _map(recur, x).join(', ') + '))';
        case '[object Array]':
            return '[' + _map(recur, x).concat(mapPairs(x, reject(function(k) {
                return /^\d+$/.test(k);
            }, keys(x)))).join(', ') + ']';
        case '[object Boolean]':
            return typeof x === 'object' ? 'new Boolean(' + recur(x.valueOf()) + ')' : x.toString();
        case '[object Date]':
            return 'new Date(' + (isNaN(x.valueOf()) ? recur(NaN) : _quote(_toISOString(x))) + ')';
        case '[object Null]':
            return 'null';
        case '[object Number]':
            return typeof x === 'object' ? 'new Number(' + recur(x.valueOf()) + ')' : 1 / x === -Infinity ? '-0' : x.toString(10);
        case '[object String]':
            return typeof x === 'object' ? 'new String(' + recur(x.valueOf()) + ')' : _quote(x);
        case '[object Undefined]':
            return 'undefined';
        default:
            if (typeof x.toString === 'function') {
                var repr = x.toString();
                if (repr !== '[object Object]') {
                    return repr;
                }
            }
            return '{' + mapPairs(x, keys(x)).join(', ') + '}';
    }
}
var toString1 = _curry1(function toString1(val) {
    return _toString(val, []);
});
var invoker = _curry2(function invoker(arity, method) {
    return curryN(arity + 1, function() {
        var target = arguments[arity];
        if (target != null && _isFunction(target[method])) {
            return target[method].apply(target, Array.prototype.slice.call(arguments, 0, arity));
        }
        throw new TypeError(toString1(target) + ' does not have a method named "' + method + '"');
    });
});
var join = invoker(1, 'join');
var isNil = _curry1(function isNil(x) {
    return x == null;
});
var hasPath = _curry2(function hasPath(_path, obj) {
    if (_path.length === 0 || isNil(obj)) {
        return false;
    }
    var val = obj;
    var idx = 0;
    while(idx < _path.length){
        if (!isNil(val) && _has(_path[idx], val)) {
            val = val[_path[idx]];
            idx += 1;
        } else {
            return false;
        }
    }
    return true;
});
var has = _curry2(function has(prop, obj) {
    return hasPath([
        prop
    ], obj);
});
var reduce = _curry3(_reduce);
function _pipe(f, g) {
    return function() {
        return g.call(this, f.apply(this, arguments));
    };
}
function _checkForMethod(methodname, fn) {
    return function() {
        var length = arguments.length;
        if (length === 0) {
            return fn();
        }
        var obj = arguments[length - 1];
        return __default1(obj) || typeof obj[methodname] !== 'function' ? fn.apply(this, arguments) : obj[methodname].apply(obj, Array.prototype.slice.call(arguments, 0, length - 1));
    };
}
var slice = _curry3(_checkForMethod('slice', function slice(fromIndex, toIndex, list) {
    return Array.prototype.slice.call(list, fromIndex, toIndex);
}));
var tail = _curry1(_checkForMethod('tail', slice(1, Infinity)));
function pipe() {
    if (arguments.length === 0) {
        throw new Error('pipe requires at least one argument');
    }
    return _arity(arguments[0].length, reduce(_pipe, arguments[0], tail(arguments)));
}
var reverse = _curry1(function reverse(list) {
    return _isString(list) ? list.split('').reverse().join('') : Array.prototype.slice.call(list, 0).reverse();
});
function compose() {
    if (arguments.length === 0) {
        throw new Error('compose requires at least one argument');
    }
    return pipe.apply(this, reverse(arguments));
}
function XMap(f, xf) {
    this.xf = xf;
    this.f = f;
}
XMap.prototype['@@transducer/init'] = __default2.init;
XMap.prototype['@@transducer/result'] = __default2.result;
XMap.prototype['@@transducer/step'] = function(result, input) {
    return this.xf['@@transducer/step'](result, this.f(input));
};
var _xmap = _curry2(function _xmap(f, xf) {
    return new XMap(f, xf);
});
var map = _curry2(_dispatchable([
    'fantasy-land/map',
    'map'
], _xmap, function map(fn, functor) {
    switch(Object.prototype.toString.call(functor)){
        case '[object Function]':
            return curryN(functor.length, function() {
                return fn.call(this, functor.apply(this, arguments));
            });
        case '[object Object]':
            return _reduce(function(acc, key) {
                acc[key] = fn(functor[key]);
                return acc;
            }, {
            }, keys(functor));
        default:
            return _map(fn, functor);
    }
}));
var ap = _curry2(function ap(applyF, applyX) {
    return typeof applyX['fantasy-land/ap'] === 'function' ? applyX['fantasy-land/ap'](applyF) : typeof applyF.ap === 'function' ? applyF.ap(applyX) : typeof applyF === 'function' ? function(x) {
        return applyF(x)(applyX(x));
    } : _reduce(function(acc, f) {
        return _concat(acc, map(f, applyX));
    }, [], applyF);
});
const concat = (x)=>(y)=>x.concat(y)
;
const $$debug = Symbol.for("TaskDebug");
const $$inspect = typeof Deno !== "undefined" ? Deno.customInspect : "inspect";
const $$returnType = Symbol.for("ReturnType");
const $$tag = Symbol.for("Tag");
const $$tagList = Symbol.for("TagList");
const $$type2 = Symbol.for("Type");
const $$value = Symbol.for("Value");
const $$valueList = Symbol.for("ValueList");
var curry = _curry1(function curry(fn) {
    return curryN(fn.length, fn);
});
const assertIsUnit = curry((instance, value)=>instance === value || !!value && instance[$$tag] === value[$$tag] && instance.constructor[$$type2] === value.constructor[$$type2]
);
const assertIsTypeRepresentation = curry((typeName, value)=>value !== undefined && value !== null && typeName === value.constructor[$$type2]
);
const assertIsVariant = curry((instance, value)=>!!value && instance[$$tag] === value[$$tag] && instance[$$returnType] === value.constructor[$$type2]
);
const serializeConstructorType = curry((typeName, tag)=>`${typeName}.${tag}`
);
const serializeConstructorTypeBound = function() {
    return serializeConstructorType(this[$$returnType], this[$$tag]);
};
const serializeList = compose(join(", "), map(toString1));
const serializeTypeInstance = curry((typeName, valueList)=>`${typeName}(${serializeList(valueList)})`
);
const serializeTypeInstanceWithTag = curry((typeName, tagName, valueList)=>valueList.length > 0 ? `${typeName}.${tagName}(${serializeList(valueList)})` : `${typeName}.${tagName}`
);
const serializeTypeInstanceBound = function() {
    return Object.getPrototypeOf(this).hasOwnProperty($$tag) ? serializeTypeInstanceWithTag(this.constructor[$$type2], this[$$tag], this[$$valueList]) : serializeTypeInstance(this.constructor[$$type2], this[$$valueList]);
};
const serializeTypeRepresentation = (typeName)=>typeName
;
const serializeTypeRepresentationBound = function() {
    return serializeTypeRepresentation(this[$$type2]);
};
var apply = _curry2(function apply(fn, args) {
    return fn.apply(this, args);
});
const factorizeFold = (functionByTag, instanceTag, constructorTagList)=>{
    for (const tag of constructorTagList){
        if (!functionByTag[tag]) {
            throw new TypeError(`Constructors given to fold didn't include: ${tag}`);
        }
    }
    return apply(functionByTag[instanceTag]);
};
const factorizeFoldBound = function(functionByTag) {
    return factorizeFold(functionByTag, this[$$tag], this.constructor[$$tagList])(this[$$valueList]);
};
const factorizeType = (typeName, propertyNameList)=>{
    let prototypeAccumulator = {
        toString: serializeTypeInstanceBound,
        [$$inspect]: serializeTypeInstanceBound,
        [$$type2]: typeName
    };
    const typeRepresentationConstructor = factorizeConstructor1(propertyNameList, prototypeAccumulator);
    typeRepresentationConstructor.from = factorizeConstructorFromObject1(propertyNameList, prototypeAccumulator);
    typeRepresentationConstructor.is = assertIsTypeRepresentation(typeName);
    typeRepresentationConstructor.prototype = prototypeAccumulator;
    typeRepresentationConstructor.toString = serializeTypeRepresentationBound;
    typeRepresentationConstructor[$$inspect] = serializeTypeRepresentationBound;
    typeRepresentationConstructor[$$type2] = typeName;
    prototypeAccumulator.constructor = typeRepresentationConstructor;
    return typeRepresentationConstructor;
};
const factorizeSumType = (typeName, propertyNameListByTag)=>{
    let prototypeAccumulator = {
        fold: factorizeFoldBound,
        toString: serializeTypeInstanceBound,
        [$$inspect]: serializeTypeInstanceBound
    };
    const tagList = Object.keys(propertyNameListByTag);
    const typeRepresentation = prototypeAccumulator.constructor = {
        is: assertIsTypeRepresentation(typeName),
        prototype: prototypeAccumulator,
        toString: serializeTypeRepresentationBound,
        [$$inspect]: serializeTypeRepresentationBound,
        [$$tagList]: tagList,
        [$$type2]: typeName
    };
    for (const [tag, propertyNameList] of Object.entries(propertyNameListByTag)){
        const tagPrototypeAccumulator = Object.assign(Object.create(prototypeAccumulator), {
            [$$tag]: tag
        });
        if (propertyNameList.length === 0) {
            typeRepresentation[tag] = factorizeValue1(propertyNameList, tagPrototypeAccumulator, [], 0);
            typeRepresentation[tag].is = assertIsUnit(typeRepresentation[tag]);
            continue;
        }
        typeRepresentation[tag] = factorizeConstructor1(propertyNameList, tagPrototypeAccumulator);
        typeRepresentation[tag].from = factorizeConstructorFromObject1(propertyNameList, tagPrototypeAccumulator);
        typeRepresentation[tag].toString = serializeConstructorTypeBound;
        typeRepresentation[tag][$$inspect] = serializeConstructorTypeBound;
        typeRepresentation[tag][$$returnType] = typeName;
        typeRepresentation[tag][$$tag] = tag;
        typeRepresentation[tag].is = assertIsVariant(typeRepresentation[tag]);
    }
    return typeRepresentation;
};
const factorizeValue1 = curry((propertyNameList, prototype, propertyValueList, argumentCount)=>{
    if (argumentCount !== propertyNameList.length) {
        throw new TypeError(`Expected ${propertyNameList.length} arguments, got ${argumentCount}.`);
    }
    return Object.assign(Object.create(prototype), {
        ...zipObj(propertyNameList, propertyValueList),
        [$$valueList]: propertyValueList
    });
});
const factorizeConstructor1 = (propertyNameList, prototype)=>{
    switch(propertyNameList.length){
        case 1:
            return function(a) {
                return factorizeValue1(propertyNameList, prototype, [
                    a
                ], arguments.length);
            };
        case 2:
            return function(a, b) {
                return factorizeValue1(propertyNameList, prototype, [
                    a,
                    b
                ], arguments.length);
            };
        case 3:
            return function(a, b, c) {
                return factorizeValue1(propertyNameList, prototype, [
                    a,
                    b,
                    c
                ], arguments.length);
            };
        case 4:
            return function(a, b, c, d) {
                return factorizeValue1(propertyNameList, prototype, [
                    a,
                    b,
                    c,
                    d
                ], arguments.length);
            };
        case 5:
            return function(a, b, c, d, e) {
                return factorizeValue1(propertyNameList, prototype, [
                    a,
                    b,
                    c,
                    d,
                    e
                ], arguments.length);
            };
        case 6:
            return function(a, b, c, d, e, f) {
                return factorizeValue1(propertyNameList, prototype, [
                    a,
                    b,
                    c,
                    d,
                    e,
                    f
                ], arguments.length);
            };
        case 7:
            return function(a, b, c, d, e, f, g) {
                return factorizeValue1(propertyNameList, prototype, [
                    a,
                    b,
                    c,
                    d,
                    e,
                    f,
                    g
                ], arguments.length);
            };
        case 8:
            return function(a, b, c, d, e, f, g, h) {
                return factorizeValue1(propertyNameList, prototype, [
                    a,
                    b,
                    c,
                    d,
                    e,
                    f,
                    g,
                    h
                ], arguments.length);
            };
        case 9:
            return function(a, b, c, d, e, f, g, h, i) {
                return factorizeValue1(propertyNameList, prototype, [
                    a,
                    b,
                    c,
                    d,
                    e,
                    f,
                    g,
                    h,
                    i
                ], arguments.length);
            };
        case 10:
            return function(a, b, c, d, e, f, g, h, i, j) {
                return factorizeValue1(propertyNameList, prototype, [
                    a,
                    b,
                    c,
                    d,
                    e,
                    f,
                    g,
                    h,
                    i,
                    j
                ], arguments.length);
            };
        default:
            return Object.defineProperty(function() {
                return factorizeValue1(propertyNameList, prototype, arguments, arguments.length);
            }, 'length', {
                value: propertyNameList.length
            });
    }
};
var max = _curry2(function max(a, b) {
    return b > a ? b : a;
});
const __default3 = Number.isInteger || function _isInteger(n) {
    return n << 0 === n;
};
var nth = _curry2(function nth(offset, list) {
    var idx = offset < 0 ? list.length + offset : offset;
    return _isString(list) ? list.charAt(idx) : list[idx];
});
var prop = _curry2(function prop(p, obj) {
    if (obj == null) {
        return;
    }
    return __default3(p) ? nth(p, obj) : obj[p];
});
var pluck = _curry2(function pluck(p, list) {
    return map(prop(p), list);
});
var converge = _curry2(function converge(after, fns) {
    return curryN(reduce(max, 0, pluck('length', fns)), function() {
        var args = arguments;
        var context = this;
        return after.apply(context, _map(function(fn) {
            return fn.apply(context, args);
        }, fns));
    });
});
function _identity(x) {
    return x;
}
var identity = _curry1(_identity);
var liftN = _curry2(function liftN(arity, fn) {
    var lifted = curryN(arity, fn);
    return curryN(arity, function() {
        return _reduce(ap, map(lifted, arguments[0]), Array.prototype.slice.call(arguments, 1));
    });
});
var lift = _curry1(function lift(fn) {
    return liftN(fn.length, fn);
});
var not = _curry1(function not(a) {
    return !a;
});
var complement = lift(not);
const factorizeConstructorFromObject1 = (propertyNameList, prototype)=>compose(converge(factorizeValue1(propertyNameList, prototype), [
        identity,
        prop("length")
    ]), (blueprintObject)=>reduce((accumulator, propertyName)=>{
            if (complement(has)(propertyName, blueprintObject)) {
                throw new TypeError(`Missing field: ${propertyName}`);
            }
            return [
                ...accumulator,
                blueprintObject[propertyName]
            ];
        }, [], propertyNameList)
    )
;
const Task = factorizeType("Task", [
    "asyncFunction"
]);
const serializeFunctionForDebug = (asyncFunction)=>asyncFunction.name && asyncFunction.name !== "" ? asyncFunction.name : asyncFunction.toString().length > 25 ? asyncFunction.toString().slice(0, 25).replace(/[\n\r]/g, "").replace(/\s\s*/g, " ") + "[...]" : asyncFunction.toString().replace(/[\n\r]/g, "").replace(/\s\s*/g, " ")
;
const Either = factorizeSumType("Either", {
    Left: [
        $$value
    ],
    Right: [
        $$value
    ]
});
Either.fromNullable = (value)=>!(typeof value !== "undefined") || !value && typeof value === "object" ? Either.Left(value) : Either.Right(value)
;
Either.left = (value)=>Either.Left(value)
;
Either.right = (value)=>Either.Right(value)
;
Either.of = Either.prototype.of = Either.prototype["fantasy-land/of"] = (value)=>Either.Right(value)
;
Either.prototype.alt = Either.prototype["fantasy-land/alt"] = function(container) {
    return this.fold({
        Left: (_)=>container
        ,
        Right: (_)=>this
    });
};
Either.prototype.ap = Either.prototype["fantasy-land/ap"] = function(container) {
    return this.fold({
        Left: (_)=>this
        ,
        Right: (value)=>Either.Right.is(container) ? Either.Right(container[$$value](value)) : container
    });
};
Either.prototype.chain = Either.prototype["fantasy-land/chain"] = function(unaryFunction) {
    return this.fold({
        Left: (_)=>this
        ,
        Right: (value)=>unaryFunction(value)
    });
};
Either.prototype.extend = Either.prototype["fantasy-land/extend"] = function(unaryFunction) {
    return this.fold({
        Left: (_)=>this
        ,
        Right: (_)=>Either.of(unaryFunction(this))
    });
};
Either.prototype.extract = Either.prototype["fantasy-land/extract"] = function() {
    return this.fold({
        Left: (_)=>this
        ,
        Right: (value)=>value
    });
};
Either.prototype.map = Either.prototype["fantasy-land/map"] = function(unaryFunction) {
    return this.fold({
        Left: (_)=>this
        ,
        Right: (value)=>Either.of(unaryFunction(value))
    });
};
Either.prototype.reduce = Either.prototype["fantasy-land/reduce"] = function(binaryFunction, accumulator) {
    return this.fold({
        Left: (_)=>accumulator
        ,
        Right: (value)=>binaryFunction(accumulator, value)
    });
};
Either.prototype.sequence = function(TypeRepresentation) {
    return this.traverse(TypeRepresentation, (x)=>x
    );
};
Either.prototype.traverse = Either.prototype["fantasy-land/traverse"] = function(TypeRepresentation, unaryFunction) {
    return this.fold({
        Left: (value)=>TypeRepresentation.of(Either.Left(value))
        ,
        Right: (value)=>unaryFunction(value).map((x)=>Either.Right(x)
            )
    });
};
Either.zero = Either.prototype.zero = Either.prototype["fantasy-land/zero"] = ()=>Either.Left(null)
;
Task.wrap = (asyncFunction)=>{
    let promise;
    const proxyFunction = function(...argumentList) {
        promise = promise || asyncFunction.call(null, ...argumentList);
        return promise.then((maybeContainer)=>Either.is(maybeContainer) ? maybeContainer : Either.Right(maybeContainer)
        , (maybeContainer)=>Either.is(maybeContainer) ? maybeContainer : Either.Left(maybeContainer)
        );
    };
    return Object.defineProperty(Task(Object.defineProperty(proxyFunction, 'length', {
        value: asyncFunction.length
    })), $$debug, {
        writable: false,
        value: `Task(${serializeFunctionForDebug(asyncFunction)})`
    });
};
Task.prototype.ap = Task.prototype["fantasy-land/ap"] = function(container) {
    return Object.defineProperty(Task((_)=>{
        const maybePromiseValue = this.asyncFunction();
        const maybePromiseUnaryFunction = container.asyncFunction();
        return Promise.all([
            maybePromiseUnaryFunction instanceof Promise ? maybePromiseUnaryFunction : Promise.resolve(maybePromiseUnaryFunction),
            maybePromiseValue instanceof Promise ? maybePromiseValue : Promise.resolve(maybePromiseValue)
        ]).then(([maybeApplicativeUnaryFunction, maybeContainerValue])=>{
            return (Reflect.getPrototypeOf(maybeContainerValue).ap ? maybeContainerValue : Either.Right(maybeContainerValue)).ap(Reflect.getPrototypeOf(maybeApplicativeUnaryFunction).ap ? maybeApplicativeUnaryFunction : Either.Right(maybeApplicativeUnaryFunction));
        });
    }), $$debug, {
        writable: false,
        value: `${this[$$debug]}.ap(${container})`
    });
};
Task.prototype.chain = Task.prototype["fantasy-land/chain"] = function(unaryFunction) {
    return Object.defineProperty(Task((_)=>{
        const maybePromise = this.asyncFunction();
        return (maybePromise instanceof Promise ? maybePromise : Promise.resolve(maybePromise)).then((maybeContainer)=>(Either.is(maybeContainer) ? maybeContainer : Either.Right(maybeContainer)).chain((value)=>{
                const maybePromise1 = unaryFunction(value).run();
                return (maybePromise1 instanceof Promise ? maybePromise1 : Promise.resolve(maybePromise1)).then((maybeContainer1)=>Either.is(maybeContainer1) ? maybeContainer1 : Either.Right(maybeContainer1)
                , (maybeContainer1)=>Either.is(maybeContainer1) ? maybeContainer1 : Either.Left(maybeContainer1)
                );
            })
        , Either.Left);
    }), $$debug, {
        writable: false,
        value: `${this[$$debug]}.chain(${serializeFunctionForDebug(unaryFunction)})`
    });
};
const Step = factorizeSumType("Step", {
    Done: [
        'value'
    ],
    Loop: [
        'value'
    ]
});
Step.prototype.alt = Step.prototype["fantasy-land/alt"] = function(container) {
    return this.fold({
        Done: (_)=>container
        ,
        Loop: (_)=>this
    });
};
const Done = Step.Done;
const Loop = Step.Loop;
const Pair = factorizeType("Pair", [
    "first",
    "second"
]);
Pair.prototype.bimap = Pair.prototype["fantasy-land/bimap"] = function(unaryFunctionA, unaryFunctionB) {
    return Pair(unaryFunctionA(this.first), unaryFunctionB(this.second));
};
Pair.prototype.map = Pair.prototype["fantasy-land/map"] = function(unaryFunction) {
    return Pair(unaryFunction(this.first), this.second);
};
const $$decoder = new TextDecoder();
const $$encoder = new TextEncoder();
const decodeRaw = $$decoder.decode.bind($$decoder);
const chainLift = curry((binaryFunction, chainableFunctor, functor)=>chainableFunctor.chain((x)=>functor.map(binaryFunction(x))
    )
);
var append = _curry2(function append(el, list) {
    return _concat(list, [
        el
    ]);
});
const stream = curry(async (composedFunction, accumulator, iterator)=>{
    for await (const data of iterator){
        accumulator = composedFunction(accumulator, data);
    }
    return accumulator;
});
Task.prototype.chainRec = Task.prototype["fantasy-land/chainRec"] = function(ternaryFunction, initialCursor) {
    let accumulator = this;
    let result = Loop(Pair(initialCursor, null));
    while(!Done.is(result)){
        result = ternaryFunction(Loop, Done, result.value.first);
        if (Loop.is(result)) {
            accumulator = chainLift(concat, accumulator, result.value.second);
        }
    }
    return accumulator;
};
Task.prototype.map = Task.prototype["fantasy-land/map"] = function(unaryFunction) {
    return Object.defineProperty(Task((_)=>{
        const promise = this.asyncFunction();
        return promise.then((container)=>container.chain((value)=>{
                const maybeContainer = unaryFunction(value);
                return Either.is(maybeContainer) ? maybeContainer : Either.Right(maybeContainer);
            })
        , Either.Left);
    }), $$debug, {
        writable: false,
        value: `${this[$$debug]}.map(${serializeFunctionForDebug(unaryFunction)})`
    });
};
Task.of = Task.prototype.of = Task.prototype["fantasy-land/of"] = (value)=>Object.defineProperty(Task((_)=>Promise.resolve(Either.Right(value))
    ), $$debug, {
        writable: false,
        value: `Task(${serializeFunctionForDebug(value)})`
    })
;
Task.prototype.run = async function() {
    const maybePromise = this.asyncFunction();
    return (maybePromise instanceof Promise ? maybePromise : Promise.resolve(maybePromise)).then((maybeContainer)=>Either.is(maybeContainer) ? maybeContainer : Either.Right(maybeContainer)
    , (maybeContainer)=>Either.is(maybeContainer) ? maybeContainer : Either.Left(maybeContainer)
    );
};
Task.prototype.toString = Task.prototype[$$inspect] = function() {
    return this[$$debug] || `Task("unknown")`;
};
const $$debug1 = Symbol.for("TaskDebug");
const $$inspect1 = typeof Deno !== "undefined" ? Deno.customInspect : "inspect";
const $$returnType1 = Symbol.for("ReturnType");
const $$tag1 = Symbol.for("Tag");
const $$tagList1 = Symbol.for("TagList");
const $$type1 = Symbol.for("Type");
const $$value1 = Symbol.for("Value");
const $$valueList1 = Symbol.for("ValueList");
const assertIsUnit1 = curry((instance, value)=>instance === value || !!value && instance[$$tag1] === value[$$tag1] && instance.constructor[$$type1] === value.constructor[$$type1]
);
const assertIsTypeRepresentation1 = curry((typeName, value)=>value !== undefined && value !== null && typeName === value.constructor[$$type1]
);
const assertIsVariant1 = curry((instance, value)=>!!value && instance[$$tag1] === value[$$tag1] && instance[$$returnType1] === value.constructor[$$type1]
);
const serializeConstructorType1 = curry((typeName, tag)=>`${typeName}.${tag}`
);
const serializeConstructorTypeBound1 = function() {
    return serializeConstructorType1(this[$$returnType1], this[$$tag1]);
};
const serializeList1 = compose(join(", "), map(toString1));
const serializeTypeInstance1 = curry((typeName, valueList)=>`${typeName}(${serializeList1(valueList)})`
);
const serializeTypeInstanceWithTag1 = curry((typeName, tagName, valueList)=>valueList.length > 0 ? `${typeName}.${tagName}(${serializeList1(valueList)})` : `${typeName}.${tagName}`
);
const serializeTypeInstanceBound1 = function() {
    return Object.getPrototypeOf(this).hasOwnProperty($$tag1) ? serializeTypeInstanceWithTag1(this.constructor[$$type1], this[$$tag1], this[$$valueList1]) : serializeTypeInstance1(this.constructor[$$type1], this[$$valueList1]);
};
const serializeTypeRepresentation1 = (typeName)=>typeName
;
const serializeTypeRepresentationBound1 = function() {
    return serializeTypeRepresentation1(this[$$type1]);
};
const factorizeFold1 = (functionByTag, instanceTag, constructorTagList)=>{
    for (const tag of constructorTagList){
        if (!functionByTag[tag]) {
            throw new TypeError(`Constructors given to fold didn't include: ${tag}`);
        }
    }
    return apply(functionByTag[instanceTag]);
};
const factorizeFoldBound1 = function(functionByTag) {
    return factorizeFold1(functionByTag, this[$$tag1], this.constructor[$$tagList1])(this[$$valueList1]);
};
const factorizeType1 = (typeName, propertyNameList)=>{
    let prototypeAccumulator = {
        toString: serializeTypeInstanceBound1,
        [$$inspect1]: serializeTypeInstanceBound1,
        [$$type1]: typeName
    };
    const typeRepresentationConstructor = factorizeConstructor2(propertyNameList, prototypeAccumulator);
    typeRepresentationConstructor.from = factorizeConstructorFromObject2(propertyNameList, prototypeAccumulator);
    typeRepresentationConstructor.is = assertIsTypeRepresentation1(typeName);
    typeRepresentationConstructor.prototype = prototypeAccumulator;
    typeRepresentationConstructor.toString = serializeTypeRepresentationBound1;
    typeRepresentationConstructor[$$inspect1] = serializeTypeRepresentationBound1;
    typeRepresentationConstructor[$$type1] = typeName;
    prototypeAccumulator.constructor = typeRepresentationConstructor;
    return typeRepresentationConstructor;
};
const factorizeSumType1 = (typeName, propertyNameListByTag)=>{
    let prototypeAccumulator = {
        fold: factorizeFoldBound1,
        toString: serializeTypeInstanceBound1,
        [$$inspect1]: serializeTypeInstanceBound1
    };
    const tagList = Object.keys(propertyNameListByTag);
    const typeRepresentation = prototypeAccumulator.constructor = {
        is: assertIsTypeRepresentation1(typeName),
        prototype: prototypeAccumulator,
        toString: serializeTypeRepresentationBound1,
        [$$inspect1]: serializeTypeRepresentationBound1,
        [$$tagList1]: tagList,
        [$$type1]: typeName
    };
    for (const [tag, propertyNameList] of Object.entries(propertyNameListByTag)){
        const tagPrototypeAccumulator = Object.assign(Object.create(prototypeAccumulator), {
            [$$tag1]: tag
        });
        if (propertyNameList.length === 0) {
            typeRepresentation[tag] = factorizeValue2(propertyNameList, tagPrototypeAccumulator, [], 0);
            typeRepresentation[tag].is = assertIsUnit1(typeRepresentation[tag]);
            continue;
        }
        typeRepresentation[tag] = factorizeConstructor2(propertyNameList, tagPrototypeAccumulator);
        typeRepresentation[tag].from = factorizeConstructorFromObject2(propertyNameList, tagPrototypeAccumulator);
        typeRepresentation[tag].toString = serializeConstructorTypeBound1;
        typeRepresentation[tag][$$inspect1] = serializeConstructorTypeBound1;
        typeRepresentation[tag][$$returnType1] = typeName;
        typeRepresentation[tag][$$tag1] = tag;
        typeRepresentation[tag].is = assertIsVariant1(typeRepresentation[tag]);
    }
    return typeRepresentation;
};
const factorizeValue2 = curry((propertyNameList, prototype, propertyValueList, argumentCount)=>{
    if (argumentCount !== propertyNameList.length) {
        throw new TypeError(`Expected ${propertyNameList.length} arguments, got ${argumentCount}.`);
    }
    return Object.assign(Object.create(prototype), {
        ...zipObj(propertyNameList, propertyValueList),
        [$$valueList1]: propertyValueList
    });
});
const factorizeConstructor2 = (propertyNameList, prototype)=>{
    switch(propertyNameList.length){
        case 1:
            return function(a) {
                return factorizeValue2(propertyNameList, prototype, [
                    a
                ], arguments.length);
            };
        case 2:
            return function(a, b) {
                return factorizeValue2(propertyNameList, prototype, [
                    a,
                    b
                ], arguments.length);
            };
        case 3:
            return function(a, b, c) {
                return factorizeValue2(propertyNameList, prototype, [
                    a,
                    b,
                    c
                ], arguments.length);
            };
        case 4:
            return function(a, b, c, d) {
                return factorizeValue2(propertyNameList, prototype, [
                    a,
                    b,
                    c,
                    d
                ], arguments.length);
            };
        case 5:
            return function(a, b, c, d, e) {
                return factorizeValue2(propertyNameList, prototype, [
                    a,
                    b,
                    c,
                    d,
                    e
                ], arguments.length);
            };
        case 6:
            return function(a, b, c, d, e, f) {
                return factorizeValue2(propertyNameList, prototype, [
                    a,
                    b,
                    c,
                    d,
                    e,
                    f
                ], arguments.length);
            };
        case 7:
            return function(a, b, c, d, e, f, g) {
                return factorizeValue2(propertyNameList, prototype, [
                    a,
                    b,
                    c,
                    d,
                    e,
                    f,
                    g
                ], arguments.length);
            };
        case 8:
            return function(a, b, c, d, e, f, g, h) {
                return factorizeValue2(propertyNameList, prototype, [
                    a,
                    b,
                    c,
                    d,
                    e,
                    f,
                    g,
                    h
                ], arguments.length);
            };
        case 9:
            return function(a, b, c, d, e, f, g, h, i) {
                return factorizeValue2(propertyNameList, prototype, [
                    a,
                    b,
                    c,
                    d,
                    e,
                    f,
                    g,
                    h,
                    i
                ], arguments.length);
            };
        case 10:
            return function(a, b, c, d, e, f, g, h, i, j) {
                return factorizeValue2(propertyNameList, prototype, [
                    a,
                    b,
                    c,
                    d,
                    e,
                    f,
                    g,
                    h,
                    i,
                    j
                ], arguments.length);
            };
        default:
            return Object.defineProperty(function() {
                return factorizeValue2(propertyNameList, prototype, arguments, arguments.length);
            }, 'length', {
                value: propertyNameList.length
            });
    }
};
const factorizeConstructorFromObject2 = (propertyNameList, prototype)=>compose(converge(factorizeValue2(propertyNameList, prototype), [
        identity,
        prop("length")
    ]), (blueprintObject)=>reduce((accumulator, propertyName)=>{
            if (complement(has)(propertyName, blueprintObject)) {
                throw new TypeError(`Missing field: ${propertyName}`);
            }
            return [
                ...accumulator,
                blueprintObject[propertyName]
            ];
        }, [], propertyNameList)
    )
;
const $$debug2 = Symbol.for("Debug");
window[$$debug2] = false;
const debug = (message, unaryFunction)=>(x)=>{
        if (!window[$$debug2]) return unaryFunction ? unaryFunction(x) : x;
        if (!!unaryFunction) {
            const time = performance.now();
            const container = unaryFunction(x);
            if (Task.is(container)) return container.map((x1)=>console.debug(`${message} [${performance.now() - time}ms]`, x1) || x1
            );
            else return container;
        } else {
            console.debug(message, x);
            return x;
        }
    }
;
function mapValues(fn, obj) {
    return __default1(obj) ? obj.map(fn) : keys(obj).reduce(function(acc, key) {
        acc[key] = fn(obj[key]);
        return acc;
    }, {
    });
}
var values = _curry1(function values(obj) {
    var props = keys(obj);
    var len = props.length;
    var vals = [];
    var idx = 0;
    while(idx < len){
        vals[idx] = obj[props[idx]];
        idx += 1;
    }
    return vals;
});
var applySpec = _curry1(function applySpec(spec) {
    spec = mapValues(function(v) {
        return typeof v == 'function' ? v : applySpec(v);
    }, spec);
    return curryN(reduce(max, 0, pluck('length', values(spec))), function() {
        var args = arguments;
        return mapValues(function(f) {
            return apply(f, args);
        }, spec);
    });
});
const addEventListener1 = curry((eventName, binaryFunction, $$element)=>$$element.addEventListener(eventName, (event)=>{
        event.preventDefault();
        ($$element.shadowRoot ? $$element : document).dispatchEvent(new CustomEvent("$$fl-render", {
            bubbles: true,
            detail: binaryFunction($$element)
        }));
    }) || $$element
);
const factorizeEventIterator = ($$element)=>({
        [Symbol.asyncIterator] () {
            return {
                next () {
                    return new Promise((resolve)=>{
                        let eventList = [];
                        $$element.addEventListener("$$fl-render", (event)=>{
                            eventList.push(event);
                            resolve({
                                value: eventList,
                                done: false
                            });
                        }, {
                            once: true
                        });
                    });
                }
            };
        }
    })
;
const forceRender = ($$element, state = {
})=>$$element.dispatchEvent(new CustomEvent("$$fl-render", {
        detail: (_)=>Task.of(state)
    })) && $$element
;
const pushEvent = curry(($$element, unaryFunction)=>$$element.dispatchEvent(new CustomEvent("$$fl-render", {
        bubbles: true,
        detail: unaryFunction
    })) && $$element
);
const stream1 = curry(async (binaryFunction, accumulator, iterator)=>{
    for await (const eventList of iterator){
        debug(`[00] Handling state update (${eventList[0].target.localName || "document"})`, binaryFunction(accumulator))(eventList).run().then((container)=>container.fold({
                Left: (error)=>console.error(error)
                ,
                Right: (state)=>accumulator = state
            })
        );
    }
    return accumulator;
});
var applyTo = _curry2(function applyTo(x, f) {
    return f(x);
});
const $$decoder1 = new TextDecoder();
const $$encoder1 = new TextEncoder();
const decodeRaw1 = $$decoder1.decode.bind($$decoder1);
const chainLift1 = curry((binaryFunction, chainableFunctor, functor)=>chainableFunctor.chain((x)=>functor.map(binaryFunction(x))
    )
);
const evert = curry((T, list)=>list.reduce((accumulator, x)=>lift(append)(x, accumulator)
    , T.of([]))
);
const stream2 = curry(async (binaryFunction, accumulator, iterator)=>{
    for await (const data of iterator){
        accumulator = binaryFunction(accumulator, data);
    }
    return accumulator;
});
function XFind(f, xf) {
    this.xf = xf;
    this.f = f;
    this.found = false;
}
XFind.prototype['@@transducer/init'] = __default2.init;
XFind.prototype['@@transducer/result'] = function(result) {
    if (!this.found) {
        result = this.xf['@@transducer/step'](result, void 0);
    }
    return this.xf['@@transducer/result'](result);
};
function _reduced(x) {
    return x && x['@@transducer/reduced'] ? x : {
        '@@transducer/value': x,
        '@@transducer/reduced': true
    };
}
XFind.prototype['@@transducer/step'] = function(result, input) {
    if (this.f(input)) {
        this.found = true;
        result = _reduced(this.xf['@@transducer/step'](result, input));
    }
    return result;
};
var _xfind = _curry2(function _xfind(f, xf) {
    return new XFind(f, xf);
});
var find = _curry2(_dispatchable([
    'find'
], _xfind, function find(fn, list) {
    var idx = 0;
    var len = list.length;
    while(idx < len){
        if (fn(list[idx])) {
            return list[idx];
        }
        idx += 1;
    }
}));
const factorizeSpy = ()=>{
    const history = [];
    return [
        (functionArity, nAryFunction)=>curryN(functionArity, (...argumentList)=>history.push(argumentList) && nAryFunction.call(null, ...argumentList)
            )
        ,
        {
            assertCalledWith: (...argumentList)=>!!find(equals(argumentList), history)
            ,
            assertCallCount: (n)=>n === history.length
            ,
            get callCount () {
                return history.length;
            },
            get history () {
                return history;
            }
        }
    ];
};
function _forceReduced(x) {
    return {
        '@@transducer/value': x,
        '@@transducer/reduced': true
    };
}
var preservingReduced = function(xf) {
    return {
        '@@transducer/init': __default2.init,
        '@@transducer/result': function(result) {
            return xf['@@transducer/result'](result);
        },
        '@@transducer/step': function(result, input) {
            var ret = xf['@@transducer/step'](result, input);
            return ret['@@transducer/reduced'] ? _forceReduced(ret) : ret;
        }
    };
};
var _flatCat = function _xcat(xf) {
    var rxf = preservingReduced(xf);
    return {
        '@@transducer/init': __default2.init,
        '@@transducer/result': function(result) {
            return rxf['@@transducer/result'](result);
        },
        '@@transducer/step': function(result, input) {
            return !_isArrayLike(input) ? _reduce(rxf, result, [
                input
            ]) : _reduce(rxf, result, input);
        }
    };
};
var _xchain = _curry2(function _xchain(f, xf) {
    return map(f, _flatCat(xf));
});
function _makeFlat(recursive) {
    return function flatt(list) {
        var value, jlen, j;
        var result = [];
        var idx = 0;
        var ilen = list.length;
        while(idx < ilen){
            if (_isArrayLike(list[idx])) {
                value = recursive ? flatt(list[idx]) : list[idx];
                j = 0;
                jlen = value.length;
                while(j < jlen){
                    result[result.length] = value[j];
                    j += 1;
                }
            } else {
                result[result.length] = list[idx];
            }
            idx += 1;
        }
        return result;
    };
}
var chain = _curry2(_dispatchable([
    'fantasy-land/chain',
    'chain'
], _xchain, function chain(fn, monad) {
    if (typeof monad === 'function') {
        return function(x) {
            return fn(monad(x))(x);
        };
    }
    return _makeFlat(false)(map(fn, monad));
}));
var mergeDeepRight = _curry2(function mergeDeepRight(lObj, rObj) {
    return mergeDeepWithKey(function(k, lVal, rVal) {
        return rVal;
    }, lObj, rObj);
});
var useWith = _curry2(function useWith(fn, transformers) {
    return curryN(transformers.length, function() {
        var args = [];
        var idx = 0;
        while(idx < transformers.length){
            args.push(transformers[idx].call(this, arguments[idx]));
            idx += 1;
        }
        return fn.apply(this, args.concat(Array.prototype.slice.call(arguments, transformers.length)));
    });
});
function XTap(f, xf) {
    this.xf = xf;
    this.f = f;
}
XTap.prototype['@@transducer/init'] = __default2.init;
XTap.prototype['@@transducer/result'] = __default2.result;
XTap.prototype['@@transducer/step'] = function(result, input) {
    this.f(input);
    return this.xf['@@transducer/step'](result, input);
};
var _xtap = _curry2(function _xtap(f, xf) {
    return new XTap(f, xf);
});
var tap = _curry2(_dispatchable([], _xtap, function tap(fn, x) {
    fn(x);
    return x;
}));
var when = _curry3(function when(pred, whenTrueFn, x) {
    return pred(x) ? whenTrueFn(x) : x;
});
function _isTypedArray(val) {
    var type1 = Object.prototype.toString.call(val);
    return type1 === '[object Uint8ClampedArray]' || type1 === '[object Int8Array]' || type1 === '[object Uint8Array]' || type1 === '[object Int16Array]' || type1 === '[object Uint16Array]' || type1 === '[object Int32Array]' || type1 === '[object Uint32Array]' || type1 === '[object Float32Array]' || type1 === '[object Float64Array]' || type1 === '[object BigInt64Array]' || type1 === '[object BigUint64Array]';
}
var empty = _curry1(function empty(x) {
    return x != null && typeof x['fantasy-land/empty'] === 'function' ? x['fantasy-land/empty']() : x != null && x.constructor != null && typeof x.constructor['fantasy-land/empty'] === 'function' ? x.constructor['fantasy-land/empty']() : x != null && typeof x.empty === 'function' ? x.empty() : x != null && x.constructor != null && typeof x.constructor.empty === 'function' ? x.constructor.empty() : __default1(x) ? [] : _isString(x) ? '' : _isObject(x) ? {
    } : _isArguments(x) ? function() {
        return arguments;
    }() : _isTypedArray(x) ? x.constructor.from('') : void 0;
});
var isEmpty = _curry1(function isEmpty(x) {
    return x != null && equals(x, empty(x));
});
const streamEvent = curry(($$element, iterator)=>curry(async (initialState, binaryFunction)=>{
        stream1(curry((state, eventList)=>pipe(map(pipe(prop("detail"), applyTo(state))), evert(Task), chain(pipe(reduce(mergeDeepRight, state), ap(useWith(map, [
                mergeDeepRight,
                identity
            ]), pipe(binaryFunction($$element), map(tap(when(complement(isEmpty), (state1)=>debug(`[10] Force rendering...`, forceRender($$element, state1))
            ))))))))(eventList)
        ), initialState, iterator);
    })
);
const renderApplication = curry((state, binaryFunction)=>pipe(ap(curry(($$element, state1)=>ap(streamEvent, factorizeEventIterator)($$element)(state1, binaryFunction) && forceRender($$element)
    ), applySpec(state)))
);
const processEvents = (...handlerList)=>converge((...taskList)=>evert(Task, taskList).map(reduce(mergeDeepRight, {
        }))
    , map(([predicate, handler, factorizeState = ($e, s)=>s
    ])=>curry(($$element, state)=>pipe(curryN(2, factorizeState)($$element), ap(curry((state1, stateIsReady)=>stateIsReady && handler($$element, state1) || Task.of({
                })
            ), curryN(2, predicate)($$element)))(state)
        )
    , handlerList))
;
const Request1 = factorizeType("Request", [
    "headers",
    "raw"
]);
Request1.isOrThrow = (container)=>{
    if (Request1.is(container)) return container;
    else throw new Error(`Expected a Request but got a "${container[$$type2] || typeof container}"`);
};
Request1.DELETE = Request1.delete = (url)=>Request1({
        cache: "default",
        headers: {
        },
        method: "DELETE",
        mode: "cors",
        url
    }, new Uint8Array([]))
;
Request1.GET = Request1.get = (url)=>Request1({
        cache: "default",
        headers: {
        },
        method: "GET",
        mode: "cors",
        url
    }, new Uint8Array([]))
;
Request1.POST = Request1.post = curry((url, _buffer)=>Request1({
        cache: "default",
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST",
        mode: "cors",
        url
    }, _buffer)
);
Request1.PUT = Request1.put = curry((url, _buffer)=>Request1({
        cache: "default",
        headers: {
            "Content-Type": "application/json"
        },
        method: "PUT",
        mode: "cors",
        url
    }, _buffer)
);
Request1.prototype.ap = Request1.prototype["fantasy-land/ap"] = function(container) {
    return Request1(this.headers, container.raw(this.raw));
};
Request1.prototype.bimap = Request1.prototype["fantasy-land/bimap"] = function(unaryFunctionA, unaryFunctionB) {
    return Request1(unaryFunctionA(this.headers), unaryFunctionB(this.raw));
};
Request1.prototype.chain = Request1.prototype["fantasy-land/chain"] = function(unaryFunction) {
    return unaryFunction(this.raw);
};
Request1.prototype.concat = Request1.prototype["fantasy-land/concat"] = function(container) {
    return Request1(this.headers, new Uint8Array([
        ...this.raw,
        ...container.raw
    ]));
};
Request1.empty = Request1.prototype.empty = Request1.prototype["fantasy-land/empty"] = ()=>Request1({
    }, new Uint8Array([]))
;
Request1.prototype.equals = Request1.prototype["fantasy-land/equals"] = function(container) {
    return this.headers.status === container.headers.status && this.headers.url === container.headers.url && this.raw.byteLength === container.raw.byteLength && !!this.raw.reduce((accumulator, value, index)=>accumulator && accumulator[index] == value ? accumulator : false
    , container.raw);
};
Request1.isOrThrow = (container)=>{
    if (Request1.is(container)) return container;
    else throw new Error(`Expected a Request but got a "${container[$$type2] || typeof container}"`);
};
Request1.prototype.lte = Request1.prototype["fantasy-land/lte"] = function(container) {
    return this.headers.status === container.headers.status && this.headers.url === container.headers.url && this.raw.byteLength === container.raw.byteLength && !!this.raw.reduce((accumulator, value, index)=>!accumulator && accumulator[index] > value ? accumulator : true
    , container.raw);
};
Request1.prototype.invert = Request1.prototype["fantasy-land/invert"] = function() {
    return Request1(this.headers, this.raw.reverse());
};
Request1.prototype.map = Request1.prototype["fantasy-land/map"] = function(unaryFunction) {
    return Request1(this.headers, unaryFunction(this.raw));
};
Request1.of = Request1.prototype.of = Request1.prototype["fantasy-land/of"] = (raw)=>Request1({
    }, raw)
;
const concat1 = (x)=>(y)=>x.concat(y)
;
const Task1 = factorizeType1("Task", [
    "asyncFunction"
]);
const serializeFunctionForDebug1 = (asyncFunction)=>asyncFunction.name && asyncFunction.name !== "" ? asyncFunction.name : asyncFunction.toString().length > 25 ? asyncFunction.toString().slice(0, 25).replace(/[\n\r]/g, "").replace(/\s\s*/g, " ") + "[...]" : asyncFunction.toString().replace(/[\n\r]/g, "").replace(/\s\s*/g, " ")
;
const Either1 = factorizeSumType1("Either", {
    Left: [
        $$value1
    ],
    Right: [
        $$value1
    ]
});
Either1.fromNullable = (value)=>!(typeof value !== "undefined") || !value && typeof value === "object" ? Either1.Left(value) : Either1.Right(value)
;
Either1.left = (value)=>Either1.Left(value)
;
Either1.right = (value)=>Either1.Right(value)
;
Either1.of = Either1.prototype.of = Either1.prototype["fantasy-land/of"] = (value)=>Either1.Right(value)
;
Either1.prototype.alt = Either1.prototype["fantasy-land/alt"] = function(container) {
    return this.fold({
        Left: (_)=>container
        ,
        Right: (_)=>this
    });
};
Either1.prototype.ap = Either1.prototype["fantasy-land/ap"] = function(container) {
    return this.fold({
        Left: (_)=>this
        ,
        Right: (value)=>Either1.Right.is(container) ? Either1.Right(container[$$value1](value)) : container
    });
};
Either1.prototype.chain = Either1.prototype["fantasy-land/chain"] = function(unaryFunction) {
    return this.fold({
        Left: (_)=>this
        ,
        Right: (value)=>unaryFunction(value)
    });
};
Either1.prototype.extend = Either1.prototype["fantasy-land/extend"] = function(unaryFunction) {
    return this.fold({
        Left: (_)=>this
        ,
        Right: (_)=>Either1.of(unaryFunction(this))
    });
};
Either1.prototype.extract = Either1.prototype["fantasy-land/extract"] = function() {
    return this.fold({
        Left: (_)=>this
        ,
        Right: (value)=>value
    });
};
Either1.prototype.map = Either1.prototype["fantasy-land/map"] = function(unaryFunction) {
    return this.fold({
        Left: (_)=>this
        ,
        Right: (value)=>Either1.of(unaryFunction(value))
    });
};
Either1.prototype.reduce = Either1.prototype["fantasy-land/reduce"] = function(binaryFunction, accumulator) {
    return this.fold({
        Left: (_)=>accumulator
        ,
        Right: (value)=>binaryFunction(accumulator, value)
    });
};
Either1.prototype.sequence = function(TypeRepresentation) {
    return this.traverse(TypeRepresentation, (x)=>x
    );
};
Either1.prototype.traverse = Either1.prototype["fantasy-land/traverse"] = function(TypeRepresentation, unaryFunction) {
    return this.fold({
        Left: (value)=>TypeRepresentation.of(Either1.Left(value))
        ,
        Right: (value)=>unaryFunction(value).map((x)=>Either1.Right(x)
            )
    });
};
Either1.zero = Either1.prototype.zero = Either1.prototype["fantasy-land/zero"] = ()=>Either1.Left(null)
;
Task1.wrap = (asyncFunction)=>{
    let promise;
    const proxyFunction = function(...argumentList) {
        promise = promise || asyncFunction.call(null, ...argumentList);
        return promise.then((maybeContainer)=>Either1.is(maybeContainer) ? maybeContainer : Either1.Right(maybeContainer)
        , (maybeContainer)=>Either1.is(maybeContainer) ? maybeContainer : Either1.Left(maybeContainer)
        );
    };
    return Object.defineProperty(Task1(Object.defineProperty(proxyFunction, 'length', {
        value: asyncFunction.length
    })), $$debug1, {
        writable: false,
        value: `Task(${serializeFunctionForDebug1(asyncFunction)})`
    });
};
Task1.prototype.ap = Task1.prototype["fantasy-land/ap"] = function(container) {
    return Object.defineProperty(Task1((_)=>{
        const maybePromiseValue = this.asyncFunction();
        const maybePromiseUnaryFunction = container.asyncFunction();
        return Promise.all([
            maybePromiseUnaryFunction instanceof Promise ? maybePromiseUnaryFunction : Promise.resolve(maybePromiseUnaryFunction),
            maybePromiseValue instanceof Promise ? maybePromiseValue : Promise.resolve(maybePromiseValue)
        ]).then(([maybeApplicativeUnaryFunction, maybeContainerValue])=>{
            return (Reflect.getPrototypeOf(maybeContainerValue).ap ? maybeContainerValue : Either1.Right(maybeContainerValue)).ap(Reflect.getPrototypeOf(maybeApplicativeUnaryFunction).ap ? maybeApplicativeUnaryFunction : Either1.Right(maybeApplicativeUnaryFunction));
        });
    }), $$debug1, {
        writable: false,
        value: `${this[$$debug1]}.ap(${container})`
    });
};
Task1.prototype.chain = Task1.prototype["fantasy-land/chain"] = function(unaryFunction) {
    return Object.defineProperty(Task1((_)=>{
        const maybePromise = this.asyncFunction();
        return (maybePromise instanceof Promise ? maybePromise : Promise.resolve(maybePromise)).then((maybeContainer)=>(Either1.is(maybeContainer) ? maybeContainer : Either1.Right(maybeContainer)).chain((value)=>{
                const maybePromise1 = unaryFunction(value).run();
                return (maybePromise1 instanceof Promise ? maybePromise1 : Promise.resolve(maybePromise1)).then((maybeContainer1)=>Either1.is(maybeContainer1) ? maybeContainer1 : Either1.Right(maybeContainer1)
                , (maybeContainer1)=>Either1.is(maybeContainer1) ? maybeContainer1 : Either1.Left(maybeContainer1)
                );
            })
        , Either1.Left);
    }), $$debug1, {
        writable: false,
        value: `${this[$$debug1]}.chain(${serializeFunctionForDebug1(unaryFunction)})`
    });
};
const Step1 = factorizeSumType1("Step", {
    Done: [
        'value'
    ],
    Loop: [
        'value'
    ]
});
Step1.prototype.alt = Step1.prototype["fantasy-land/alt"] = function(container) {
    return this.fold({
        Done: (_)=>container
        ,
        Loop: (_)=>this
    });
};
const Done1 = Step1.Done;
const Loop1 = Step1.Loop;
const Pair1 = factorizeType1("Pair", [
    "first",
    "second"
]);
Pair1.prototype.bimap = Pair1.prototype["fantasy-land/bimap"] = function(unaryFunctionA, unaryFunctionB) {
    return Pair1(unaryFunctionA(this.first), unaryFunctionB(this.second));
};
Pair1.prototype.map = Pair1.prototype["fantasy-land/map"] = function(unaryFunction) {
    return Pair1(unaryFunction(this.first), this.second);
};
Task1.prototype.chainRec = Task1.prototype["fantasy-land/chainRec"] = function(ternaryFunction, initialCursor) {
    let accumulator = this;
    let result = Loop1(Pair1(initialCursor, null));
    while(!Done1.is(result)){
        result = ternaryFunction(Loop1, Done1, result.value.first);
        if (Loop1.is(result)) {
            accumulator = chainLift1(concat1, accumulator, result.value.second);
        }
    }
    return accumulator;
};
Task1.prototype.map = Task1.prototype["fantasy-land/map"] = Task1.prototype.then = function(unaryFunction) {
    return Object.defineProperty(Task1((_)=>{
        const promise = this.asyncFunction();
        return promise.then((container)=>container.chain((value)=>{
                const maybeContainer = unaryFunction(value);
                return Either1.is(maybeContainer) ? maybeContainer : Either1.Right(maybeContainer);
            })
        , Either1.Left);
    }), $$debug1, {
        writable: false,
        value: `${this[$$debug1]}.map(${serializeFunctionForDebug1(unaryFunction)})`
    });
};
Task1.prototype.catch = function(unaryFunction) {
    return Object.defineProperty(Task1((_)=>{
        const promise = this.asyncFunction();
        return promise.then((container)=>Either1.Left.is(container) ? Either1.Right(unaryFunction(container[$$value1])) : container
        , Either1.Left);
    }), $$debug1, {
        writable: false,
        value: `${this[$$debug1]}.map(${serializeFunctionForDebug1(unaryFunction)})`
    });
};
Task1.of = Task1.prototype.of = Task1.prototype["fantasy-land/of"] = (value)=>Object.defineProperty(Task1((_)=>Promise.resolve(Either1.Right(value))
    ), $$debug1, {
        writable: false,
        value: `Task(${serializeFunctionForDebug1(value)})`
    })
;
Task1.prototype.run = async function() {
    const maybePromise = this.asyncFunction();
    return (maybePromise instanceof Promise ? maybePromise : Promise.resolve(maybePromise)).then((maybeContainer)=>Either1.is(maybeContainer) ? maybeContainer : Either1.Right(maybeContainer)
    , (maybeContainer)=>Either1.is(maybeContainer) ? maybeContainer : Either1.Left(maybeContainer)
    );
};
Task1.prototype.toString = Task1.prototype[$$inspect1] = function() {
    return this[$$debug1] || `Task("unknown")`;
};
const factorizeTask = (x)=>Task1.of(x)
;
window[$$debug2] = /\:[0-9]+$/.test(window.location.origin);
window[$$debug2] && (Error.stackTraceLimit = Infinity);
window.NodeList.prototype["fantasy-land/filter"] = Array.prototype.filter;
window.NodeList.prototype["fantasy-land/map"] = Array.prototype.map;
const addClass = curry((className, $$element)=>$$element.classList.add(className)
);
const cloneNode = ($$element)=>$$element.content.cloneNode(true)
;
const closest = curry((selector, $$element)=>$$element.closest(selector)
);
const getAttribute = curry((name, $$element)=>$$element.getAttribute(name) || $$element
);
const insertAdjacentElement = curry((position, $$target, $$element)=>$$target.insertAdjacentElement(position, $$element)
);
const querySelector = curry((selector, $$element)=>$$element.querySelector(selector)
);
const querySelectorAll = curry((selector, $$element)=>$$element.querySelectorAll(selector)
);
const removeAllChildren = ($$element)=>{
    while($$element.firstChild){
        $$element.removeChild($$element.lastChild);
    }
};
const removeClass = curry((className, $$element)=>$$element.classList.remove(className)
);
const setAttribute = curry((name, value, $$element)=>$$element.setAttribute(name, value) || $$element
);
const getTemplateAnchor = (_)=>querySelector("#template-vector-link", document)
;
const composeFilePath = curry((activeSection, activePage)=>`/fragments/${activeSection}-${activePage}.html`
);
const parseHash = (hash)=>hash.replace(/^#\/*|\?.+$/g, "").split("/")
;
const stringifyHash = curry((activeSection, activePage)=>`#/${activeSection}/${activePage}`
);
const handleHashChange = (_)=>addEventListener1("hashchange", curry(($$element, state)=>document.querySelector("fl-navigation").setAttribute("data-active-section", window.location.hash.replace(/^#/, "").split("-")[0]) || Task1.of(state.activePage !== parseHash(window.location.hash)[0] ? {
            activePage: parseHash(window.location.hash)[0]
        } : {
        })
    ), window)
;
const handleThemeToggleClick = pipe(querySelector("#theme-toggle"), addEventListener1("click", curry(($$element, state)=>Task1.of({
        themeMode: state.themeMode === "dark" ? "light" : "dark"
    })
)));
const parseCodeBlocks = pipe(querySelectorAll("pre code"), map(window.hljs.highlightBlock));
var juxt = _curry1(function juxt(fns) {
    return converge(function() {
        return Array.prototype.slice.call(arguments, 0);
    }, fns);
});
var flip = _curry1(function flip(fn) {
    return curryN(fn.length, function(a, b) {
        var args = Array.prototype.slice.call(arguments, 0);
        args[0] = b;
        args[1] = a;
        return fn.apply(this, args);
    });
});
const prependHeadings = converge(map, [
    pipe(getTemplateAnchor, useWith(juxt([
        useWith(flip(setAttribute("href")), [
            identity,
            pipe(prop("id"), (id)=>`#${id}`
            )
        ]),
        flip(insertAdjacentElement("afterbegin")),
        addEventListener1("click", curry(($$element, _)=>{
            window.history.pushState({
            }, "", `${window.location.hash.replace(/\?.+$/, "")}?anchor=${$$element.getAttribute("href").replace("#", "")}`);
            $$element.scrollIntoView(true);
            return Task1.of({
            });
        }))
    ]), [
        pipe(cloneNode, querySelector("a")),
        identity
    ])),
    querySelectorAll("h1 h2, h3, h4, h5")
]);
function _isRegExp(x) {
    return Object.prototype.toString.call(x) === '[object RegExp]';
}
function _cloneRegExp(pattern) {
    return new RegExp(pattern.source, (pattern.global ? 'g' : '') + (pattern.ignoreCase ? 'i' : '') + (pattern.multiline ? 'm' : '') + (pattern.sticky ? 'y' : '') + (pattern.unicode ? 'u' : ''));
}
var test = _curry2(function test(pattern, str) {
    if (!_isRegExp(pattern)) {
        throw new TypeError('‘test’ requires a value of type RegExp as its first argument; received ' + toString1(pattern));
    }
    return _cloneRegExp(pattern).test(str);
});
const overwriteExternalLinks = pipe(querySelectorAll("a"), filter(pipe(getAttribute("href"), test(/github|\.md$/))), map(addEventListener1("click", curry(($$element, state)=>{
    const ref = {
        "functional": "core",
        "functional-io": "io",
        "functional-http-server": "http",
        "functional-redis": "redis",
        "functional-flux": "flux",
        "functional-dom": "dom"
    };
    const { activePage , activeSection  } = $$element.getAttribute("href").match(/\/(?<activeSection>[a-z\-]+)\#(?<activePage>.+)/).groups;
    return Task1.of({
        activePage,
        activeSection: ref[activeSection]
    });
}))));
const assertRenderActivePage = ($$element, state)=>state.activePage !== $$element.firstElementChild.getAttribute("data-active-page")
;
const assertRenderToggleTheme = useWith(complement(equals), [
    pipe(prop("firstElementChild"), getAttribute("data-theme-mode")),
    prop("themeMode")
]);
var always = _curry1(function always(val) {
    return function() {
        return val;
    };
});
var thunkify = _curry1(function thunkify(fn) {
    return curryN(fn.length, function createThunk() {
        var fnArgs = arguments;
        return function invokeThunk() {
            return fn.apply(this, fnArgs);
        };
    });
});
const Response1 = factorizeSumType("Response", {
    Failure: [
        "headers",
        "raw"
    ],
    Success: [
        "headers",
        "raw"
    ]
});
Response1.OK = curry((headers, raw)=>Response1.Success({
        ...headers,
        status: 200
    }, raw)
);
Response1.Created = curry((headers, raw)=>Response1.Success({
        ...headers,
        status: 201
    }, raw)
);
Response1.Accepted = curry((headers, raw)=>Response1.Success({
        ...headers,
        status: 202
    }, raw)
);
Response1.NoContent = curry((headers, raw)=>Response1.Success({
        ...headers,
        status: 204
    }, raw)
);
Response1.MultipleChoice = curry((headers, error)=>Response1.Failure({
        ...headers,
        status: 300
    }, error)
);
Response1.MovePermanently = curry((headers, error)=>Response1.Failure({
        ...headers,
        status: 301
    }, error)
);
Response1.Found = curry((headers, error)=>Response1.Failure({
        ...headers,
        status: 302
    }, error)
);
Response1.NotModified = curry((headers, error)=>Response1.Failure({
        ...headers,
        status: 304
    }, error)
);
Response1.TemporaryRedirect = curry((headers, error)=>Response1.Failure({
        ...headers,
        status: 307
    }, error)
);
Response1.PermanentRedirect = curry((headers, error)=>Response1.Failure({
        ...headers,
        status: 308
    }, error)
);
Response1.BadRequest = curry((headers, error)=>Response1.Failure({
        ...headers,
        status: 400
    }, error)
);
Response1.Unauthorized = curry((headers, error)=>Response1.Failure({
        ...headers,
        status: 401
    }, error)
);
Response1.Forbidden = curry((headers, error)=>Response1.Failure({
        ...headers,
        status: 403
    }, error)
);
Response1.NotFound = curry((headers, error)=>Response1.Failure({
        ...headers,
        status: 404
    }, error)
);
Response1.MethodNotAllowed = curry((headers, error)=>Response1.Failure({
        ...headers,
        status: 405
    }, error)
);
Response1.NotAcceptable = curry((headers, error)=>Response1.Failure({
        ...headers,
        status: 406
    }, error)
);
Response1.RequestTimeout = curry((headers, error)=>Response1.Failure({
        ...headers,
        status: 408
    }, error)
);
Response1.Conflict = curry((headers, error)=>Response1.Failure({
        ...headers,
        status: 409
    }, error)
);
Response1.Gone = curry((headers, error)=>Response1.Failure({
        ...headers,
        status: 410
    }, error)
);
Response1.ImATeapot = curry((headers, error)=>Response1.Failure({
        ...headers,
        status: 418
    }, error)
);
Response1.InternalServerError = curry((headers, error)=>Response1.Failure({
        ...headers,
        status: 500
    }, error)
);
Response1.NotImplemented = curry((headers, error)=>Response1.Failure({
        ...headers,
        status: 501
    }, error)
);
Response1.BadGateway = curry((headers, error)=>Response1.Failure({
        ...headers,
        status: 502
    }, error)
);
Response1.ServiceUnavailable = curry((headers, error)=>Response1.Failure({
        ...headers,
        status: 503
    }, error)
);
Response1.GatewayTimeout = curry((headers, error)=>Response1.Failure({
        ...headers,
        status: 504
    }, error)
);
Response1.PermissionDenied = curry((headers, error)=>Response1.Failure({
        ...headers,
        status: 550
    }, error)
);
Response1.prototype.alt = Response1.prototype["fantasy-land/alt"] = function(container) {
    return this.fold({
        Failure: (_)=>container
        ,
        Success: (_)=>this
    });
};
Response1.prototype.ap = Response1.prototype["fantasy-land/ap"] = function(container) {
    return this.fold({
        Failure: (_)=>this
        ,
        Success: (_)=>Response1.Success(this.headers, container.raw(this.raw))
    });
};
Response1.prototype.bimap = Response1.prototype["fantasy-land/bimap"] = function(unaryFunctionA, unaryFunctionB) {
    return this.fold({
        Failure: (_)=>this
        ,
        Success: (_)=>Response1.Success(unaryFunctionA(this.headers), unaryFunctionB(this.raw))
    });
};
Response1.prototype.chain = Response1.prototype["fantasy-land/chain"] = function(unaryFunction) {
    return this.fold({
        Failure: (_)=>this
        ,
        Success: (_)=>unaryFunction(this.raw)
    });
};
Response1.prototype.concat = Response1.prototype["fantasy-land/concat"] = function(container) {
    return this.fold({
        Failure: (_)=>this
        ,
        Success: (_)=>Response1.Success(this.headers, new Uint8Array([
                ...this.raw,
                ...container.raw
            ]))
    });
};
Response1.empty = Response1.prototype.empty = Response1.prototype["fantasy-land/empty"] = ()=>Response1.Success({
    }, new Uint8Array([]))
;
Response1.prototype.equals = Response1.prototype["fantasy-land/equals"] = function(container) {
    return this.headers.status === container.headers.status && this.headers.url === container.headers.url && this.raw.byteLength === container.raw.byteLength && !!this.raw.reduce((accumulator, value, index)=>accumulator && accumulator[index] == value ? accumulator : false
    , container.raw);
};
Response1.isOrThrow = (container)=>{
    if (Response1.is(container)) return container;
    else throw new Error(`Expected a Response but got a "${container[$$type] || typeof container}"`);
};
Response1.prototype.lte = Response1.prototype["fantasy-land/lte"] = function(container) {
    return this.headers.status === container.headers.status && this.headers.url === container.headers.url && this.raw.byteLength === container.raw.byteLength && !!this.raw.reduce((accumulator, value, index)=>!accumulator && accumulator[index] > value ? accumulator : true
    , container.raw);
};
Response1.prototype.invert = Response1.prototype["fantasy-land/invert"] = function() {
    return this.fold({
        Failure: (_)=>this
        ,
        Success: (_)=>Response1.Success(this.headers, this.raw.reverse())
    });
};
Response1.prototype.map = Response1.prototype["fantasy-land/map"] = function(unaryFunction) {
    return this.fold({
        Failure: (_)=>this
        ,
        Success: (_)=>Response1.Success(this.headers, unaryFunction(this.raw))
    });
};
Response1.of = Response1.prototype.of = Response1.prototype["fantasy-land/of"] = (raw)=>Response1.Success({
    }, raw)
;
Response1.zero = Response1.prototype.zero = Response1.prototype["fantasy-land/zero"] = ()=>Response1.Failure({
    }, new Uint8Array([]))
;
const coerceReadableStreamToUint8Array = async (readableStream)=>{
    let _array = new Uint8Array([]);
    return readableStream.read().then(function processBody({ done , value  }) {
        if (!done) {
            _array = new Uint8Array([
                ..._array,
                ...value
            ]);
            return readableStream.read().then(processBody);
        } else return _array;
    });
};
const pureFetch = (request)=>Request1.isOrThrow(request) && Task.wrap((_)=>fetch(request.headers.url, {
            ...request.headers,
            body: request.headers.method !== "GET" ? request.headers["Content-Type"] === "application/javascript" || /^application\/[a-z-\.]*\+*json$/.test(request.headers["Content-Type"]) || /^text\//.test(request.headers["Content-Type"]) ? decodeRaw(request.raw) : request.raw : undefined
        })
    ).chain(({ body , headers , status  })=>apply(lift(status < 300 ? Response1.Success : Response1.Failure), [
            Task.of({
                ...headers,
                status
            }),
            Task.wrap((_)=>coerceReadableStreamToUint8Array(body.getReader())
            )
        ])
    )
;
const renderActivePage = pipe(useWith(curry(([[_setInnerHTML], [_hideLoader], _setActivePage], [task, activePage, activeSection, anchor])=>map(pipe(map(pipe(decodeRaw1, _setInnerHTML, juxt([
        parseCodeBlocks,
        prependHeadings,
        overwriteExternalLinks
    ]))), _hideLoader, tap((_)=>{
        window.history.pushState({
        }, "", stringifyHash(activeSection, activePage));
        _setActivePage(activePage);
        anchor && document.querySelector(`#${anchor}`)?.scrollIntoView(true);
    }), always({
    })), task)
), [
    juxt([
        pipe(querySelector("main article"), juxt([
            ($$element)=>(html)=>($$element.innerHTML = html) && $$element
            ,
            removeAllChildren
        ])),
        pipe(querySelector("#loading"), juxt([
            thunkify(addClass("--hide")),
            removeClass("--hide")
        ])),
        pipe(prop("firstElementChild"), flip(setAttribute("data-active-page")))
    ]),
    juxt([
        pipe(converge(composeFilePath, [
            prop("activeSection"),
            prop("activePage")
        ]), Request1.get, pureFetch),
        prop("activePage"),
        prop("activeSection"),
        prop("anchor")
    ])
]));
const renderToggleTheme = pipe(useWith(flip(setAttribute("data-theme-mode")), [
    prop("firstElementChild"),
    prop("themeMode")
]), always(Task1.of({
})));
var mergeDeepLeft = _curry2(function mergeDeepLeft(lObj, rObj) {
    return mergeDeepWithKey(function(k, lVal, rVal) {
        return lVal;
    }, lObj, rObj);
});
const $$definedComponents = Symbol.for("DefinedComponents");
const $$componentPreRendered = Symbol.for("ComponentPreRendered");
window[$$definedComponents] = [];
const factorizeFunctionalComponentClass = ()=>class FunctionalComponent extends window.HTMLElement {
        constructor(unaryFunction){
            super();
            if (unaryFunction) {
                const container = unaryFunction(this);
                if (container instanceof Promise) {
                    container.then((_)=>this[$$componentPreRendered] = true
                    );
                } else {
                    this[$$componentPreRendered] = true;
                }
            }
        }
    }
;
const defineComponent = curry(([componentName, initialState = {
}, pickFromGlobalState = always({
}), attributes = [], attributeChangedCallback, connectedCallback, disconnectedCallback, ], renderFunction, preRenderFunction)=>{
    const FunctionalComponent = factorizeFunctionalComponentClass();
    const Component = function() {
        return Reflect.construct(FunctionalComponent, [
            preRenderFunction
        ], new.target);
    };
    Object.setPrototypeOf(Component.prototype, FunctionalComponent.prototype);
    Object.setPrototypeOf(Component, FunctionalComponent);
    if (attributes.length > 0) Object.defineProperty(Component, "observedAttributes", {
        get () {
            return attributes;
        }
    });
    Component.prototype.connectedCallback = function() {
        debug("[12] Component is connected")(this);
        ap(streamEvent, factorizeEventIterator)(this)(applySpec(initialState)(this), renderFunction);
        if (connectedCallback) {
            const dispatchWhenPreRendered = (_)=>this[$$componentPreRendered] ? this.dispatchEvent(new CustomEvent("$$fl-render", {
                    bubbles: false,
                    detail: connectedCallback(this)
                })) : requestAnimationFrame(dispatchWhenPreRendered)
            ;
            requestAnimationFrame(dispatchWhenPreRendered);
        }
    };
    Component.prototype.disconnectedCallback = function() {
        debug("[13] Component is disconnected")(this);
        if (disconnectedCallback) this.dispatchEvent(new CustomEvent("$$fl-render", {
            bubbles: false,
            detail: disconnectedCallback(this)
        }));
    };
    Component.prototype.attributeChangedCallback = function(attributeName, oldValue, newValue) {
        debug("[14] Component has new attributes")(this);
        if (oldValue !== newValue && attributeChangedCallback) this.dispatchEvent(new CustomEvent("$$fl-render", {
            bubbles: false,
            detail: attributeChangedCallback(this)
        }));
    };
    Component.prototype[Component] = true;
    window[$$definedComponents].push(componentName);
    window.customElements.define(componentName, Component);
    let previousState = {
    };
    return [
        ($$element, state)=>pipe(pickFromGlobalState, ap(curry((newState, isDifferent)=>{
                previousState = newState;
                return !isDifferent;
            }), equals(previousState)))(state)
        ,
        ($$element, state)=>debug(`[11] Rendering component "${componentName}"`, pipe((selector)=>Array.prototype.map.call($$element.querySelectorAll(selector), ($$element1)=>$$element1[$$componentPreRendered] && $$element1.dispatchEvent(new CustomEvent("$$fl-render", {
                        bubbles: false,
                        detail: pipe(mergeDeepLeft(pickFromGlobalState(state)), renderFunction($$element1))
                    })) || $$element1
                )
            , (_)=>Task1.of({
                })
            ))(componentName)
    ];
});
const factorizeShadowFromHTML = curry((html, $$element)=>{
    $$element.attachShadow({
        mode: 'open'
    }).innerHTML = html;
    return $$element;
});
const factorizeShadowFromTemplate = curry((templateID, $$element)=>{
    const $$shadowRoot = $$element.attachShadow({
        mode: 'open'
    });
    $$shadowRoot.appendChild(document.querySelector(`#${templateID}`).content.cloneNode(true));
});
const factorizeShadowFromExternalAsset = curry((url, $$element)=>{
    const $$shadowRoot = $$element.attachShadow({
        mode: 'open'
    });
    return map(map((_buffer)=>{
        $$shadowRoot.innerHTML = new TextDecoder().decode(_buffer);
    }), pureFetch(Request1.get(url))).run().then((container)=>container.fold({
            Left: (error)=>{
                throw error;
            },
            Right: (value)=>value
        })
    );
});
var pick = _curry2(function pick(names, obj) {
    var result = {
    };
    var idx = 0;
    while(idx < names.length){
        if (names[idx] in obj) {
            result[names[idx]] = obj[names[idx]];
        }
        idx += 1;
    }
    return result;
});
const bindNavigationSection = ($$parentElement)=>($$sectionElement)=>addEventListener1("click", curryN(2, ($$element)=>$$parentElement.setAttribute("data-active-section", $$element.getAttribute("data-section-name")) || Task1.of({
            })
        ), $$sectionElement)
;
const bindNavigationPage = (_)=>($$linkElement)=>addEventListener1("click", curryN(2, ($$element)=>{
            const [activeSection, activePage] = parseHash($$element.querySelector("a").getAttribute("href"));
            return Task1.of({
                activeSection,
                activePage
            });
        }), $$linkElement)
;
const handleAttributeChange = useWith(identity, [
    pipe(applySpec({
        activeSection: getAttribute("data-active-section")
    }), factorizeTask),
    identity
]);
var call = _curry1(function call(fn) {
    return fn.apply(this, Array.prototype.slice.call(arguments, 1));
});
const handleConnected = useWith(([, , activeSection], state)=>Task1.of(activeSection !== state.activeSection ? {
        activeSection
    } : {
    })
, [
    pipe(juxt([
        converge(call, [
            pipe(prop("shadowRoot"), querySelectorAll(":host > ul > ul > li"), flip(map)),
            bindNavigationSection
        ]),
        converge(call, [
            pipe(prop("shadowRoot"), querySelectorAll(":host > ul > ul > ul > li"), flip(map)),
            bindNavigationPage
        ]),
        pipe(ap(flip(setAttribute("data-active-section")), pipe(prop("shadowRoot"), ($e)=>querySelector(`a[href="${window.location.hash}"]`, $e)
        , closest("ul"), prop("previousElementSibling"), getAttribute("data-section-name"))), getAttribute("data-active-section"))
    ])),
    identity
]);
const handleRender = curry(($$element, state)=>{
    const $$navigationSectionList = $$element.shadowRoot.querySelectorAll(":host > ul > ul > li");
    if ($$navigationSectionList.length > 0) {
        $$navigationSectionList.forEach(($e)=>$e.classList.remove("--active")
        );
        const $$activeSectionElement = Array.prototype.find.call($$navigationSectionList, ($e)=>$e.getAttribute("data-section-name") === state.activeSection
        );
        $$activeSectionElement && $$activeSectionElement.classList.add("--active");
    }
    return Task1.of({
    });
});
const renderNavigation = defineComponent([
    "fl-navigation",
    {
    },
    pick([
        "activePage",
        "activeSection"
    ]),
    [
        "data-active-section"
    ],
    handleAttributeChange,
    handleConnected
], handleRender, factorizeShadowFromExternalAsset("./navigation.html"));
const initializeApplication = juxt([
    renderApplication({
        activePage: (_)=>window.location.hash !== "" ? parseHash(window.location.hash)[1] : "either"
        ,
        activeSection: (_)=>window.location.hash !== "" ? parseHash(window.location.hash)[0] : "core"
        ,
        anchor: (_)=>/\?.*\banchor\b/.test(window.location.hash) ? window.location.hash.match(/(?<=\?.*\banchor\b=).+(?:\&|$)/)[0] : null
        ,
        loading: always(false),
        themeMode: pipe(prop("firstElementChild"), getAttribute("data-theme-mode"))
    }, processEvents(renderNavigation, [
        assertRenderToggleTheme,
        renderToggleTheme
    ], [
        assertRenderActivePage,
        renderActivePage
    ])),
    handleThemeToggleClick,
    handleHashChange
]);
window.readState = ($$element = document)=>$$element.dispatchEvent(new CustomEvent("$$fl-render", {
        detail: (state)=>console.dir(state) || Task1.of({
            })
    })) && undefined
;
window.writeState = (state, $$element = document)=>$$element.dispatchEvent(new CustomEvent("$$fl-render", {
        detail: (_)=>Task1.of(state)
    })) && undefined
;
addEventListener("DOMContentLoaded", (_)=>initializeApplication(document)
, document);
