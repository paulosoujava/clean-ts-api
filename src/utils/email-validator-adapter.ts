import { EmailValidator } from '../presentantion/protocols/email-validator'
import validator from 'validator'

export class EmailValidatorAdatpter implements EmailValidator {
  isValid (email: string): boolean {
    return validator.isEmail(email)
  }
}
