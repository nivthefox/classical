/**
 * __          __   _ _   _                  _
 * \ \        / /  (_) | | |                | |
 *  \ \  /\  / / __ _| |_| |__    _ __   ___| |_
 *   \ \/  \/ / '__| | __| '_ \  | '_ \ / _ \ __|
 *    \  /\  /| |  | | |_| | | |_| | | |  __/ |_
 *     \/  \/ |_|  |_|\__|_| |_(_)_| |_|\___|\__|
 *
 * @created     2012-10-03
 * @edited      2013-01-07
 * @package     Libraries
 * @see         https://github.com/Writh/classical
 *
 * Copyright (C) 2012-2013 Kevin Kragenbrink <kevin@writh.net>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.I
 */
var c = function(global, require, module) {
if (typeof global.Classical == 'undefined' || typeof global.Classical.Class == 'undefined') {throw new Error('Class.js must be required first.');}
if (typeof module.exports == 'undefined') { module.exports = {}; }

// Type validators.
var Types                               = {};
    Types.BOOL                          = function BOOL(a) {return Boolean(a) === a};
    Types.INT                           = function INT(a) {return parseInt(a) === a};
    Types.FLOAT                         = function FLOAT(a) {return parseFloat(a) === a};
    Types.STRING                        = function STRING(a) {return String(a) === a};
    Types.UNDEFINED                     = function UNDEFINED(a,undefined) {return a === undefined};
    Types.NULL                          = function NULL(a) {return a === null};
    Types.OBJECT                        = function OBJECT(a) {return (typeof a == 'object' && Object.prototype.toString.call(a) == '[object Object]')};
    Types.ARRAY                         = function ARRAY(a) {return (typeof a == 'object' && Object.prototype.toString.call(a) == '[object Array]')};
    Types.FUNCTION                      = function ARRAY(a) {return typeof a == 'function'};

for (var i in Types) {
    if (Types.hasOwnProperty(i)) {
        module.exports[i]               = Types[i];
    }
}

/**
 * Defines a new Interface.
 *
 * @global
 * @constructor
 */
module.exports.Interface = function(fn) { return defineInterface(fn); };

/**
 * Implements interfaces with a new class.
 *
 * @param interfaces
 * @param fn
 */
module.exports.Implement = function(interfaces, fn) { return implementInterfaces(interfaces, fn); };

/**
 * The base interface prototype.
 * @constructor
 */
module.exports.BaseInterface            = function BaseInterface() {};

/***************************************
 * INTERNALS
 *
 * The following code is not a part of the public API for Classical, and
 * should not be altered or exposed to external scripts.
 ***************************************/
var BaseInterface                       = module.exports.BaseInterface;

var defineInterface = function(fn, _super) {
    var member;

    // Get a _preInstance.
    var _preInstance                    = new fn;

    // Create a copy of the SuperInterface to set the prototype.
    initializing                        = true;
    var SuperInterface                  = typeof this == 'function' ? this : BaseInterface;
    var prototype                       = new SuperInterface;
    initializing                        = false;

    // Establish the baseline prototype chain.
    var base                            = function() {};
    base.prototype                      = prototype;

    // Extend the _preInstance with the members from the SuperInterface
    for (member in _super) {
        if (member != 'constructor' && _super.hasOwnProperty(member)) {
            if (typeof _preInstance[member] == 'undefined') {
                _preInstance[member]    = _super[member]
            }
        }
    }

    // Set up the InterfaceFactory. This is what prevents instantiation and provides extension.
    var InterfaceFactory = function Interface() {
        if (!initializing) {
            throw new Error('Cannot instantiate interface.');
        }
        else {
            return _preInstance;
        }
    };
    InterfaceFactory.prototype          = prototype;

    // Set up a method to extend the interface.
    var extend                          = arguments.callee;
    InterfaceFactory._classical_extend = function(newfn) {
        return extend.call(InterfaceFactory, newfn, _preInstance);
    };

    return InterfaceFactory;
};

var implementInterfaces = function(interfaces, fn) {
    var member;

    // Get a _preInstance.
    var _preInstance                        = new fn;

    if (typeof interfaces != 'object' || Object.prototype.toString.call(interfaces) != '[object Array]') {
        interfaces                          = [interfaces];
    }

    for (var i in interfaces) {
        if (interfaces.hasOwnProperty(i)) {
            initializing                    = true;
            var iface = new interfaces[i];
            initializing                    = false;

            for (member in iface) {

                // Validate type.
                if (iface.hasOwnProperty(member)) {
                    switch (iface[member]._value) {
                        case Types.BOOL:
                        case Types.INT:
                        case Types.FLOAT:
                        case Types.STRING:
                        case Types.UNDEFINED:
                        case Types.NULL:
                        case Types.OBJECT:
                        case Types.ARRAY:
                        case Types.FUNCTION:
                            if(iface[member]._value(_preInstance[member]._value) !== true) {
                                throw new TypeError('Member ' + member + ' expected ' + iface[member]._value.name + '.');
                            }
                            break;
                        default:
                            if (typeof iface[member]._value == 'function') {
                                if (typeof _preInstance[member]._value != 'function') {
                                    throw new TypeError('Method ' + member + ' is not a function.');
                                }
                                else if (iface[member]._value.length != _preInstance[member]._value.length) {
                                    throw new TypeError('Method ' + member + ' expected ' + iface[member]._value.length + ' arguments.');
                                }
                            }
                            break;
                    }

                    // Validate visibility
                    if (iface[member]._visibility != _preInstance[member]._visibility) {
                        throw new TypeError('Member ' + member + ' expected ' + iface[member]._visibility  + ' visibility.');
                    }

                    // Validate static
                    if (iface[member]._static != _preInstance[member]._static) {
                        throw new TypeError('Member ' + member + (iface[member]._static ? ' was' : ' was not') + ' expected to be static.');
                    }
                }
            }
        }
    }

    return global.Classical.Class(fn);
};

/**
 * Used to prevent calling the constructor during ClassFactory creation.
 * @type    {Boolean}
 */
var initializing                        = false;

// Set up the global Classical variables.
global.Classical                    = global.Classical || {};
global.Classical.Interface          = module.exports.Interface;
global.Classical.Implement          = module.exports.Implement;
global.Classical.type               = Types;

// Register classical globals.
if (   (typeof process != 'undefined' && typeof process.env != 'undefined' && process.env.CLASSICAL_PROTECTGLOBALS !== true)
   ||  (typeof window != 'undefined' && window.CLASSICAL_PROTECTGLOBALS !== true)
   ||  (typeof global != 'undefined' && global.CLASSICAL_PROTECTGLOBALS !== true)) {
    global.Interface                    = global.Classical.Interface;
    global.Implement                    = global.Classical.Implement;
}
return module.exports;
};

if (typeof window != 'undefined') {
    // requirejs
    define(['require', 'module', 'Classical', 'Class'], c.bind(this, window));
}
else if (typeof module != 'undefined' && typeof module.exports != 'undefined') {
    // nodejs
    module.exports = c(global, require, module);
}
else {
    // web workers
    c(this, null, this);
}
