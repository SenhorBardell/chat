import React, {useState} from 'react'
import {View} from 'react-native'
import SearchBar from './SearchBar'
import {ChannelType, User, useStore} from './store'
import {usePubNub} from 'pubnub-react'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {StackParamList} from './Navigator'
import {InlineButton} from './components/Button'
import ContactList from './ContactList'

export default ({ navigation }: { navigation: NativeStackNavigationProp<StackParamList, 'Contacts'>}) => {
    const pubnub = usePubNub()
    const { state, dispatch } = useStore()
    const [search, setSearch] = useState('')

    const data = search ? state.contacts.filter(item => item.name.includes(search)) : state.contacts

    const createChat = async (item: User) => {
        console.log('creating new chat with', item)
        const channel = `${state.user._id}-${item._id}`
        const res1 = await pubnub.objects.setChannelMetadata({
            channel,
            data: { name: item.name, description: `One to one chat with ${item.name}` }
        })
        console.log('setting new channel metadata', res1)
        const res2 = await pubnub.objects.setChannelMembers({ channel, uuids: [{id: state.user._id}, {id: `${item._id}`}] })
        console.log('setting channel members', res2)
        const res3 = await pubnub.channelGroups.addChannels({
            channels: [channel],
            channelGroup: state.user._id
        })
        console.log('adding channel to channel groups', res3)
        dispatch({ channels: {...state.channels,
                [channel]: {
                    id: channel,
                    name: item.name,
                    custom: { type: ChannelType.Direct } }
            }})
        navigation.replace('Chat', { item: { id: channel, name: item.name, custom: {type: ChannelType.Direct}} })
    }

    return <View>
        <SearchBar value={search} onChange={setSearch} />
        <InlineButton title="New Group" onPress={() => navigation.navigate('CreateGroup')} />
        <InlineButton title="New Contact" onPress={() => {
            console.log('attempt to create new contact')
        }} />
        <ContactList data={data} onPress={(item) => createChat(item)} />
    </View>
}