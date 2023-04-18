import addChannel from './addChannel';
import removeChannel from './removeChannel';
import renameChannel from './renameChannel';

const selector = {
    add: addChannel,
    remove: removeChannel,
    rename: renameChannel,
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (selectedOption) => selector[selectedOption];