let Pedantry = require('pedantry'); if (Pedantry && Pedantry.__esModule) Pedantry = Pedantry.default;
const SnapshotStream = require('./SnapshotStream');
const { lstat, createReadStream } = require('fs');
const { collect } = require('catchment');
let makePromise = require('makepromise'); if (makePromise && makePromise.__esModule) makePromise = makePromise.default;

       const getSnapshot = async (path, requestedPath) => {
  const s = new SnapshotStream()
  /** @type {import('fs').Stats} */
  const ls = await makePromise(lstat, path)
  if (ls.isDirectory()) {
    const pedantry = new Pedantry(path, {
      addBlankLine: true,
    })
    pedantry.on('file', f => s.currentFile = f)
    pedantry.pipe(s)
    pedantry.on('error', e => s.emit('error', e))
  } else if (ls.isFile()) {
    s.currentFile = requestedPath
    const rs = createReadStream(path)
    rs.pipe(s)
    rs.on('error', e => s.emit('error', e))
  }
  const snapshot = await collect(s)
  return snapshot
}

module.exports.getSnapshot = getSnapshot