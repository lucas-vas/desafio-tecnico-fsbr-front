import { BaseQueryApi, createApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Response } from '../../interfaces/response';
import { Brand, RegisterBrand } from '../../interfaces/brand';
import { message } from 'antd';

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
        const errorData = result.error.data as Partial<Response<unknown>>;
        const errorMessage =
        errorData && errorData.succeeded === false && errorData.message
            ? errorData.message
            : 'Ocorreu um erro ao processar sua solicitação';
    
        message.error(errorMessage);
    }
    
    return result;
};

export const brandApiSlice = createApi({
  reducerPath: 'brandApi',
  baseQuery: baseQueryWithErrorHandler,
  endpoints: (builder) => ({
    getAllBrands: builder.query<Response<Brand>, void>({
      query: () => 'Brand/GetAll',
    }),

    getAllBrandsWithFilter: builder.query<Response<Brand>, { name: string }>({
      query: ({ name }) => {
        const params = new URLSearchParams();

        if (name) params.append('Name', name);

        return `Brand/GetAllWithFilter?${params.toString()}`;
      },
    }),

    registerBrand: builder.mutation<Response<Brand>, RegisterBrand>({
      query: (body) => ({
        url: 'Brand/Create',
        method: 'POST',
        body,
      }),
    }),

    updateBrand: builder.mutation<Response<Brand>, Brand>({
      query: (body) => ({
        url: 'Brand/Update',
        method: 'PUT',
        body,
      }),
    }),

    deleteBrand: builder.mutation<Response<unknown>, { brandId: string }>({
      query: ({ brandId }) => ({
        url: `Brand/Delete/${brandId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetAllBrandsQuery,
  useLazyGetAllBrandsWithFilterQuery,
  useRegisterBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandApiSlice;
