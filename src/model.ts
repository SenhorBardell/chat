import Pubnub from "pubnub";
import {ChannelType} from "./store";

export default (state, dispatch) => ({
  message: payload => {
    // channel, subscription, timetoken, message, publisher
    console.log('new message arrived', payload, state)
    const channelMessages = state.messages[payload.channel] || []
    state.messages[payload.channel] = [...channelMessages, payload.message]
    dispatch({messages: state.messages})
  },
  presence: event => {
    // action, channel, occupancy, state
    console.log('new presence event arrived', event)
  },
  signal: signal => {
    // channel, subscription, timetoken, publisher, event, type, data
    console.log('new signal arrived', signal)
  },
  objects: objectEvent => {
    // channel, subscription, timetoken, publisher, event, type, data
    console.log('new object event arrived', objectEvent)
  },
  messageAction: messageAction => {
    // channel, publisher, event, data.type, data.value, data.messageToken, data.actionToken
    console.log('new message action arrived', messageAction)
  },
  status: status => {
    // affectedChannelGroups, affectedChannels, category, operation, lastTimeToken, currentTimeToken, subscribedChannels
    console.log('new status arrived', status)
    // switch (status.category) {
    //   case 'PNConnectedCategory':
    //     if (status.operation === 'PNSubscribeOperation') {
    //       return dispatch({channels: status.subscribedChannels})  
    //     }
    // }
    dispatch({ status })
  }
})

export const fetchChannels = async (pubnub: Pubnub, channelGroup) => {
  const res = await pubnub.channelGroups.listChannels({ channelGroup })
  const channels = res.channels.reduce((acc, channel) =>
    ({[channel]: {name: '', custom: {type: ChannelType.Group}}, ...acc}), {})
  try {
    const metadata = await pubnub.objects.getAllChannelMetadata({
      filter: res.channels.map(channel => `id == "${channel}"`).join('||')})
    metadata.data.forEach(({ id, name, custom }) => {
      channels[id] = { name, custom: {...channels[id]?.custom, ...custom} }
    })
  } catch (error) {
    console.log('failed to fetch metadata', error)
  }
  return channels
}
