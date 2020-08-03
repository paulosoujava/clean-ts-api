import { MongoHelper as sut } from './mongo-helper'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  test('shoud reconnect if mongodb is down', async () => {
    let acccountCollection = await sut.getCollection('accounts')
    expect(acccountCollection).toBeTruthy()
    await sut.disconnect()
    acccountCollection = await sut.getCollection('accounts')
    expect(acccountCollection).toBeTruthy()
  })
})
