const { debuglog } = require('util');

const LOG = debuglog('@wrote/temp-context')

/**
 * A test context to create and erase temp directories.
 * @param {Config} config Options for the program.
 * @param {boolean} config.shouldRun A boolean option.
 */
               async function tempContext(config) {
  const {
    type,
  } = config
  LOG('@wrote/temp-context called with %s', type)
  return type
}

/* documentary types/index.xml */
/**
 * @typedef {Object} Config Options for the program.
 * @prop {boolean} shouldRun A boolean option.
 */


module.exports = tempContext
//# sourceMappingURL=index.js.map