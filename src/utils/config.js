let baseUrl = './api'
const baseOrigin = process.env.REACT_APP_BACKEND_ORIGIN || ''

if(process.env.NODE_ENV === 'development') {
    baseUrl = process.env.REACT_APP_BACKEND_URL || baseUrl
}

export default {baseUrl, baseOrigin}