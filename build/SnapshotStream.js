const { Transform } = require('stream');

               class SnapshotStream extends Transform {
  set currentFile(f) {
    this._currentFile = f
  }
  get currentFile() {
    return this._currentFile
  }
  _transform(chunk, encoding, next) {
    if (this.hasPushed && this.lastPushed != this.currentFile) {
      this.push('\n\n')
    }
    if (this.lastPushed != this.currentFile) {
      this.push(`# ${this.currentFile}`)
    }
    if (!this.hasPushed) { // first file
      this.push('\n\n')
    }
    this.hasPushed = true
    this.push(chunk)
    this.lastPushed = this.currentFile
    next()
  }
}

module.exports = SnapshotStream
//# sourceMappingURL=SnapshotStream.js.map