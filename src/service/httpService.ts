import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const BASE_URL = 'http://localhost:8081/LibraryManagementMini'; 

export const httpService = {
  get: async <T = any>(route: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return axios.get<T>(`${BASE_URL}${route}`, config);
  },

  post: async <T = any>(route: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return axios.post<T>(`${BASE_URL}${route}`, data, config);
  },

  put: async <T = any>(route: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return axios.put<T>(`${BASE_URL}${route}`, data, config);
  },

  delete: async <T = any>(route: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return axios.delete<T>(`${BASE_URL}${route}`, config);
  }
};