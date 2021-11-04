import React from 'react'
import {Text, TouchableOpacity, View } from 'react-native'
import {Channel} from './store'
import {ListViewStyle} from './styles'
import Circle from "./components/Circle";

export const ChatListItem = (
  { item, index, length, onPress }:
    { item: Channel, index: number, length: number, onPress: () => void }) => {
  const letter = (item.name ? item.name[0] : '').toUpperCase()

  return <TouchableOpacity onPress={onPress}>
      <View style={ListViewStyle.container}>
        <View style={{flexDirection: 'row'}}>
          <Circle letter={letter} />
          <View style={[{flexDirection: 'column'}, index !== length-1 ? ListViewStyle.separator : {}]}>
            <Text style={ListViewStyle.title}>{item.name}</Text>
            <Text style={ListViewStyle.subtitle} numberOfLines={2}>{item.description}</Text>
          </View>
        </View>
      </View>
  </TouchableOpacity>
}