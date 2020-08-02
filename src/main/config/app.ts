import express from 'express'
import setpMiddelwares from './middlewares'
import setupRoutes from './routes'

const app = express()
setpMiddelwares(app)
setupRoutes(app)
export default app
