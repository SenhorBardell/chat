import React, {useRef} from 'react'
import { View, TextInput, TouchableOpacity } from 'react-native'

export default ({value, onChange}) => {
    const textRef = useRef()
    return <View>
        <TextInput ref={textRef} onChangeText={onChange} value={value} />
    </View>
}