import {Context} from 'moleculer';
import {checkerCode} from '../services/checker';

export default {
  params: {
    code: 'string',
  },
  handler(ctx: Context) {
    const {code} = ctx.params as {code: string};
    return checkerCode(code);
  },
};
