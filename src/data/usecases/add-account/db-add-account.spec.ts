import { DbAddAccount } from './db-add-account'
import { Encrypter } from '../../protocols/encrypter'

interface SutTypes {
  sut: DbAddAccount
  encrypteStub: Encrypter
}
const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('hased_password'))
    }
  }
  return new EncrypterStub()
}
const makeSut = (): SutTypes => {
  const encrypteStub = makeEncrypter()
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
  test('should throw if encrypter throws',async () => {
    const { encrypteStub, sut } = makeSut()
    jest.spyOn(encrypteStub, 'encrypt').mockResolvedValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })
})
