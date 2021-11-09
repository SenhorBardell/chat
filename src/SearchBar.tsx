import React, {useRef} from 'react'
import { View, TextInput, TouchableOpacity } from 'react-native'

export default ({value, onChange}) => {
  const textRef = useRef()
  return <View style={{
    padding: 8,
    margin: 4,
    backgroundColor: 'grey',
    borderRadius: 4,
  }}>
    <TextInput
      ref={textRef}
      onChangeText={onChange}
      value={value}
      placeholder="🔍 Search"
      style={{
        color: 'white',
        textAlign: 'center',
        fontSize: 16
      }}
    />
  </View>
}