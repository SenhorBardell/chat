import React from 'react'
import { View, Text, Button } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Chat from './Chat'
import Chats from './Chats'
import CreateGroup from './CreateGroup'
import Contacts from './Contacts'

const Stack = createNativeStackNavigator()

export default () => {
  return <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Chats" component={Chats} options={({ navigation }) => ({ headerRight: () => <Button onPress={() => navigation.navigate('Contacts')} title="Create" /> })} />
      <Stack.Screen name="Chat" component={Chat} options={({route}) => ({title: route.params.item.name})} />
      <Stack.Screen name="Contacts" component={Contacts} options={{ presentation: 'modal',  }} />
    </Stack.Navigator>
  </NavigationContainer>
}