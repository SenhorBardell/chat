import React from 'react'
import {Button, View} from 'react-native'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import Chat from './Channel'
import Chats from './Channels'
import CreateGroup from './CreateChannel'
import CreateGroupDetails from './CreateChannelDetails'
import Contacts from './Contacts'
import ChatDetails from './ChannelDetails'
import AddMember from './AddMember'
import {Channel, User} from './store'
import {NavigationStyle} from './styles'
import {CreateButton} from "./components/IconButton";

export type StackParamList = {
  Chats: undefined
  Chat: { item: Channel }
  ChatDetails: { item: Channel }
  CreateGroup: undefined
  CreateGroupDetails: { members: User[] }
  Contacts: { title?: string }
  AddMember: { item: Channel }
}

const Stack = createNativeStackNavigator<StackParamList>()

export default () => {
  return <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Chats" component={Chats} options={({ navigation }) => ({
        headerTitleStyle: NavigationStyle.title,
        contentStyle: {backgroundColor: 'white'},
        headerRight: () =>
          <View style={NavigationStyle.headerRight}>
            <CreateButton onPress={() => navigation.navigate('Contacts')} />
          </View> })} />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={({navigation, route}) => ({
          title: route.params.item.name,
          headerRight: () =>
            <View style={NavigationStyle.headerRight}>
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
      <Stack.Screen name="Contacts" component={Contacts} options={({route}) => ({ title: route.params?.title ?? 'Create'  })} />
      <Stack.Screen name="CreateGroup" component={CreateGroup} options={{ title: 'New Group'}} />
      <Stack.Screen name="CreateGroupDetails" component={CreateGroupDetails} options={{ title: 'New Group'}} />
      <Stack.Screen name="AddMember" component={AddMember} options={{ title: 'Contacts' }} />
    </Stack.Navigator>
  </NavigationContainer>
}
