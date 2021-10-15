import create from 'zustand'

export const uuid = '0'

export const user = {
  _id: uuid,
  name: 'Vlad Rimsha',
  avatar: 'https://ca.slack-edge.com/T2R0TP3DM-UDU3PDY81-25eda549c0b1-512',
}


export const useStore = create(setState => ({
  state: {},
  dispatch: newState => 
    setState(oldState => ({state: {...oldState.state, ...newState}}))
}))