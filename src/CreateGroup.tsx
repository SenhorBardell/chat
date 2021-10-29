import React, {useEffect, useState} from 'react'
import {View, Text, FlatList, TouchableOpacity, Button} from 'react-native'
import {User, useStore} from './store'
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {StackParamList} from "./Navigator";
import {usePubNub} from "pubnub-react";

const ListViewItem = ({item, selectedItems, onPress}: {item: User, selectedItems: string[], onPress: () => void}) =>
  <TouchableOpacity onPress={onPress}>
    <Text>{new Set(selectedItems).has(item._id) ? 'Selected' : 'Not selected'}</Text>
  <Text>{item.name}</Text>
</TouchableOpacity>

export default ({navigation}: {navigation: NativeStackNavigationProp<StackParamList, 'CreateGroup'>}) => {
  const {state, dispatch} = useStore()
  const pubnub = usePubNub()
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])

  const toggleContact = (item: User) => {
    console.log('toggle contact', item, selectedContacts)
    const newSelectedContacts = new Set(selectedContacts)
    if (newSelectedContacts.has(item._id)) {
      console.log('removing')
      newSelectedContacts.delete(item._id)
    } else {
      console.log('adding')
      newSelectedContacts.add(item._id)
    }
    setSelectedContacts([...newSelectedContacts])
  }

  const promptText = !selectedContacts.length ?
    'Who would you like to add?' :
    selectedContacts.map(_id => state.contacts.find(c => c._id === _id)).map(c => c.name).join(', ')

  useEffect(() => {
    if (selectedContacts.length) {
      navigation.setOptions({
        headerRight: () =>
          <Button onPress={() => navigation.navigate('CreateGroupDetails', {members: selectedContacts})} title="Next" />
      })
    } else {
      navigation.setOptions({ headerRight: null })
    }
  }, [selectedContacts.length])

  return <View>
    <Text>{promptText}</Text>
    <FlatList
      extraData={selectedContacts}
      data={state.contacts}
      renderItem={({item}) =>
      <ListViewItem
        item={item}
        onPress={() => toggleContact(item)}
        selectedItems={selectedContacts}
      />}
    />
  </View>
}