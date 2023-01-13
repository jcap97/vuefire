import {
  readBody,
  setCookie,
  assertMethod,
  defineEventHandler,
  deleteCookie,
} from 'h3'
import { AUTH_COOKIE_NAME, AUTH_COOKIE_MAX_AGE } from '../shared'

/**
 * Setups an API endpoint to be used by the client to mint a cookie based auth session.
 */
export default defineEventHandler(async (event) => {
  assertMethod(event, 'POST')
  const { token } = await readBody(event)

  if (token) {
    setCookie(event, AUTH_COOKIE_NAME, token, {
      maxAge: AUTH_COOKIE_MAX_AGE,
      secure: true,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
    })
    // empty content status
  } else {
    // delete the cookie
    deleteCookie(event, AUTH_COOKIE_NAME, {
      maxAge: -1,
    })
  }

  // empty response
  event.node.res.statusCode = 204
  return ''
})
