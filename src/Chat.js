import React from 'react'
import {user, useStore} from './store'
import { GiftedChat, Actions } from "react-native-gifted-chat"

export default ({route}) => {
  const {state} = useStore()
  const {item} = route.params
  const messages = ((state.chats || {})[item.id] || {}).messages || []
  
  const pickImage = () => {

  }
  const onSend = () => {

  }

  return <GiftedChat
    isLoadingEarlier={true}
    messages={messages}
    renderUsernameOnMessage={true}
    onSend={onSend}
    renderActions={() => <Actions onPressActionButton={pickImage} />}
    user={user}
  />
}