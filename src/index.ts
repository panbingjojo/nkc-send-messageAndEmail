import {broker} from './modules/communication';
import ApiService from 'moleculer-web';
import {InfoLog} from './modules/logger';

broker.createService(ApiService);

async function run() {
  InfoLog('Starting service...');
  await broker.start();
  InfoLog('Service started');
}

run().catch(console.error);
