import { AxiosError } from 'axios';
import { GoogleUserInfoError } from './google.exception';
import { http } from '../request/http.request';

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
}

interface GoogleUserInfoToken {
  access_token: string;
  id_token: string;
}

export async function getGoogleUserInfo(
  token: GoogleUserInfoToken
): Promise<GoogleUserInfo> {
  try {
    const res = await http.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token.access_token}`,
      {
        headers: {
          Authorization: `Bearer ${token.id_token}`,
        },
      }
    );

    return res.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new GoogleUserInfoError('', err.response?.data);
    }

    throw new GoogleUserInfoError('', err);
  }
}
