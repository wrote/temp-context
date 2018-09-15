import { createWriteStream } from 'fs'

/**
 * Writes given data to a hidden file.
 * @param {string} data Data to write.
 */
const program = (data) => {
  const rs = createWriteStream('.test')
  rs.end(`hello world: ${data}`)
}

export default program