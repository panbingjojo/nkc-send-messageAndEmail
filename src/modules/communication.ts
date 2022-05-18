import {ServiceBroker} from 'moleculer';

export const broker = new ServiceBroker({
  nodeID: `nkc-erp-account_${process.pid.toString()}`,
  transporter: 'TCP',
  registry: {
    strategy: 'Random',
    discoverer: 'Local',
  },
});
