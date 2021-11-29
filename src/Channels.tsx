import React, {useEffect, useLayoutEffect, useState} from 'react'
import {useStore} from './store'
import {ActivityIndicator, FlatList, Text} from 'react-native'
import {usePubNub} from 'pubnub-react'
import {ChannelListItem} from './ChannelListItem'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {StackParamList} from './Navigator'
import {ChatStyle, NavigationStyle} from './styles'
import {fetchChannels} from "./model";

export default ({navigation}: { navigation: NativeStackNavigationProp<StackParamList, 'Chats'> }) => {
  const pubnub = usePubNub()
  const {state, dispatch} = useStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!dispatch) return

    const bootstrap = async () => {
      setLoading(true)
      console.log('current user', state.user._id)
      const channels = await fetchChannels(pubnub, state.user._id)
      dispatch({ channels })
      setLoading(false)
    }

    bootstrap()

  }, [dispatch])

  useLayoutEffect(() => {
    if (loading) {
      navigation.setOptions({ headerTitle: () => <ActivityIndicator /> })
    } else {
      navigation.setOptions({ headerTitle: () => <Text style={NavigationStyle.title}>Chats</Text>})
    }
  }, [loading])

  const channels = Object.entries(state.channels).map(([id, rest]) => ({id, ...rest}))

  return <FlatList
      refreshing={loading}
      onRefresh={async () => {
        setLoading(true)
        const channels = await fetchChannels(pubnub, state.user._id)
        dispatch({ channels })
        setLoading(false)
      }}
      data={channels}
      contentContainerStyle={ChatStyle.container}
      renderItem={({ item, index}) =>
        <ChannelListItem
          key={item.id}
          index={index}
          length={channels.length}
          item={item}
          onPress={() => navigation.navigate('Chat', {item})}
        />}
      keyExtractor={(item) => item.id}
  />
}
