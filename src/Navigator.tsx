import React from 'react'
import {View, Text, Button, Platform} from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Chat from './Chat'
import Chats from './Chats'
import CreateGroup from './CreateGroup'
import Contacts from './Contacts'
import ChatDetails from './ChatDetails'
import {Channel} from './store'

type StackParamList = {
  Chats: undefined
  Chat: { item: Channel }
  ChatDetails: { item: Channel }
  Contacts: undefined
}

const Stack = createNativeStackNavigator<StackParamList>()

export default () => {
  return <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Chats" component={Chats} options={({ navigation }) => ({ 
        headerRight: () =>
          <View style={{paddingRight: Platform.OS === 'web' ? 16 : 0}}>
            <Button onPress={() => navigation.navigate('Contacts')} title="Create" />
          </View> })} />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={({navigation, route}) => ({
          title: route.params.item.name,
          headerRight: () =>
            <View style={{paddingRight: Platform.OS === 'web' ? 16 : 0}}>
              <Button
                onPress={() => navigation.navigate('ChatDetails', { item: route.params.item })}
                title="Details" />
            </View>
        })} />
      <Stack.Screen
        name="ChatDetails"
        component={ChatDetails}
        options={({route}) => ({
          title: `${route.params.item.name} Details`
        })}/>
      <Stack.Screen name="Contacts" component={Contacts} options={{ title: 'Create'  }} />
    </Stack.Navigator>
  </NavigationContainer>
}
