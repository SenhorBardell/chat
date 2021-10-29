import React, {useLayoutEffect, useRef, useState} from 'react'
import {View, Text, TextInput, Button} from 'react-native'
import {StackParamList} from './Navigator'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {useStore} from './store'
import {usePubNub} from "pubnub-react";
import {RouteProp} from "@react-navigation/native";

export default ({navigation, route}: {
  navigation: NativeStackNavigationProp<StackParamList, 'CreateGroupDetails'>,
  route: RouteProp<StackParamList, 'CreateGroupDetails'>
}) => {
  const pubnub = usePubNub()
  const {state, dispatch} = useStore()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const nameInput = useRef<TextInput>(null)
  const descriptionInput = useRef<TextInput>(null)

  const createGroup = async () => {
    if (loading) return
    if (!name.length) return nameInput.current.focus()
    if (!description.length) return descriptionInput.current.focus()

    const channel = `${state.user._id}-${name}`
    const res1 = await pubnub.objects.setChannelMetadata({
      channel,
      data: {name, description}
    })
    console.log('setting new channel metadata', res1)
    const res2 = await pubnub.objects.setChannelMembers({
      channel,
      uuids: route.params.members.map(id => ({id}))
    })
    console.log('setting channel members', res2)
    const res3 = await pubnub.channelGroups.addChannels({
      channels: [channel],
      channelGroup: state.user._id
    })
    console.log('adding channel to channel groups', res3)
    dispatch({channels: {...state.channels, [channel]: {name, description}}})
    setLoading(false)
    navigation.replace('Chats')
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Button onPress={createGroup} title="Create" />
    })
  }, [navigation, name, description])

  return <View>
    <TextInput
      value={name}
      onChangeText={setName}
      placeholder="Group Name"
      ref={nameInput} />
    <TextInput
      value={description}
      onChangeText={setDescription}
      placeholder="Group Description"
      ref={descriptionInput} />
  </View>
}