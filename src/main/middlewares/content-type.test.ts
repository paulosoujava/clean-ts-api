import request from 'supertest'
import app from './../config/app'

describe('Content type middleware', () => {
  test('should return default content type as json', async () => {
    app.get('/test-types', (req, res) => {
      res.send()
    })
    await request(app)
      .get('/test-types')
      .expect('content-type', /json/)
  })
  test('should return content type as xml when forced', async () => {
    app.get('/test-types-xml', (req, res) => {
      res.type('xml')
      res.send()
    })
    await request(app)
      .get('/test-types-xml')
      .expect('content-type', /xml/)
  })
})
