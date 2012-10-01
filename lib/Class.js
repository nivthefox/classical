/**
 * __          __   _ _   _                  _
 * \ \        / /  (_) | | |                | |
 *  \ \  /\  / / __ _| |_| |__    _ __   ___| |_
 *   \ \/  \/ / '__| | __| '_ \  | '_ \ / _ \ __|
 *    \  /\  /| |  | | |_| | | |_| | | |  __/ |_
 *     \/  \/ |_|  |_|\__|_| |_(_)_| |_|\___|\__|
 *
 * @created     2012-02-08
 * @edited      2012-09-28
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
 * DEALINGS IN THE SOFTWARE.I
 */

if (typeof global == 'undefined') { global = window; }
if (typeof module == 'undefined') { module = {}; }
if (typeof window == 'undefined') { window = global; }

/**
 * Defines a new Class.
 *
 * @global
 * @constructor
 */
global.Class = function(fn) { return define(fn); };

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
var BaseClass                           = function BaseClass() {};

/**
 * Implements Classical inheritance by wrapping prototypal inheritance.
 *
 * @param   {Function}      fn
 * @param   {Object}        _super
 * @return  {ClassFactory}
 * @constructor
 * @global
 */
var define = function(fn, _super) {
    var member;
    _super                              = _super || {};

    // Create a copy of the SuperClass to set the prototype.
    initializing                        = true;
    var InheritedPrototype              = typeof this == 'function' ? this : BaseClass;
    var prototype                       = new InheritedPrototype;
    initializing                        = false;

    // Get a _preInstance.
    var _preInstance                    = new fn;
    var base                            = function() {};
    base.prototype                      = prototype;

    // Extend the _preInstance with the parent's members.
    for (member in _super) {
        if (member != 'constructor' && _super.hasOwnProperty(member)) {
            if ((_super[member]._visibility == 'Public' || _super[member]._visibility == 'Protected') && typeof _preInstance[member] == 'undefined') {
                _preInstance[member]    = _super[member];
            }
        }
    }

    // Add the _super to the _preInstance, for construction and this._super purposes.
    _preInstance._super                 = _super;

    // Set up the ClassFactory.  This is what actually gets instantiated.
    var ClassFactory = function() {
        var _instance                   = new base;
        var _public                     = new base;

        if (!initializing) {
            assemble(_instance, _instance, _public, _preInstance);
            construct(_instance, _instance, arguments);
        }

        return _public;
    };

    // Bind the ClassFactory to the prototype (for the inheritance chain).
    ClassFactory.prototype              = prototype;

    // Set up static methods.
    for (member in _preInstance) {
        if (_preInstance.hasOwnProperty(member)) {
            if (_preInstance[member]._static === true && _preInstance[member]._visibility == 'Public') {
                ClassFactory[member]    = copyValue(_preInstance[member]._value, ClassFactory, _preInstance[member]._static);
            }
        }
    }

    // Setup a method to extend the base class.
    var extend                          = arguments.callee;
    ClassFactory.extend                 = function(newfn) {
        return extend.call(ClassFactory, newfn, _preInstance);
    };

    // Assembles the instance and its public accessors.
    var assemble = function(_context, _instance, _public, _preInstance) {
        var member;

        if (typeof _preInstance._super != 'undefined') {
            _instance._super            = new base;
            assemble(_context, _instance._super, {}, _preInstance._super);
        }

        for (member in _preInstance) {
            if (member != '_super' && _preInstance.hasOwnProperty(member)) {
                if (_preInstance[member]._visibility != 'Private' || _context === _instance ) {
                    _instance[member]   = copyValue(_preInstance[member]._value, _context, _preInstance[member]._static);

                    if (_preInstance[member]._visibility == 'Public') {
                        _public[member] = _instance[member];
                    }
                }

            }
        }
    };

    // Recursively calls the constructors for the class, starting with the ancestor
    // and working towards the instance.
    var construct = function(context, target, arguments) {
       // Call the SuperClass constructors first.
       if(target._super instanceof BaseClass && target._super._super instanceof BaseClass) {
           construct(context, target._super, arguments);
       }

       // Call the instance constructor.
       if (typeof target.constructor == 'function' && target.hasOwnProperty('constructor')) {
           target.constructor.apply(context, arguments);
       }
   };

    return ClassFactory;
};

/**
 * Performs a deep clone to dereference an object.
 *
 * @param   {*}     source
 * @return  {*}
 */
var dereference = function(source) {
    var target;

    if (typeof source == 'object') {
        target                          = (typeof source.length == 'number') ? [] : {};

        for (var i in source) {
            if (source.hasOwnProperty(i)) {
                target[i]               = dereference(source[i]);
            }
        }
    }
    else {
        target                          = source;
    }

    return target;
};

/**
 * Used to prevent calling the constructor during ClassFactory creation.
 * @type    {Boolean}
 */
var initializing                        = false;

/**
 * Returns a dereferenced copy of a value, bound to the target if it is a function.
 *
 * @param   {*}         member
 * @param   {Object}    target
 * @param   {Boolean}   _static
 * @return  {*}
 */
var copyValue = function(member, target, _static) {
    if (typeof member == 'function') {
        return member.bind(target);
    }
    else {
        return (!_static ? dereference(member) : member);
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

module.exports                          = global.Class;
module.exports.BaseClass                = BaseClass;