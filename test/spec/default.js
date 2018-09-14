import { equal, ok } from 'zoroaster/assert'
import makePromise from 'makepromise'
import { lstat } from 'fs'
import TempContext from '../../src'
import Context from '../context'

/** @type {Object.<string, (tc: TempContext)>} */
const T = {
  context: [TempContext],
  'is a function'() {
    equal(typeof TempContext, 'function')
  },
  async 'creates a temp directory'({ TEMP }) {
    const s = await makePromise(lstat, TEMP)
    ok(s.isDirectory())
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
}

export { manual }

export default T