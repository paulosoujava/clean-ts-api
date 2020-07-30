import { HttpRequest, HttpResponse } from './protocols/http'

export class SignUpController {
  handler (httpRequest: HttpRequest): HttpResponse {
    const { name, email } = httpRequest.body
    if (!name) {
      return {
        statusCode: 400,
        body: new Error('name')
      }
    }
    if (!email) {
      return {
        statusCode: 400,
        body: new Error('email')
      }
    }
  }
}
