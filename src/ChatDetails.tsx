import React from 'react'
import {View, Text, Button} from 'react-native'
import {RouteProp} from '@react-navigation/native'
import {StackParamList} from './Navigator'
import {usePubNub} from "pubnub-react";
import { ChannelType, useStore} from "./store";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

export default ({ route, navigation }: {
  route: RouteProp<StackParamList, 'ChatDetails'>,
  navigation: NativeStackNavigationProp<StackParamList, 'ChatDetails'>}) => {

  const item = route.params.item

  if (item.custom.type === ChannelType.Group) return <GroupChatDetails
    route={route}
    navigation={navigation} />
  if (item.custom.type === ChannelType.Direct) return <DirectChatDetails
    route={route}
    navigation={navigation} />
}

const DirectChatDetails = ({ route, navigation }: {
  route: RouteProp<StackParamList, 'ChatDetails'>,
  navigation: NativeStackNavigationProp<StackParamList, 'ChatDetails'>}) => {
  return <View style={{padding: 8}}>
    <Button title="Block User" onPress={() => {
      console.log('block user')
    }} />
  </View>

}

const GroupChatDetails = ({ route, navigation }: {
  route: RouteProp<StackParamList, 'ChatDetails'>,
  navigation: NativeStackNavigationProp<StackParamList, 'ChatDetails'>}) => {
  const pubnub = usePubNub()
  const {state, dispatch} = useStore()
  const item = route.params.item

  const deleteChannel = async () => {
    if (item.id === state.user._id) {
      return console.log('cannot delete notes channel')
    }
    const channel = item.id
    const members = await pubnub.objects.getChannelMembers({ channel })
    console.log('getting members from channel', members.data)
    const removeChannelMembersRes = await pubnub.objects.removeChannelMembers({ channel, uuids: members.data.map(member => member.uuid.id) })
    console.log('removing members from channel', removeChannelMembersRes)
    const removeChannelMetadataRes = await pubnub.objects.removeChannelMetadata({ channel })
    console.log('removing channel metadata', removeChannelMetadataRes)
    const deleteMessagesRes = await pubnub.deleteMessages({ channel })
    console.log('removing channel messages', deleteMessagesRes)
    const removeChannelRes = await pubnub.channelGroups.removeChannels({ channels: [channel], channelGroup: state.user._id })
    console.log('remove channel from channel group', removeChannelRes)
    const channels = {...state.channels}
    delete channels[channel]
    dispatch({ channels })
    navigation.replace('Chats')
  }

  const addMembers = () => {
    navigation.navigate('CreateGroup')
  }

  return <View style={{padding: 8}}>
    <Button title="Add members" onPress={addMembers} />
    <Button title={"Leave group"} onPress={deleteChannel} />
  </View>
}
