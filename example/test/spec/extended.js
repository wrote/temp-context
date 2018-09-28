import { ok, equal } from 'zoroaster/assert'
import MyTempContext from '../context/temp'
import program from '../../src'

/** @type {Object.<string, (tc: MyTempContext)>} */
const T = {
  context: MyTempContext,
  async 'writes data to a file'(
    { TEMP, resolve, exists, read, DATA },
  ) {
    await program(TEMP, DATA)
    const j = resolve('.test')
    const e = await exists(j)
    console.log('Temp file location: %s', j)
    ok(e)
    const res = await read('.test')
    equal(res, `hello world: ${DATA}`)
  },
}

export default T