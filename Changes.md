 * Changelog:
 *   - 2012-10-23: Adapted frontend to include require.js hooks (uncomment to activate).
 *   - 2012-10-19: Minor bug in init script was causing conflicts with require statements in nodejs.
 *   - 2012-10-17: Rearchitected how Classical affects Globals, and added an option to protect the global namespace.
 *   - 2012-10-17: Moved TYPES to Interface, which actually uses them.
 *   - 2012-10-02: Added Inherit
 *   - 2012-09-28: Fixes for dereference method and handling of browser vs nodejs.
 *   - 2012-09-27: Complete rewrite to accomplish Public, Private, and Protected instances,
                   and to better handle method bindings. The need for method.call should be
                   almost nonexistent, now.
 *   - 2012-08-28: Converted to NPM registry.
 *   - 2012-08-23: SuperClass assignment was still going to parent instead of super.
 *   - 2012-08-21: Added interfaces and a method of implementing them.
 *   - 2012-08-21: Renamed .parent to .super; .parent is now deprecated.
 *   - 2012-08-21: When constructing an instance of a class, we now call the class's
                   parent constructors before calling the class constructor.
