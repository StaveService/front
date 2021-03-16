export interface ITokenHeaders {
  ['content-type']: string
  ['access-token']: string
  client: string
  uid: string
}

export interface IUser {
  ['allow_password_change']?: false
  email: string
  id: number
  image: {url: string | null}
  name: string
  nickname: string
  ['created_at']: string
  birthday: string | null
  gender: number | null
  introduction: string | null
}

export interface ISignInFormValues {
  email: string
  password: string
}

export interface ISignUpFormValues extends ISignInFormValues {
  nickname: string
  familyname: string
  givenname: string
  // eslint-disable-next-line camelcase
  password_confirmation: string
}
