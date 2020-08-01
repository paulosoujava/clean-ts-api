import request from 'supertest'
import app from './../config/app'

describe('Body Parser middleware', () => {
  test('should parse json ', async () => {
    app.post('/test-body-parser', (req, res) => {
      res.send(req.body)
    })
    await request(app)
      .post('/test-body-parser')
      .send({ name: 'PAULO' })
      .expect({ name: 'PAULO' })
  })
})
