export interface Response<T> {
    succeeded: boolean;
    message: string;
    data: T[];
}

export interface ResponseLogin {
    accessToken: string
}

export interface RegisterResponse {
    status: number;
}