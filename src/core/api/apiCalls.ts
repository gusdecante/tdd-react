import axios from "axios";
import i18n from "../locale/i18n";

export interface ISignUp {
  username: string;
  email: string;
  password: string;
}

export const signUp = (body: ISignUp) => {
  return axios.post("/api/1.0/users", body, {
    headers: {
      "Accept-Language": i18n.language,
    },
  });
};