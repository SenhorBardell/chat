import React, {useLayoutEffect, useState} from 'react'
import {Button, TextInput, View} from 'react-native'
import styles, {ListViewStyle, NavigationStyle} from './styles'
import {RouteProp} from "@react-navigation/native";
import {StackParamList} from "./Navigator";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {usePubNub} from "pubnub-react";
import {useStore} from "./store";

export default ({navigation, route}: {
  route: RouteProp<StackParamList, 'EditChannelDetails'>,
  navigation: NativeStackNavigationProp<StackParamList, 'EditChannelDetails'>
}) => {
  const {state, dispatch} = useStore()
  const pubnub = usePubNub()
  const [name, setName] = useState(route.params.item.name)

  const submit = async () => {
    const res = await pubnub.objects.setChannelMetadata({
      channel: route.params.item.id,
      data: {name}
    })
    console.log('updating channel name', name, res)
    const channel = state.channels[route.params.item.id]
    dispatch({channels: {...state.channels, [route.params.item.id]: {...channel, name}}})
    navigation.goBack()
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <View style={NavigationStyle.headerRight}>
        <Button title="Done" onPress={submit}/>
      </View>
    })
  }, [navigation, name])

  return <View>
    <View style={styles.section}>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={ListViewStyle.subtitle}/>
    </View>
  </View>
}
