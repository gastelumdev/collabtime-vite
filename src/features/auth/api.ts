// import { api as apiSlice } from '../../app/services/api'
// import type { UserResponse, LoginRequest } from './types'



// export const api = apiSlice.injectEndpoints({
//     endpoints: builder => ({
//         login: builder.mutation<UserResponse, LoginRequest>({
//             query: (credentials) => ({
//                 url: 'login',
//                 method: 'POST',
//                 body: credentials,
//             }),
//             providesTags: ["auth"]
//         }),
//     })
// })

// export const { useLoginMutation } = api