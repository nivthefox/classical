/**
 * __          __   _ _   _                  _
 * \ \        / /  (_) | | |                | |
 *  \ \  /\  / / __ _| |_| |__    _ __   ___| |_
 *   \ \/  \/ / '__| | __| '_ \  | '_ \ / _ \ __|
 *    \  /\  /| |  | | |_| | | |_| | | |  __/ |_
 *     \/  \/ |_|  |_|\__|_| |_(_)_| |_|\___|\__|
 *
 * @created     2012-02-08
 * @edited      2013-01-16
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
var b = function(global, require, module) {
    if (typeof module.exports == 'undefined') { module.exports = {}; }

    /**
     * Defines a new Class.
     *
     * @global
     * @constructor
     */
    module.exports.Class = function(fn) { return defineClass(fn); };

    /**
     * Defines a new Class using a non-Classical class as the baseclass.
     *
     * @global
     * @constructor
     */
    module.exports.Extend = function(ancestor, fn) { return defineClass(fn, undefined, ancestor); };

    /**
     * Creates a public member of a Class.
     *
     * @global
     * @param   member
     * @return  {Object}
     * @constructor
     */
    module.exports.Public = function Public(member) { return setVisibility(member); };

    /**
     * Creates a private member of a Class.
     *
     * @global
     * @param   member
     * @return  {Object}
     * @constructor
     */
    module.exports.Private = function Private(member) { return setVisibility(member); };

    /**
     * Creates a protected member of a Class.
     *
     * @global
     * @param   member
     * @return  {Object}
     * @constructor
     */
    module.exports.Protected = function Protected(member) { return setVisibility(member); };

    /**
     * Creates a static member of a Class.
     *
     * @global
     * @param   member
     * @return  {Object}
     * @constructor
     */
    module.exports.Static = function Static(member) { return setStatic(member); };

    /**
     * The base class prototype.
     * @constructor
     */
    module.exports.BaseClass = function BaseClass() {};

    /***************************************
     * INTERNALS
     *
     * The following code is not a part of the public API for Classical, and
     * should not be altered or exposed to external scripts.
     ***************************************/
    var BaseClass                       = module.exports.BaseClass;

    /**
     * Implements Classical inheritance by wrapping prototypal inheritance.
     *
     * @param   {Function}      fn
     * @param   {Object}        _super
     * @param   {Function}      ancestor
     * @return  {ClassFactory}
     * @constructor
     * @global
     */
    var defineClass = function(fn, _super, ancestor) {
        var member;

        // Get a _preInstance.
        var _preInstance                = new fn;

        // Extend the _preInstance with members from the inheritted class, if any.
        if (typeof ancestor == 'function'
            ||  (typeof ancestor == 'object' && Object.prototype.toString.call(ancestor) == '[object Object]')) {

            if (typeof ancestor._classical_extend == 'function') {
                return ancestor._classical_extend(fn);
            }
            else {
                var AncestralClass      = (typeof ancestor == 'function') ? new ancestor : dereference(ancestor);

                for (member in AncestralClass) {
                    // WARNING: Not using hasOwnProperty here because Node EventEmitter does not have its
                    //          methods as its own properties. This creates a pretty big opening if
                    //          someone foolishly modifies the Object prototype.
                    AncestralClass[member]                  = Public(AncestralClass[member]);
                    if (typeof _preInstance[member] == 'undefined') {
                        _preInstance[member]                = AncestralClass[member];
                    }
                }
            }
        }

        // Create a copy of the SuperClass to set the prototype.
        initializing                    = true;
        var SuperClass                  = (typeof this == 'function') ? this : BaseClass;
        if (typeof ancestor == 'function') {
            SuperClass.prototype        = AncestralClass;
        }
        var prototype                   = new SuperClass;
        initializing                    = false;

        // Establish a baseline prototype chain.
        var base                        = function() {};
        base.prototype                  = prototype;

        // Extend the _preInstance with the members from the SuperClass
        if (_super !== undefined) {
            for (member in _super) {
                if (member != 'constructor' && _super.hasOwnProperty(member)) {
                    if ((_super[member]._visibility == 'Public' || _super[member]._visibility == 'Protected')
                        && typeof _preInstance[member] == 'undefined') {

                        _preInstance[member]                = _super[member];
                    }
                }
            }

            // Add the _super to the _preInstance, for construction and this._super purposes.
            _preInstance._super         = _super;
        }
        else if (AncestralClass !== undefined) {
            _preInstance._super         = AncestralClass;
        }

        return getClassFactory(base, prototype, _preInstance, arguments.callee);
    };

    var getClassFactory = function(base, prototype, _preInstance, extend) {
        var member;

        // Set up the ClassFactory.  This is what actually gets instantiated.
        var ClassFactory = function Class() {
            var _instance               = new base;
            var _public                 = new base;

            _instance._classical_public= _public;

            if (!initializing) {
                assemble(_instance, _instance, _public, _preInstance);
                construct(_instance, _instance, arguments);
            }

            return _public;
        };

        // Bind the ClassFactory to the prototype (for the inheritance chain).
        ClassFactory.prototype          = prototype;

        // Set up static methods.
        for (member in _preInstance) {
            if (member != '_super' && _preInstance.hasOwnProperty(member)) {
                // While we're at it, let's also make sure visibility has been set.
                if (!_preInstance[member].hasOwnProperty('_visibility')) {
                    _preInstance[member]                    = Public(_preInstance[member]);
                }

                if (_preInstance[member]._static === true && _preInstance[member]._visibility == 'Public') {
                    ClassFactory[member]                    = copyValue(_preInstance[member]._value, ClassFactory, _preInstance[member]._static);
                }
            }
        }

        // Setup a method to extend the base class.
        ClassFactory._classical_extend = function(newfn) {
            return extend.call(ClassFactory, newfn, _preInstance);
        };

        // Assembles the instance and its public accessors.
        var assemble = function(_context, _instance, _public, _preInstance) {
            var member;

            if (typeof _preInstance != 'undefined' && typeof _preInstance._super != 'undefined') {
                _instance._super                            = new base;
                assemble(_context, _instance._super, {}, _preInstance._super);
            }

            for (member in _preInstance) {
                if (member != '_super' && _preInstance.hasOwnProperty(member)) {
                    if (_preInstance[member]._visibility != 'Private' || _context === _instance) {
                        _instance[member]                   = copyValue(_preInstance[member]._value, _context,
                                                                        _preInstance[member]._static);

                        if (_preInstance[member]._visibility == 'Public') {
                            _public[member]                 = _instance[member];
                        }
                    }
                }
            }
        };

        // Recursively calls the constructors for the class, starting with the ancestor
        // and working towards the instance.
        var construct = function(context, target, arguments) {
            // Call the SuperClass constructors first.
            if (target._super instanceof BaseClass) {
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

        if (typeof source == 'object' && source !== null) {
            target = (typeof source.length == 'number') ? [] : {};

            for (var i in source) {
                if (source.hasOwnProperty(i)) {
                    target[i]           = dereference(source[i]);
                }
            }
        }
        else {
            target                      = source;
        }

        return target;
    };

    /**
     * Used to prevent calling the constructor during ClassFactory creation.
     * @type    {Boolean}
     */
    var initializing = false;

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
            _value                      : member,
            _visibility                 : arguments.callee.caller.name,
            _static                     : false
        }
    };

    /**
     * A wrapper around the Public, Private, and Protected APIs to make a method static.
     * @param   {Object}    member
     * @return  {Object}
     */
    var setStatic = function(member) {
        member._static                  = true;
        return member;
    };

    // Set up the global Classical variables.
    global.Classical                    = global.Classical || {};
    global.Classical.Class              = module.exports.Class;
    global.Classical.Extend             = module.exports.Extend;
    global.Classical.Public             = module.exports.Public;
    global.Classical.Private            = module.exports.Private;
    global.Classical.Protected          = module.exports.Protected;
    global.Classical.Static             = module.exports.Static;

    // Register classical globals.
    if ((typeof process != 'undefined' && typeof process.env != 'undefined' && process.env.CLASSICAL_PROTECTGLOBALS !== true)
        ||  (typeof window != 'undefined' && window.CLASSICAL_PROTECTGLOBALS !== true)
        ||  (typeof global != 'undefined' && global.CLASSICAL_PROTECTGLOBALS !== true)) {
        global.Class                    = global.Classical.Class;
        global.Extend                   = global.Classical.Extend;
        global.Public                   = global.Classical.Public;
        global.Private                  = global.Classical.Private;
        global.Protected                = global.Classical.Protected;
        global.Static                   = global.Classical.Static;
    }

    return module.exports;
};


if (typeof window != 'undefined') {
    // requirejs
    define(['require', 'module', 'Classical'], b.bind(this, window));
}
else if (typeof module != 'undefined' && typeof module.exports != 'undefined') {
    // nodejs
    b(global, require, module);
}
else {
    // web workers
    b(this, null, this);
}
