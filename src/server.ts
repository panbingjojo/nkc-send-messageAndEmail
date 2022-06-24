import {broker} from './modules/communication';
import app from './app';
import ApiService from 'moleculer-web';
import {ErrorLog, InfoLog} from './modules/logger';
import {setNormalSetting} from './services/settingCreator';

broker.createService(ApiService);
broker.createService(app);

async function run() {
  InfoLog('Starting service...');
  await broker.start();
  InfoLog('Service started');
  await setNormalSetting();
}

run().catch(ErrorLog);
