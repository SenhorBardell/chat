import React, {useLayoutEffect, useRef, useState} from 'react'
import {View, Text, TextInput, Button, StyleSheet} from 'react-native'
import {StackParamList} from './Navigator'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {ChannelType, User, useStore} from './store'
import {usePubNub} from 'pubnub-react'
import {RouteProp} from '@react-navigation/native'
import styles, {ListViewStyle, NavigationStyle} from './styles'
import Circle from "./components/Circle";

const localStyles = StyleSheet.create({
  section: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginVertical: 8,
    marginHorizontal: 8,
    backgroundColor: 'white',
    borderRadius: 6
  }
})

const AddedMember = ({member}:{member: User}) => <View style={ListViewStyle.container}>
  <Text style={ListViewStyle.title}>{member.name}</Text>
  <Text style={ListViewStyle.subtitle}>last seen recently</Text>
</View>

export default ({navigation, route}: {
  navigation: NativeStackNavigationProp<StackParamList, 'CreateGroupDetails'>,
  route: RouteProp<StackParamList, 'CreateGroupDetails'>
}) => {
  const pubnub = usePubNub()
  const {state, dispatch} = useStore()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const nameInput = useRef<TextInput>(null)

  const createGroup = async () => {
    if (loading) return
    if (!name.length) return nameInput.current.focus()

    const channel = `${state.user._id}-${name}`
    const res1 = await pubnub.objects.setChannelMetadata({
      channel,
      data: {name, custom: {type: ChannelType.Group}}
    })
    console.log('setting new channel metadata', res1)
    const res2 = await pubnub.objects.setChannelMembers({
      channel,
      uuids: route.params.members.map(user => ({id: user._id}))
    })
    console.log('setting channel members', res2)
    const res3 = await pubnub.channelGroups.addChannels({
      channels: [channel],
      channelGroup: state.user._id
    })
    console.log('adding channel to channel groups', res3)
    dispatch({channels: {
        ...state.channels,
        [channel]: {id: channel, name, custom: {type: ChannelType.Group}}}
    })
    setLoading(false)
    navigation.replace('Chats')
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <View style={NavigationStyle.headerRight}>
        <Button onPress={createGroup} title="Create" />
      </View>
    })
  }, [navigation, name ])

  return <View>
    <View style={[{flexDirection: 'row'}, localStyles.section]}>
      <Circle letter="" />
      <TextInput
        style={{
          paddingLeft: 16
        }}
        value={name}
        onChangeText={setName}
        placeholder="Group Name"
        ref={nameInput} />
    </View>
    <View style={localStyles.section}>
      {route.params.members.map((member, i, all) => <View key={member._id}>
        <AddedMember member={member} />
        {i !== all.length - 1 && <View style={ListViewStyle.separator} />}
      </View>)}
    </View>
  </View>
}