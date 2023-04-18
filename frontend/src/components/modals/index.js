import addChannel from './addChannel';
import removeChannel from './removeChannel';
import renameChannel from './renameChannel';

const selector = {
  add: addChannel,
  remove: removeChannel,
  rename: renameChannel,
};

export default (selectedOption) => selector[selectedOption];
