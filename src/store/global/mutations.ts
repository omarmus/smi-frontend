import { MutationTree } from 'vuex'
import { GlobalStateInterface } from './state'

const mutation: MutationTree<GlobalStateInterface> = {
  setInitial (state, initial: boolean) {
    state.initial = initial
  },
  setOpen (state, open: boolean) {
    state.open = open
  }
}

export default mutation
