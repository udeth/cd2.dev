export interface Response<T = any> {
    code: number;
    msg: string;
    data: T
    traceId: number;
}
