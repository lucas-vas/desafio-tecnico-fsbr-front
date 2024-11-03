import { BaseQueryApi, createApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Response } from '../../interfaces/response';
import { Car, RegisterCar } from '../../interfaces/car';
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

export const carApiSlice = createApi({
  reducerPath: 'carApi',
  baseQuery: baseQueryWithErrorHandler,
  endpoints: (builder) => ({
    getAllCars: builder.query<Response<Car>, void>({
      query: () => 'Car/GetAll',
    }),
    
    getAllCarsWithFilter: builder.query<Response<Car>, { modelDescription?: string; year?: number; brandId?: string }>({
      query: ({ modelDescription, year, brandId }) => {
        const params = new URLSearchParams();

        if (modelDescription) params.append('ModelDescription', modelDescription);
        if (year) params.append('Year', year.toString());
        if (brandId) params.append('BrandId', brandId);

        return `Car/GetAllWithFilter?${params.toString()}`;
      },
    }),
    
    registerCar: builder.mutation<Response<Car>, RegisterCar>({
      query: (body) => ({
        url: 'Car/Create',
        method: 'POST',
        body,
      }),
    }),

    updateCar: builder.mutation<Response<Car>, RegisterCar>({
      query: (body) => ({
        url: 'Car/Update',
        method: 'PUT',
        body,
      }),
    }),

    deleteCar: builder.mutation<Response<unknown>, { carId: string }>({
      query: ({ carId }) => ({
        url: `Car/Delete/${carId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetAllCarsQuery,
  useLazyGetAllCarsWithFilterQuery,
  useRegisterCarMutation,
  useUpdateCarMutation,
  useDeleteCarMutation,
} = carApiSlice;
