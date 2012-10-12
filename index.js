/**
 * __          __   _ _   _                  _
 * \ \        / /  (_) | | |                | |
 *  \ \  /\  / / __ _| |_| |__    _ __   ___| |_
 *   \ \/  \/ / '__| | __| '_ \  | '_ \ / _ \ __|
 *    \  /\  /| |  | | |_| | | |_| | | |  __/ |_
 *     \/  \/ |_|  |_|\__|_| |_(_)_| |_|\___|\__|
 *
 * @created     2012-02-08
 * @edited      2012-10-12
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
var version                             = '2.2.1';

// Prevents shenanigans like loading classical twice.
if (typeof process != 'undefined' && typeof process.versions != 'undefined') {
    if (typeof process.versions.classical != 'undefined') {
        if (version !== process.versions.classical) {
            throw new Error('Attempted to load classical ' + version + ', but version ' + process.versions.classical + ' is already loaded.');
        }

        return;
    }
    else {
        process.versions.classical      = version;
    }
}

if (typeof module == 'undefined') { module = {}; }
module.exports.Class                    = require('./src/Class');
module.exports.Interface                = require('./src/Interface');

// Types
module.exports.BOOL                     = function BOOL(a) {return Boolean(a) === a};
module.exports.INT                      = function INT(a) {return parseInt(a) === a};
module.exports.FLOAT                    = function FLOAT(a) {return Number(a) === a};
module.exports.STRING                   = function STRING(a) {return String(a) === a};
module.exports.UNDEFINED                = function UNDEFINED(a,undefined) {return a === undefined};
module.exports.NULL                     = function NULL(a) {return a === null};
module.exports.OBJECT                   = function OBJECT(a) {return (typeof a == 'object' && Object.prototype.toString.call(a) == '[object Object]')};
module.exports.ARRAY                    = function ARRAY(a) {return (typeof a == 'object' && Object.prototype.toString.call(a) == '[object Array]')};
module.exports.FUNCTION                 = function ARRAY(a) {return typeof a == 'function'};
})();
