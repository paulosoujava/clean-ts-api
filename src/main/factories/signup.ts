import { SignUpController } from '../../presentantion/controllers/signup/signup'
import { EmailValidatorAdatpter } from '../../utils/email-validator-adapter'
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'

export const makeSignUpController = (): SignUpController => {
  const emailValidatorAdatpter = new EmailValidatorAdatpter()
  const bcryptAdatper = new BcryptAdapter(12)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAccount = new DbAddAccount(bcryptAdatper,accountMongoRepository)
  return new SignUpController(emailValidatorAdatpter,dbAccount)
}
