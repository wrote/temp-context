import { equal, ok } from 'zoroaster/assert'
import makePromise from 'makepromise'
import { lstat } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import TempContext from '../../src'
import Context from '../context'

/** @type {Object.<string, (tc: TempContext, c: Context)>} */
const T = {
  context: [TempContext, Context],
  'is a function'() {
    equal(typeof TempContext, 'function')
  },
  async 'creates a temp directory'({ TEMP }) {
    const s = await makePromise(lstat, TEMP)
    ok(s.isDirectory())
  },
  async 'writes a file'({ TEMP, write, read, readGlobal }) {
    const p = 'data.temp'
    const d = 'hello-world'
    const pp = await write(p, d)
    equal(pp, join(TEMP, p))
    const s = await makePromise(lstat, join(TEMP, p))
    ok(s.isFile())
    const r = await read(p)
    equal(r, d)
    const r2 = await readGlobal(pp)
    equal(r2, d)
  },
  async 'partial snapshot'({ TEMP, clone, snapshot }, { DIR }) {
    await clone(DIR, TEMP)
    const s = await snapshot('dir/dir2')
    equal(s, `# 1.txt

dir2-1.txt`)
  },
}

/** @type {Object.<string, (c: Context)>} */
const manual = {
  context: Context,
  async 'creates a temp directory'({ exists }) {
    const tc = new TempContext()
    const p = 'test/temp'
    const e = await exists(p)
    ok(!e, 'Temp dir is not supposed to exists.')
    await tc._init()
    const e2 = await exists(p)
    ok(e2, 'Temp dir should have been created after the init.')
    await tc._destroy()
    const e3 = await exists(p)
    ok(!e3, 'Temp dir should have been removed after the destroy')
  },
  async 'extends and sets the OS temp dir'({ exists }) {
    const n = 'test'
    class E extends TempContext {
      constructor() {
        super()
        this._useOSTemp(n)
      }
    }
    const e = new E()
    const j = join(tmpdir(), n)
    equal(e.TEMP, j)
    await e._init()
    const e1 = await exists(j)
    ok(e1)
    await e._destroy()
    const e2 = await exists(j)
    ok(!e2)
  },
}

export { manual }

export default T