import { join } from 'path'
import { createWriteStream } from 'fs'

/**
 * Writes given data to a hidden file.
 * @param {string} path Path to the directory where to create a file.
 * @param {string} data Data to write.
 */
const program = (path, data) => {
  const j = join(path, '.test')
  const rs = createWriteStream(j)
  rs.end(`hello world: ${data}`)
}

export default program