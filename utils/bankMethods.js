import fetch from 'node-fetch';
import env from 'dotenv';
import https from 'https';

env.config();

const agent = new https.Agent({
  rejectUnauthorized: false,
});

export async function getAccessToken() {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept-Encoding': 'gzip, deflate, br',
    Accept: 'application/json',
  };

  const query = `grant_type=client_credentials&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`;

  const response = await fetch(
    `${process.env.OPEN_API_URL}/passport/oauth2/token?${query}`,
    {
      method: 'POST',
      headers: headers,
      agent: agent,
    },
  );

  return response.json();
}

export async function checkLeads(list) {
  const token = await getAccessToken();

  if (!token || !list) return;

  const headers = {
    Authorization: `${token.token_type} ${token.access_token}`,
    'X-IBM-Client-Id': process.env.IBM_CLIENT_ID,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  const body = list
    .filter((item) => item.inn.length === 12 || item.inn.length === 10)
    .map((item) => {
      return { inn: `${item.inn}`, productCode: 'Payments' };
    });

  const result = await fetch(
    `${process.env.GW_API_URL}/smb/lecs/lead-impers/v1/check_leads`,
    {
      method: 'POST',
      headers: headers,
      agent: agent,
      body: JSON.stringify({
        leads: body,
      }),
    },
  );

  return result.json();
}
