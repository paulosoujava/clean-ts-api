import { SignUpController } from './signup'
import { MissingParamError, InvalidParamError, ServerError } from '../../erros'
import { EmailValidator, AddAccount, AddAccountModel, AccountModel } from './signup-protocols'
import { HttpRequest } from '../../protocols'
import { badRequest, serverError, ok } from '../../helpers/http-helpers'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}
const makeEmailValidatorWithError = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      throw new Error()
    }
  }
  return new EmailValidatorStub()
}
const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password'
      }
      return new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new AddAccountStub()
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

interface SytTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}
const makeSut = (): SytTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('SignUp Controller', () => {
  test('should return 400 if no name is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handler(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
    // expect(httpResponse.statusCode).toBe(400)
    // expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })
  test('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handler(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
    // expect(httpResponse.statusCode).toBe(400)
    // expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })
  test('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handler(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
    // expect(httpResponse.statusCode).toBe(400)
    // expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })
  test('should return 400 if no password confirmation fails', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password'
      }
    }
    const httpResponse = await sut.handler(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
    // expect(httpResponse.statusCode).toBe(400)
    // expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })
  test('should return 400 if no passwordConfirmation is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handler(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')))
    // expect(httpResponse.statusCode).toBe(400)
    // expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })
  test('should return 400 if an invalid email  is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handler(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
    // expect(httpResponse.statusCode).toBe(400)
    // expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })
  test('should call emailvalidator with correct email', async () => {
    const { sut, emailValidatorStub } = await makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await sut.handler(makeFakeRequest())
    expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com')
  })
  test('should return 500 if emvailvalidator throws', async () => {
    const emailValidatorStub = makeEmailValidatorWithError()
    const sut = new SignUpController(emailValidatorStub, null)
    const httpResponse = await sut.handler(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError('emvailvalidator throws')))
    // expect(httpResponse.statusCode).toBe(500)
    // expect(httpResponse.body).toEqual(new ServerError('emvailvalidator throws'))
  })
  // o mesmo que o de cima porem com mock direto no jest sem a
  // necessidade de um makeSutWithError
  test('should return 500 if emvailvalidator throws ', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(() => {
      throw new Error()
    })
    const httpResponse = await sut.handler(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError('emvailvalidator throws')))
    // expect(httpResponse.statusCode).toBe(500)
    // expect(httpResponse.body).toEqual(new ServerError('emvailvalidator throws'))
  })
  test('should call addaccount with correct values ', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handler(makeFakeRequest())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    })
  })
  test('should return 500 if addAccount throws ', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementation(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })
    const httpResponse = await sut.handler(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError('addAccount throws ')))
    // expect(httpResponse.statusCode).toBe(500)
    // expect(httpResponse.body).toEqual(new ServerError('addAccount throws '))
  })
  test('should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handler(makeFakeRequest())
    expect(httpResponse).toEqual(ok({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    }))
    // expect(httpResponse.statusCode).toBe(200)
    // expect(httpResponse.body).toEqual({
    //   id: 'valid_id',
    //   name: 'valid_name',
    //   email: 'valid_email@email.com',
    //   password: 'valid_password'
    // })
  })
})
