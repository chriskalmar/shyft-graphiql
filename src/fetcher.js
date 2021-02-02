import getConfig from 'next/config';
import axios from 'axios';
import { getToken, refreshToken } from './auth';

const { publicRuntimeConfig } = getConfig();

export const axiosInstance = axios.create({
  baseURL: publicRuntimeConfig.API_ENDPOINT || 'http://localhost:4000/graphql',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (!config.isRefreshTokenRequest) {
      const token = getToken();

      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `JWT ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(undefined, (err) => {
  const res = err.response;

  if (
    res.status === 401 &&
    res.data?.errors?.[0]?.code === 'AuthorizationTokenExpiredError' &&
    !res.config?.__isRetryRequest
  ) {
    return refreshToken(fetcher).then(() => {
      res.config.__isRetryRequest = true;
      return axiosInstance(res.config);
    });
  }

  throw err;
});

export const fetcher = (...params) =>
  axiosInstance
    .post('', ...params)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err.response.data;
    });
