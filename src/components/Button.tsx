import React from 'react'
import {Text, View, TouchableOpacity} from 'react-native'

export const InlineButton = ({title, onPress}: {title: string, onPress: () => void}) => {
  return <TouchableOpacity onPress={onPress} style={{paddingHorizontal: 8, paddingVertical: 8}}>
    <Text style={{fontSize: 16}}>{title}</Text>
  </TouchableOpacity>
}