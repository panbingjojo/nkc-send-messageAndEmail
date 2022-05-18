import {Context, ServiceSchema} from "moleculer";

export default <ServiceSchema>{
  name: 'message',
  version: 1,
  actions: {
    sendMessage: {
      params: {

      },
    }
  }
}
