import { create } from "zustand";
import { apiGoogleLogin } from "../Api/mainApi";

type GoogleUser = {
  id?: string;
  email?: string;
  name?: string;
};

type GoogleAuthState = {
  user: GoogleUser | null;
  token: string | null;
  isAuthenticated: boolean;
  googlelogin: (data: Record<string, unknown>) => Promise<GoogleUser | null>;
  logout: () => void;
};

const googleLoginStore = create<GoogleAuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  googlelogin: async (data) => {
    try {
      const response = await apiGoogleLogin(data);
      const responseData = response.data;

      const user = responseData?.user ?? null;
      const token = responseData?.accessToken ?? null;

      set({
        user,
        token,
        isAuthenticated: Boolean(user && token),
      });

      if (token) {
        window.localStorage.setItem("travel_token", token);
      }

      return user;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });

    window.localStorage.removeItem("travel_token");
  },
}));

export default googleLoginStore;