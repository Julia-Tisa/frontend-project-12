import { combineReducers } from '@reduxjs/toolkit';

import sliceChannel, { actions as channelsActions } from './sliceChannel';
import sliceMessage, { actions as messagesActions } from './sliceMessage';

const actions = {
  ...channelsActions,
  ...messagesActions,
};

export {
  actions,
};

export default combineReducers({
  channels: sliceChannel,
  messages: sliceMessage,
});