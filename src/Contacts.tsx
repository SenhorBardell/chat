import React, {useState} from 'react'
import {View, Text, FlatList, TouchableOpacity, Button} from 'react-native'
import SearchBar from './SearchBar'
import styles from './styles'
import {User, useStore} from './store'
import {usePubNub} from "pubnub-react";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {StackParamList} from "./Navigator";

const ListItem = ({item, onPress}) => {
    return <TouchableOpacity onPress={onPress} style={styles.listView}>
        <View style={{flexDirection: 'row'}}>
            <View style={styles.circle} />
            <View style={{ flexDirection: 'column' }}>
                <Text>{item.name}</Text>
            </View>
        </View>
    </TouchableOpacity>
}

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
        dispatch({ channels: {...state.channels, [channel]: {name: item.name, description: `One to one chat with ${item.name} `} } })
        navigation.goBack()
    }

    return <View>
        <SearchBar value={search} onChange={setSearch} />
        <Button title="New Group" onPress={() => navigation.navigate('CreateGroup')} />
        <Button title="New Contact" onPress={() => {
            console.log('attempt to create new contact')
        }} />
        <FlatList
            data={data}
            renderItem={({ item }) => <ListItem item={item} onPress={() => createChat(item)} />}
            keyExtractor={({ _id }) => `${_id}`}
        />
    </View>
}