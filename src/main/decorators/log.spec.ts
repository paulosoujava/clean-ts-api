import { LogControllerDecorator } from './log'
import { Controller, HttpRequest, HttpResponse } from '../../presentantion/protocols'

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handler (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httResponse: HttpResponse = {
        statusCode: 200,
        body: {
          name: 'any_name'
        }
      }
      return new Promise(resolve => resolve(httResponse))
    }
  }
  return new ControllerStub()
}

interface SutTypes{
  sut: LogControllerDecorator
  controllerStub: Controller
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const sut = new LogControllerDecorator(controllerStub)
  return {
    sut,
    controllerStub
  }
}

describe('Log Decorator', () => {
  test('should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handler')
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    await sut.handler(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })
})
