import { equal, ok } from 'zoroaster/assert'
import makePromise from 'makepromise'
import { lstat } from 'fs'
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
  async 'writes a file'({ TEMP, write, readInTemp }) {
    const p = 'data.temp'
    const d = 'hello-world'
    const pp = await write(d, p)
    equal(pp, join(TEMP, p))
    const s = await makePromise(lstat, join(TEMP, p))
    ok(s.isFile())
    const r = await readInTemp(p)
    equal(r, d)
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
  static: {
    async 'can statically set a specific temp'({ exists }) {
      const p = 'test/temp2'
      TempContext.setTemp(p)
      const tc = new TempContext()
      const e = await exists(p)
      ok(!e, 'Temp dir is not supposed to exists.')
      await tc._init()
      const e2 = await exists(p)
      ok(e2, 'Temp dir should have been created after the init.')
      await tc._destroy()
      const e3 = await exists(p)
      ok(!e3, 'Temp dir should have been removed after the destroy')
    },
    _after() {
      TempContext.setTemp('test/temp')
    },
  },
}

export { manual }

export default T