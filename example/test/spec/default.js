import { join } from 'path'
import TempContext from '../../../src'
import { ok, equal } from 'zoroaster/assert'
import Context from '../context'
import program from '../../src'

/** @type {Object.<string, (c:Context, tc: TempContext)>} */
const T = {
  context: [Context, TempContext],
  async 'writes data to a file'(
    { DATA }, { TEMP, exists, read },
  ) {
    await program(TEMP, DATA)
    const j = join(TEMP, '.test')
    const e = await exists(j)
    ok(e)
    const res = await read(j)
    equal(res, `hello world: ${DATA}`)
  },
}

export default T