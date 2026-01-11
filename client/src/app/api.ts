import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000/api",
    prepareHeaders: (h) => {
      const t = localStorage.getItem("token");
      if (t) h.set("authorization", `Bearer ${t}`);
      return h;
    },
  }),

  // ✅ REQUIRED FOR invalidatesTags / providesTags
  tagTypes: ["Quizzes", "Attempts", "Stats"],

  endpoints: (b) => ({
    /* 🔹 Generate Quiz */
    generateQuiz: b.mutation({
      query: (body) => ({
        url: "/quizzes/generate",
        method: "POST",
        body,
      }),
    }),

    /* 🔹 Save Quiz */
    saveQuiz: b.mutation({
      query: (data) => ({
        url: "/quizzes/save",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Quizzes"],
    }),

    /* 🔹 Save Quiz Attempt */
    saveAttempt: b.mutation({
      query: (data) => ({
        url: "/quizzes/attempt",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Attempts", "Stats"],
    }),

    /* 🔹 Get Saved Quizzes */
    getSavedQuizzes: b.query({
      query: () => "/quizzes/saved",
      providesTags: ["Quizzes"],
    }),

    /* 🔹 Get Previous Attempts */
    getAttempts: b.query({
      query: () => "/quizzes/attempts",
      providesTags: ["Attempts"],
    }),

    /* 🔹 Get Quiz By Id */
    getQuizById: b.query({
      query: (id: string) => `/quizzes/${id}`,
    }),

    /* 🔹 User Stats (Home page) */
    getUserStats: b.query({
      query: () => "/user/stats",
      providesTags: ["Stats"],
    }),

    /* 🔹 Delete Quiz */
    deleteQuiz: b.mutation({
      query: (id: string) => ({
        url: `/quizzes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Quizzes"],
    }),

    /* 🔹 Delete Attempt */
    deleteAttempt: b.mutation({
      query: (id: string) => ({
        url: `/quizzes/attempt/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Attempts", "Stats"],
    }),

    /* 🔹 Share Quiz */
    shareQuiz: b.mutation<{ shareUrl: string }, string>({
      query: (quizId) => ({
        url: `/quizzes/${quizId}/share`,
        method: "POST",
      }),
    }),

    /* 🔹 Get Shared Quiz */
    getSharedQuiz: b.query({
      query: (token: string) => `/quizzes/shared/${token}`,
    }),
  }),
});

export const {
  useGenerateQuizMutation,
  useSaveQuizMutation,
  useSaveAttemptMutation,
  useGetSavedQuizzesQuery,
  useGetAttemptsQuery,
  useGetQuizByIdQuery,
  useGetUserStatsQuery,
  useDeleteQuizMutation,
  useDeleteAttemptMutation,
  useShareQuizMutation,
  useGetSharedQuizQuery,
} = api;
