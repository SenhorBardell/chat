import React, {useEffect, useState} from 'react'
import {Channel, useStore} from './store'
import {Alert, FlatList, View} from 'react-native'
import {usePubNub} from 'pubnub-react'
import {ChatListItem} from './ChatListItem'

const Separator = () => <View style={{borderBottomWidth: 1, borderBottomColor: 'grey'}} />

export default ({ navigation }) => {
  const pubnub = usePubNub()
  const { state, dispatch } = useStore()
  const [loading, setLoading] = useState(true)

  const fetchChannels = async () => {
    setLoading(true)
    const res1 = await pubnub.channelGroups.listChannels({ channelGroup: state.user._id })
    const channels = res1.channels.reduce((acc, channel) => {
      return { [channel]: {name: '', description: ''}, ...acc }
    }, {})
    dispatch({ channels })
    console.log('channel group channels', res1)
    const res2 = await pubnub.objects.getAllChannelMetadata()
    console.log('get all channel metadata', res2)

    res2.data.forEach(({id, name, description}) => {
        channels[id] = { name, description }
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

  const deleteChannel = async (item: Channel & {id: string}) => {
    if (item.id === state.user._id) {
      return console.log('cannot delete notes channel')
    }
    const channel = item.id
    const members = await pubnub.objects.getChannelMembers({ channel })
    console.log('getting members from channel', members.data)
    const removeChannelMembersRes = await pubnub.objects.removeChannelMembers({ channel, uuids: members.data.map(member => member.uuid.id) })
    console.log('removing members from channel', removeChannelMembersRes)
    const removeChannelMetadataRes = await pubnub.objects.removeChannelMetadata({ channel })
    console.log('removing channel metadata', removeChannelMembersRes)
    const deleteMessagesRes = await pubnub.deleteMessages({ channel })
    console.log('removing channel messages', deleteMessagesRes)
    const removeChannelRes = await pubnub.channelGroups.removeChannels({ channels: [channel], channelGroup: state.user._id })
    console.log('remove channel from channel group', removeChannelRes)
    const channels = {...state.channels}
    delete channels[channel]
    dispatch({ channels })
  }

  useEffect(() => {
    if (!dispatch) return

    const bootstrap = async () => {
      await fetchChannels()
    }

    bootstrap()

  }, [dispatch])

  const channels = Object.entries(state.channels).map(([id, { name, description }]) => ({id, name, description}))

  return <FlatList
      refreshing={loading}
      onRefresh={fetchChannels}
      data={channels}
      ItemSeparatorComponent={Separator}
      renderItem={({ item }) => <ChatListItem
        item={item}
        onPress={() => navigation.navigate('Chat', { item })}
        onDelete={() => deleteChannel(item)}
      />}
      keyExtractor={(item) => item.id}
  />
}
