import {ServiceSchema} from 'moleculer';
import sendEmail from './actions/send/email';
import sendMessage from './actions/send/message';
import getSetting from './actions/setting/getSetting';
import setSetting from './actions/setting/setSetting';

export default <ServiceSchema>{
  name: 'sendMessage',
  version: 1,
  settings: {
    port: 20395,
    host: '127.0.0.1',
  },
  actions: {
    sendEmail,
    sendMessage,

    getSetting,
    setSetting,

    // checkCode,
  },
};
