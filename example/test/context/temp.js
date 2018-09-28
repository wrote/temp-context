import TempContext from '../../../src'

export default class MyTempContext extends TempContext {
  constructor() {
    super()
    this._useOSTemp('package-test')
  }
  get DATA() {
    return 'test-data'
  }
}