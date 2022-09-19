export type HttpResponse = {
    statusCode: number
    body: any
}

export interface Controller<T = any> {
    handle(data: T): Promise<HttpResponse>
}