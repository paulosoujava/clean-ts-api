import { HttpRequest, HttpResponse } from './protocols/http'
import { MissingParamError } from './erros/missing-param-error'
import { badRequest } from './helpers/http-helpers'

export class SignUpController {
  handler (httpRequest: HttpRequest): HttpResponse {
    const { name, email } = httpRequest.body
    if (!name) {
      return badRequest(new MissingParamError('name'))
    }
    if (!email) {
      return badRequest(new MissingParamError('email'))
    }
  }
}
