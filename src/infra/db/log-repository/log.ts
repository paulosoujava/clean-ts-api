import { LogErrorRepository } from '../../../data/protocols/log-error-repository'
import { MongoHelper } from '../mongodb/helpers/mongo-helper'

export class LogMongoRepository implements LogErrorRepository {
  async logError (stack: string): Promise<void> {
    const errorcollection = await MongoHelper.getCollection('errors')
    await errorcollection.insertOne({
      stack,
      date: new Date()
    })
  }
}
