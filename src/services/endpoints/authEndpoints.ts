import { BaseQueryApi, createApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { message } from 'antd';
import { User } from '../../interfaces/user';
import { RegisterResponse, ResponseLogin } from '../../interfaces/response';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API,
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithErrorHandler = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: {}) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    const isLoginEndpoint = typeof args === 'string' ? args.includes('Identity/login') : args.url === 'Identity/login';

    const isRegisterEndpoint = typeof args === 'string' ? args.includes('Identity/register') : args.url === 'Identity/register';

    const errorUnauthorized = result.error.status === 401;
    const errorBadRequest = result.error.status === 400;

    if (isLoginEndpoint && errorUnauthorized) {
      message.error("Credenciais inválidas. Verifique seu login e senha.");
    }
    else if (isRegisterEndpoint && errorBadRequest){
      message.error("Usuário já cadastrado");
    }
  }

  return result;
};

export const authApiSlice = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithErrorHandler,
  endpoints: (builder) => ({
    login: builder.mutation<ResponseLogin, User>({
      query: (body) => ({
        url: 'Identity/login',
        method: 'POST',
        body
      }),
    }),

    register: builder.mutation<RegisterResponse, User>({
      query: (body) => ({
          url: 'Identity/register',
          method: 'POST',
          body
      })
    })

  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
} = authApiSlice;
