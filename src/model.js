export default (state, dispatch) => ({
  message: message => {
    // channel, subscription, timetoken, message, publisher
    console.log('new message arrived', message)
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