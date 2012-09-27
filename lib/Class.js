/**
 * __          __   _ _   _                  _
 * \ \        / /  (_) | | |                | |
 *  \ \  /\  / / __ _| |_| |__    _ __   ___| |_
 *   \ \/  \/ / '__| | __| '_ \  | '_ \ / _ \ __|
 *    \  /\  /| |  | | |_| | | |_| | | |  __/ |_
 *     \/  \/ |_|  |_|\__|_| |_(_)_| |_|\___|\__|
 *
 * @created     2012-02-08
 * @edited      2012-09-26
 * @package     Libraries
 * @see         https://github.com/writh/classical
 *
 * Copyright (C) 2012 Kevin Kragenbrink <kevin@writh.net>
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
 * DEALINGS IN THE SOFTWARE.
 */

global                                  = global || {};

/**
 * Defines a new Class.
 *
 * @param   {Function}      definition
 * @global
 * @return  {ClassFactory}
 * @constructor
 */
global.Class = function Class(definition) { return define(definition); };

/**
 * Creates a public member of a Class.
 *
 * @global
 * @param   member
 * @return  {Object}
 * @constructor
 */
global.Public = function Public(member) { return setVisibility(member); };

/**
 * Creates a private member of a Class.
 *
 * @global
 * @param   member
 * @return  {Object}
 * @constructor
 */
global.Private = function Private(member) { return setVisibility(member); };

/**
 * Creates a protected member of a Class.
 *
 * @global
 * @param   member
 * @return  {Object}
 * @constructor
 */
global.Protected = function Protected(member) { return setVisibility(member); };

/**
 * Creates a static member of a Class.
 *
 * @global
 * @param   member
 * @return  {Object}
 * @constructor
 */
global.Static = function Static(member) { return setStatic(member); };


/***************************************
 * INTERNALS
 *
 * The following code is not a part of the public API for Classical, and
 * should not be altered or exposed to external scripts.
 ***************************************/
var define = function Class(fn, _super) {
    _super                              = _super || BaseClass;
    instantiating                       = true;
    var _preInstance                    = new fn;
    var _superInstance                  = new _super;
    instantiating                       = false;

    var ClassFactory = function() {
        var _instance                   = {};
        var _public                     = function() {};

        if (_superInstance instanceof BaseClass) {
            _public.prototype           = _superInstance;

            for (var i in _superInstance) {
                if (_superInstance.hasOwnProperty(i) && (_superInstance._visibility == 'Public' || _superInstance._visibility == 'Protected')) {
                    _instance[i]            = copyValue(_superInstance[i]._value, _instance);
                }

                if (_super.hasOwnProperty(i) && _super[i]._visibility == 'Public') {
                    _public[i]              = _instance[i];
                }
            }
        }
        _public                         = new _public;

        for (var i in _preInstance) {
            if (_preInstance.hasOwnProperty(i)) {
                _instance[i]            = copyValue(_preInstance[i]._value, _instance);
            }

            if (_preInstance.hasOwnProperty(i) && _preInstance[i]._visibility == 'Public') {
                _public[i]              = _instance[i];
            }

            Construct(_instance, _instance, arguments);
        }

        return _public;
    };

    // Calls the constructor just in time.
    var Construct = function(context, callee, args) {
        if (instantiating !== true) {
            // Call the SuperClass constructors first.
            if (callee._super instanceof ClassFactory) {
                instantiating           = true;
                var _super              = new callee._super;
                instantiating           = false;
                Construct(context, _super, arguments);
            }

            // Call the instance constructor.
            // TODO: Find some way to check for private constructors and throw an error.
            if (typeof callee.constructor == 'function' && callee.hasOwnProperty('constructor')) {
                callee.constructor.apply(context, arguments);
            }
        }
    };

    // Setup static members from the SuperClass.
    for (var i in _superInstance) {
        if (_superInstance.hasOwnProperty(i)
            && _superInstance[i]._static == true
            && _superInstance[i]._visibility === 'Public') {
            ClassFactory[i]             = _superInstance[i]._value.bind({});
        }
    }

    // Setup static members.
    for (var i in _preInstance) {
        if (_preInstance.hasOwnProperty(i)
            && _preInstance[i]._static == true
            && _preInstance[i]._visibility === 'Public') {
            ClassFactory[i]             = _preInstance[i]._value.bind({});
        }
    }

    // Setup extend method.
    ClassFactory.extend = function(newfn) {
        return Class(newfn, fn);
    };

    return ClassFactory;
};

/**
 * Used to prevent calling the constructor during ClassFactory creation.
 * @type    {Boolean}
 */
var instantiating                       = false;

/**
 * Returns a dereferenced copy of a value, bound to the target if it is a function.
 *
 * @param   {*}         member
 * @param   {Object}    target
 * @return  {*}
 */
var copyValue = function(member, target) {
    if (typeof member == 'function') {
        return member.bind(target);
    }
    else {
        // TODO: Use object extension to accomplish this, rather than direct references, to prevent
        //       non-primitive types from being passed by reference.
        return member;
    }
};

/**
 * A common interface for the Public, Private, and Protected APIs.
 * @param   {*}         member
 * @return  {Object}
 */
var setVisibility = function(member) {
    return {
        _value                          : member,
        _visibility                     : arguments.callee.caller.name,
        _static                         : false
    }
};

/**
 * A wrapper around the Public, Private, and Protected APIs to make a method static.
 * @param   {Object}    member
 * @return  {Object}
 */
var setStatic = function(member) {
    member._static                      = true;
    return member;
};

var BaseClass = function() {};

module.exports                          = global.Class;
module.exports.BaseClass                = BaseClass;

if (typeof window !== 'undefined') {
    for (var i in global) {
        if (global.hasOwnProperty(i)) {
            window[i]                   = global[i];
        }
    }
}