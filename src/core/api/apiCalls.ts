import axios, { AxiosRequestHeaders } from "axios";
import { ILogin, IUserRequestBody } from "../interface";
import i18n from "../locale/i18n";

export interface ISignUp {
  username: string;
  email: string;
  password: string;
}

axios.interceptors.request.use((request) => {
  const headers = request.headers as AxiosRequestHeaders;
  headers["Accept-Language"] = i18n.language;
  return request;
});

export const signUp = (body: ISignUp) => {
  return axios.post("/api/1.0/users", body);
};

export const activate = (token: string) => {
  return axios.post(`/api/1.0/users/token/${token}`);
};

export const loadUsers = (page?: number) => {
  return axios.get("/api/1.0/users", { params: { page, size: 3 } });
};

export const getUsersById = (id: number) => {
  return axios.get(`/api/1.0/users/${id}`);
};

export const login = (body: ILogin) => {
  return axios.post("/api/1.0/auth", body);
};

export const updateUser = (
  id: number,
  body: IUserRequestBody,
  header: string
) => {
  return axios.put(`/api/1.0/users/${id}`, body, {
    headers: {
      Authorization: header,
    },
  });
};
