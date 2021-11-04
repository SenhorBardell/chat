import create from 'zustand'
import {IMessage} from "react-native-gifted-chat";

export const uuid = '0'

export const user = {
  _id: uuid,
  name: 'Vlad Rimsha',
  avatar: 'https://ca.slack-edge.com/T2R0TP3DM-UDU3PDY81-25eda549c0b1-512',
}

export type User = {
  _id: string
  name: string
  avatar: string
}

export enum ChannelType {
  Direct,
  Group
}

export type Channel = {
  id: string
  name: string
  description: string
  custom: {
    type: ChannelType
  }
}

export type Message = IMessage

export type State = {
  channels: {[id: string]: Channel},
  messages: {[id: string]: Message[]},
  contacts: User[],
  user: User
}

export type Store = {
  state: State
  dispatch: (state: Partial<State>) => void
}

export const useStore = create<Store>(setState => ({
  state: {
    channels: {},
    messages: {},
    contacts: [
      { _id: '1', name: 'John', avatar: '' },
      { _id: '2', name: 'Jane', avatar: '' }
    ],
    user
  },
  dispatch: newState => 
    setState((oldState) => ({state: {...oldState.state, ...newState}}))
}))