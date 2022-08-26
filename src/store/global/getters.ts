import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { GlobalStateInterface } from './state'

const getters: GetterTree<GlobalStateInterface, StateInterface> = {
  someAction (/* context */) {
    // your code
  }
}

export default getters
