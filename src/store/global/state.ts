export interface GlobalStateInterface {
  initial: boolean,
  open: boolean
}

function state (): GlobalStateInterface {
  return {
    initial: false,
    open: false
  }
}

export default state
