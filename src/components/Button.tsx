import React from 'react'
import {Text, View, TouchableOpacity} from 'react-native'

export default ({ title, onPress }: { title: string, onPress: () => void }) => {
  return <TouchableOpacity onPress={onPress}>
    <Text>{title}</Text>
  </TouchableOpacity>
}

export const InlineButton = ({title, onPress}: {title: string, onPress: () => void}) => {
  return <TouchableOpacity onPress={onPress} style={{paddingHorizontal: 8, paddingVertical: 8}}>
    <Text style={{fontSize: 16}}>{title}</Text>
  </TouchableOpacity>
}