import React, {useEffect, useState} from 'react'
import {ChannelType, useStore} from './store'
import {Alert, FlatList } from 'react-native'
import {usePubNub} from 'pubnub-react'
import {ChatListItem} from './ChatListItem'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {StackParamList} from './Navigator'
import {ChatStyle } from './styles'

export default ({ navigation }: {navigation: NativeStackNavigationProp<StackParamList, 'Chats'>}) => {
  const pubnub = usePubNub()
  const { state, dispatch } = useStore()
  const [loading, setLoading] = useState(true)

  const fetchChannels = async () => {
    setLoading(true)
    const res1 = await pubnub.channelGroups.listChannels({ channelGroup: state.user._id })
    const channels = res1.channels.reduce((acc, channel) => {
      return { [channel]: {name: '', description: '', custom: {type: ChannelType.Group}}, ...acc }
    }, {})
    dispatch({ channels })
    console.log('channel group channels', res1)
    const res2 = await pubnub.objects.getAllChannelMetadata()
    console.log('get all channel metadata', res2)

    res2.data.forEach(({id, name, description, custom}) => {
      channels[id] = { name, description, custom: {...channels[id]?.custom, ...custom} }
    })

    console.log('dispatching initial channels', channels)
    dispatch({ channels })

    if (res2.status !== 200) {
      return Alert.alert(`${res2}`)
    }

    console.log('dispatching channels with metadata', channels)
    dispatch({ channels })
    setLoading(false)
  }


  useEffect(() => {
    if (!dispatch) return

    const bootstrap = async () => {
      await fetchChannels()
    }

    bootstrap()

  }, [dispatch])

  const channels = Object.entries(state.channels).map(([id, rest]) => ({id, ...rest}))

  return <FlatList
      refreshing={loading}
      onRefresh={fetchChannels}
      data={channels}
      contentContainerStyle={ChatStyle.container}
      renderItem={({ item, index}) =>
        <ChatListItem
          key={item.id}
          index={index}
          length={channels.length}
          item={item}
          onPress={() => navigation.navigate('Chat', {item})}
        />}
      keyExtractor={(item) => item.id}
  />
}
