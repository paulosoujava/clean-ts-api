import express from 'express'
import setpMiddelwares from './middlewares'

const app = express()
setpMiddelwares(app)
export default app
