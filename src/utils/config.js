let mode = process.env.NODE_ENV || 'production'
let baseUrl = './api'

if(mode === 'development') {
    baseUrl = 'http://localhost:3001/api'
}
if(mode === 'test') {
    baseUrl = 'http://localhost:3010/api'
}

let baseOrigin = ''

export default {baseUrl, baseOrigin}