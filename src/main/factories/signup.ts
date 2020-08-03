import { SignUpController } from '../../presentantion/controllers/signup/signup'
import { EmailValidatorAdatpter } from '../../utils/email-validator-adapter'
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { Controller } from '../../presentantion/protocols'
import { LogControllerDecorator } from '../decorators/log'

export const makeSignUpController = (): Controller => {
  const emailValidatorAdatpter = new EmailValidatorAdatpter()
  const bcryptAdatper = new BcryptAdapter(12)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAccount = new DbAddAccount(bcryptAdatper,accountMongoRepository)
  const signUpController = new SignUpController(emailValidatorAdatpter,dbAccount)
  return new LogControllerDecorator(signUpController)
}
