import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const Checked = () => <Ionicons name="radio-button-on-outline" size={45} color="#333" />
const Unchecked = () => <Ionicons name="radio-button-off-outline" size={45} color="#333" />

export default ({checked}: {checked: boolean}) => {
  const Icon = checked ? Checked : Unchecked
  return <View><Icon /></View>
}