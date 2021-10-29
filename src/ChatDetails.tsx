import React from 'react'
import {View, Text, Button} from 'react-native'
import {RouteProp} from '@react-navigation/native'
import {StackParamList} from './Navigator'

export default ({ route }: { route: RouteProp<StackParamList, 'ChatDetails'>}) => {
  return <View style={{padding: 8}}>
    <Text>{route.params.item.description}</Text>
  </View>
}