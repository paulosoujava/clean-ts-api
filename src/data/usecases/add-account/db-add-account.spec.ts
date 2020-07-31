import { DbAddAccount } from './db-add-account'
import { Encrypter } from '../../protocols/encrypter'

interface SutTypes {
  sut: DbAddAccount
  encrypteStub: Encrypter
}
const makeSut = (): SutTypes => {
  class EncrypterStub {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('hased_password'))
    }
  }
  const encrypteStub = new EncrypterStub()
  const sut = new DbAddAccount(encrypteStub)
  return {
    sut,
    encrypteStub
  }
}
describe('DbAddAccount Usecase', () => {
  test('should call encrypter with correct password',async () => {
    const { encrypteStub, sut } = makeSut()
    const encryptSpy = jest.spyOn(encrypteStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
})
