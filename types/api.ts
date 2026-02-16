export type ApiError = {
  error: string
  code: string
}

export type ApiSuccess<T> = T & {
  ok: true
}
