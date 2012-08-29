/**
 * __          __   _ _   _                  _
 * \ \        / /  (_) | | |                | |
 *  \ \  /\  / / __ _| |_| |__    _ __   ___| |_
 *   \ \/  \/ / '__| | __| '_ \  | '_ \ / _ \ __|
 *    \  /\  /| |  | | |_| | | |_| | | |  __/ |_
 *     \/  \/ |_|  |_|\__|_| |_(_)_| |_|\___|\__|
 *
 * @created     2012-02-08
 * @edited      2012-08-28
 * @package     Libraries
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

var Class                               = function() {};
var initializing                        = false;

/**
 * Implements a classical inheritance pattern.
 *
 * @param   {function}      fn          The class definition.
 * @return  ClassFactory
 */
Class.create = function(fn) {
    // Create a copy of the SuperClass to set the prototype and
    // provide access to the parent.
    initializing                        = true;
    var prototype                       = new this;
    initializing                        = false;
    // Assign the prototype and the parent.
    fn.prototype                        = prototype;

    /**
     * Construct a ClassFactory.
     */
    function ClassFactory() {
        var re                          = new fn;
            re.super                    = prototype;
            re.parent                   = re.super; // DEPRECATED

        try {
            Construct(re, re, arguments);
        }
        catch (e) {
            console.error(e);
        }
        return re;
    }
    ClassFactory.prototype              = fn.prototype;
    ClassFactory.extend                 = arguments.callee;

    /**
     * Validates interface implementations.
     */
    ClassFactory.implements = function() {
        var interfaces                  = Array.prototype.slice.call(arguments, 0);

        initializing                    = true;
        var prototype                   = new fn;

        for (var i in interfaces) {
            var iface                   = new interfaces[i];

            for (var member in iface) {
                if (typeof iface[member] !== typeof prototype[member]) {
                    throw new TypeError('Interface improperly implemented ' + member + ' member.');
                }
            }
        }

        initializing                    = false;
    };

    /**
     * Constructs the class during assembly.
     */
    function Construct(context, callee, arguments) {
        // During initialization, don't call the constructor.
        if (initializing !== true) {
            // Call the SuperClass constructors first.
            if (callee.super instanceof Class && callee.super.super instanceof Class) {
                Construct(context, callee.super, arguments);
            }

            // Call the instance constructor.
            if (typeof callee.constructor === 'function' && callee.hasOwnProperty('constructor')) {
                callee.constructor.apply(context, arguments);
            }
        }
    }

    return ClassFactory;
};

Class.interface = function(fn) {
    var InterfaceFactory = function() {
        if (initializing === false) {
            throw new Error('Attempted to instantiate interface.');
        }
        return new fn;
    };

    return InterfaceFactory;
};

module.exports                          = Class;
