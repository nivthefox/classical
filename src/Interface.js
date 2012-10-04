/**
 * __          __   _ _   _                  _
 * \ \        / /  (_) | | |                | |
 *  \ \  /\  / / __ _| |_| |__    _ __   ___| |_
 *   \ \/  \/ / '__| | __| '_ \  | '_ \ / _ \ __|
 *    \  /\  /| |  | | |_| | | |_| | | |  __/ |_
 *     \/  \/ |_|  |_|\__|_| |_(_)_| |_|\___|\__|
 *
 * @created     2012-10-03
 * @edited      2012-10-03
 * @package     Libraries
 * @see         https://github.com/Writh/classical
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
(function() {
if (typeof global == 'undefined') { global = window; }
if (typeof global == 'undefined') { global = {}; }
if (typeof window == 'undefined') { window = global; }
if (typeof module == 'undefined') { module = {}; }

/**
 * Defines a new Interface.
 *
 * @global
 * @constructor
 */
global.Interface = function(fn) { return defineInterface(fn); };

/**
 * Implements interfaces with a new class.
 *
 * @param interfaces
 * @param fn
 */
global.Implement = function(interfaces, fn) { return implementInterfaces(interfaces, fn); };

/***************************************
 * INTERNALS
 *
 * The following code is not a part of the public API for Classical, and
 * should not be altered or exposed to external scripts.
 ***************************************/

var defineInterface = function(fn) {

};

var implementInterfaces = function(interfaces, fn) {

};

module.exports                          = global.Interface;
module.exports.BaseInterface            = Interface;
})();
