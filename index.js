/**
 * __          __   _ _   _                  _
 * \ \        / /  (_) | | |                | |
 *  \ \  /\  / / __ _| |_| |__    _ __   ___| |_
 *   \ \/  \/ / '__| | __| '_ \  | '_ \ / _ \ __|
 *    \  /\  /| |  | | |_| | | |_| | | |  __/ |_
 *     \/  \/ |_|  |_|\__|_| |_(_)_| |_|\___|\__|
 *
 * @created     2012-02-08
 * @edited      2012-10-23
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

var a = function(require) {
    var version                             = '2.2.5';

    // Prevents shenanigans like loading classical twice.
    if (typeof process != 'undefined' && typeof process.versions != 'undefined') {
        if (typeof process.versions.classical != 'undefined') {
            if (version !== process.versions.classical) {
                throw new Error('Attempted to load classical ' + version + ', but version ' + process.versions.classical + ' is already loaded.');
            }
        }
        else {
            process.versions.classical      = version;
        }
    }

    if (typeof window == 'undefined') {
        var Class                           = require('./src/Class');
        var Interface                       = require('./src/Interface');
    }

    return global.Classical;
};

if (typeof window != 'undefined') {
    define(['require', 'Class', 'Interface'], a);
}
else {
    module.exports = a(require, exports, module);
}

