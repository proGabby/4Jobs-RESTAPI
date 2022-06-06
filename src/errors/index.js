const CustomError = require('./custom-error')
const BadRequest = require('./bad-request')
const UnAuthError = require('./unauth-error')
const NotFound = require('./not-found')
module.exports = {
    NotFound,
    CustomError,
    BadRequest,
    UnAuthError
}