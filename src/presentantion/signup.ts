export class SignUpController {
  handler (httpRequest: any): any {
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
