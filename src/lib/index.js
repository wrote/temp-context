import Pedantry from 'pedantry'
import SnapshotStream from './SnapshotStream'
import { lstat, createReadStream } from 'fs'
import { collect } from 'catchment'
import makePromise from 'makepromise'

export const getSnapshot = async (path, requestedPath) => {
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