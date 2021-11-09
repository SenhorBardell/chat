import React, {useLayoutEffect, useState} from 'react'
import {View, Text, FlatList, TouchableOpacity, Button} from 'react-native'
import {User, useStore} from './store'
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {StackParamList} from "./Navigator";
import {ListViewStyle, NavigationStyle} from "./styles";
import Circle from "./components/Circle";
import RadioToggle from "./components/RadioToggle";

const ListViewItem = ({item, selectedItems, onPress}: {
  item: User,
  selectedItems: string[],
  onPress: () => void
}) => {
  const letter = (item.name ? item.name[0] : '').toUpperCase()
  return <TouchableOpacity onPress={onPress} style={ListViewStyle.container}>
    <View style={{flexDirection: 'row'}}>
      <RadioToggle checked={new Set(selectedItems).has(item._id)} />
      <Circle letter={letter} />
      <View style={{flexDirection: 'column'}}>
        <Text>{item.name}</Text>
        <Text>last seen</Text>
      </View>
    </View>
  </TouchableOpacity>
}

export default ({navigation}: {navigation: NativeStackNavigationProp<StackParamList, 'CreateGroup'>}) => {
  const {state, dispatch} = useStore()
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        <View style={NavigationStyle.headerRight}>
          <Button onPress={() => navigation.navigate('CreateGroupDetails', {members: selectedContacts})} title="Next" />
        </View>
    })
  }, [navigation])

  return <View>
    <View style={{paddingVertical: 4, paddingHorizontal: 4}}>
      <Text>{promptText}</Text>
    </View>
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