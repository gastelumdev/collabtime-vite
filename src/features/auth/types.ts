export interface User {
    _id?: string
    id?: string
    firstname: string
    lastname: string
    email: string
    password: string
}

export interface UserResponse {
    user: User
    accessToken: string
    isAuthenticated: boolean
    id: string
}

export interface LoginRequest {
    email: string
    password: string
}

export interface ResetPasswordRequestRequest {
    email: string
}

export interface BasicResponse {
    success?: boolean
}

export interface LoginProps {
    login: any;
    isLoading?: boolean;
    handleSubmit: () => void;
    setFormState: (prev: any) => void;
    wrapperStyles?: {},
    heading?: string,
    subHeading?: string,
    prefix?: boolean,
    inputNames?: {username: string, password: string}
}