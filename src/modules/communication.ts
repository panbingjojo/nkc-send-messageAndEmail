import {ServiceBroker} from 'moleculer';

export const broker = new ServiceBroker({
  nodeID: `nkc-erp-account_${process.pid.toString()}`,
  transporter: 'TCP',
  registry: {
    strategy: 'Random',
    discoverer: 'Local',
  },
});

export const ServiceActionNames = {
  v1_verification_verify_send_email: 'v1_verification_verify_send_email',
  v1_verification_verify_send_message: 'v1_verification_verify_send_message',
};
