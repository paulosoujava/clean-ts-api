import request from 'supertest'
import app from './../config/app'

describe('Cors middleware', () => {
  test('should enabled cors ', async () => {
    app.get('/test-cors', (req, res) => {
      res.send(req.body)
    })
    await request(app)
      .get('/test-body-parser')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-headers', '*')
      .expect('access-control-allow-methods', '*')
  })
})
