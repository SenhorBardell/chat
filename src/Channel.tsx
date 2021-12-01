import React, {useLayoutEffect} from 'react'
import {user, useStore} from './store'
import {Actions, GiftedChat} from 'react-native-gifted-chat'
import {usePubNub} from 'pubnub-react'
import {RouteProp} from '@react-navigation/native';
import {StackParamList} from './Navigator';
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

export default ({route, navigation}: {
  route: RouteProp<StackParamList, 'Channel'>,
  navigation: NativeStackNavigationProp<StackParamList, 'Channel'>
}) => {
  const client = usePubNub()
  const {state, dispatch} = useStore()
  const {item} = route.params
  const messages = state.messages[item.id] || []
  const channel = state.channels[route.params.item.id]

  useLayoutEffect(() => {
    navigation.setOptions({
      title: channel.name
    })
  }, [navigation, channel])

  const pickImage = () => {

  }

  const onSend = async (messages) => {
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
