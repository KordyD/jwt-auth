import ky from 'ky';

export interface formData {
  email: string | null;
  password: string | null;
}

interface refreshResponse {
  accessToken: string;
}
interface logoutResponse {
  refreshToken: string;
}

interface userData {
  userId: string;
  roles: string[];
  isActivated: boolean;
  accessToken: string;
  refreshToken: string;
}

export interface getUsersResponse {
  email: string;
  password: string;
  isActivated: boolean;
  roles: string[];
  activationLink?: string | undefined;
}

const url = 'http://localhost:5000/api';

const $ky = ky.create({
  credentials: 'include',
  hooks: {
    beforeRequest: [
      (request) => {
        request.headers.append(
          'Authorization',
          `Bearer ${localStorage.getItem('accessToken')}`
        );
      },
    ],
    afterResponse: [
      async (request, _opt, res) => {
        if (res.status === 401 && !request.headers.has('X-Retry')) {
          const response: refreshResponse = await $ky(`${url}/refresh`, {
            headers: {
              'X-Retry': 'true',
            },
          }).json();
          // request.headers.set('X-Retry', 'true');
          localStorage.setItem('accessToken', response.accessToken);
          // console.log(request.headers.get('X-Retry'));
          await $ky(request);
          return;
        } else if (res.status >= 400) {
          throw await res.json();
        }
      },
    ],
  },
});

export const register = async (formData: formData) => {
  try {
    const response: userData = await $ky
      .post(`${url}/registration`, {
        json: formData,
      })
      .json();
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const login = async (formData: formData) => {
  try {
    const response: userData = await $ky
      .post(`${url}/login`, {
        json: formData,
      })
      .json();
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const logout = async () => {
  try {
    const response: logoutResponse = await $ky.post(`${url}/logout`).json();
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const refresh = async () => {
  try {
    const response: refreshResponse = await $ky.get(`${url}/refresh`).json();
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getUsers = async () => {
  try {
    const response: getUsersResponse[] = await $ky.get(`${url}/users`).json();
    return response;
  } catch (error) {
    console.log(error);
  }
};
