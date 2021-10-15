import React, { useState, useEffect } from 'react'
import { useStore, uuid } from './store'
import { FlatList, RefreshControl, Alert, View, TouchableOpacity, Text } from 'react-native'
import { usePubNub } from 'pubnub-react'

const ChatListItem = ({ item, onPress }) => {
  return <TouchableOpacity
    style={{ padding: 8, backgroundColor: '#eee', borderBottomColor: 'white', borderBottomWidth: 1 }}
    onPress={onPress}>
      <View style={{paddingBottom: 8}}>
    <Text>{item.name}</Text>
    </View>
    <Text>{item.description}</Text>
  </TouchableOpacity>
}

export default ({ navigation }) => {
  const pubnub = usePubNub()
  const { state, dispatch } = useStore()
  const [loading, setLoading] = useState(true)

  const fetchChannels = async () => {
    setLoading(true)
    // todo error handling and pagination
    const res = await pubnub.objects.getAllChannelMetadata()

    if (res.status !== 200) {
      return Alert.alert(`${res}`)
    }
    dispatch({ channels: res.data })
    setLoading(false)
  }

  useEffect(() => {
    if (!dispatch) return

    const bootstrap = async () => {
      await fetchChannels()
    }

    bootstrap()

  }, [dispatch])

  return <FlatList
  refreshing={loading}
  onRefresh={fetchChannels}
    data={state.channels}
    renderItem={({ item }) => <ChatListItem item={item} onPress={() => {
      navigation.navigate('Chat', {item})
    }} />}
    keyExtractor={(item, index) => item.id}
  />
}