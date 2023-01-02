import fetch from 'node-fetch';
import env from 'dotenv';
import { checkLeads } from '../utils/bankMethods.js';

env.config();

export async function check(request, response) {
  const { leads } = request.body;

  const result = await checkLeads(leads);

  console.log(result);

  response.send({
    leads: result.leads.map((item) => {
      return {
        inn: item.inn,
        result:
          item.responseCode === 'NEGATIVE'
            ? 'Нет'
            : item.responseCode === 'POSITIVE'
            ? 'Да'
            : 'Хз',
      };
    }),
  });
}
