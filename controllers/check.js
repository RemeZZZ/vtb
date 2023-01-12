import env from 'dotenv';
import { checkLeads } from '../utils/bankMethods.js';

env.config();

export async function check(request, response) {
  const { leads } = request.body;

  const checkedLeads = [];

  for (let i = 0; i < leads.length; i += 200) {
    const chunk = leads.slice(i, i + 200);

    try {
      const result = await checkLeads(chunk);

      console.log(result);

      checkedLeads.push(...result.leads);
    } catch {}
  }

  console.log(checkedLeads);

  response.send({
    leads: checkedLeads.map((item) => {
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
