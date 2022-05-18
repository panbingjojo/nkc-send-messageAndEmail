import {readFileSync} from 'fs';
import {resolve} from 'path';
import {Config} from '../interfaces/config';
import {yamlToJson} from './yaml';

const configFilePath = resolve(__dirname, '../../configs.yaml');
const yamlContent = readFileSync(configFilePath).toString();

export default <Config>yamlToJson(yamlContent);
