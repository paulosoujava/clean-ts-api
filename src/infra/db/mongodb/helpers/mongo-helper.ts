import { MongoClient, Collection } from 'mongodb'

export const MongoHelper = {
  // como MongoHelper é um objeto temos que iniciar o client assim para nao conflitar com javascript pois estamos usando typescript
  client: null as MongoClient,

  async connect (url: string): Promise<void> {
    this.client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },

  async disconnect (): Promise<void> {
    await this.client.close()
  },

  getCollection (name: string): Collection {
    return this.client.db().collection(name)
  }
}
