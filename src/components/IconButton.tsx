import React from 'react'
import {View, TouchableOpacity} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export const CreateButton = ({onPress}: {onPress: () => void}) => 
  <TouchableOpacity onPress={onPress}>
    <Ionicons name="create-outline" size={24} color="black" />
  </TouchableOpacity>