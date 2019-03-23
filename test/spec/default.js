import { equal, ok } from 'zoroaster/assert'
import { realpathSync } from 'fs'
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
  async 'creates a temp directory'({ TEMP }, { lstat }) {
    const s = await lstat(TEMP)
    ok(s.isDirectory())
  },
  async 'writes a file'({ TEMP, write, read, readGlobal }, { lstat }) {
    const p = 'data.temp'
    const d = 'hello-world'
    const pp = await write(p, d)
    equal(pp, join(TEMP, p))
    const s = await lstat(TEMP, p)
    ok(s.isFile())
    const r = await read(p)
    equal(r, d)
    const r2 = await readGlobal(pp)
    equal(r2, d)
  },
  async 'ensures the path'({ TEMP, write }, { lstat }) {
    const p = 'path/data.temp'
    const d = 'hello-world'
    await write(p, d)
    const s = await lstat(TEMP, p)
    ok(s.isFile())
  },
  async 'partial snapshot'({ TEMP, clone, snapshot }, { DIR }) {
    await clone(DIR, TEMP)
    const s = await snapshot('dir/dir2')
    equal(s, `# 1.txt

dir2-1.txt`)
  },
  async 'adds a dir'({ add, TEMP }, { DIR, lstat }) {
    const res = await add(DIR)
    equal(res, join(TEMP, 'dir'))
    const s = await lstat(res)
    ok(s.isDirectory())
  },
  async 'adds a file'({ add, TEMP }, { FIXTURE, lstat }) {
    const res = await add(FIXTURE)
    equal(res, join(TEMP, 'test.txt'))
    const s = await lstat(res)
    ok(s.isFile())
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
    const j = join(realpathSync(tmpdir()), n)
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