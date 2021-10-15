import React from 'react'
import {user, useStore} from './store'
import { GiftedChat, Actions } from "react-native-gifted-chat"
import { usePubNub } from 'pubnub-react'

export default ({route}) => {
  const client = usePubNub()
  const {state} = useStore()
  const {item} = route.params
  const messages = state.messages[item.id] || []
  
  const pickImage = () => {

  }
  const onSend = async (messages) => {
    console.log('input', messages)
    const res = await Promise.all(messages.map(message => client.publish({channel: item.id, message})))
    console.log('sending message', res)
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