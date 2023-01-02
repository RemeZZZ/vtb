import fetch from 'node-fetch';
import env from 'dotenv';
import { checkLeads } from '../utils/bankMethods.js';

env.config();

export async function check(request, response) {
  const { leads } = request.body;

  console.log(request.body);

  const result = await checkLeads(leads);

  response.send(result);
}
