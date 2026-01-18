import { api } from "./api";
import { setCredentials } from "./authSlice";

export type User = {
  id: string;
  name: string;
  email: string;
  avatarId: number;
};

type LoginRequest = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
  user: User;
};

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        const { data } = await queryFulfilled;
        localStorage.setItem("token", data.token);
        dispatch(setCredentials(data.user));
      },
    }),

    guestLogin: builder.mutation({
      query: () => ({
        url: "/auth/guest",
        method: "POST",
      }),
    }),

    // 🔥 AUTH REHYDRATION ENDPOINT
    getMe: builder.query<User, void>({
      query: () => ({
        url: "/users/me",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
    }),
  }),
});

export const { useLoginMutation, useGetMeQuery, useGuestLoginMutation } = authApi;
