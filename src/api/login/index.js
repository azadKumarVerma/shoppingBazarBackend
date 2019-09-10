import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export Login, { schema } from './model'

const router = new Router()
const { userName, password } = schema.tree

/**
 * @api {post} /login Create login
 * @apiName CreateLogin
 * @apiGroup Login
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam userName Login's userName.
 * @apiParam password Login's password.
 * @apiSuccess {Object} login Login's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Login not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({ userName, password }),
  create)

/**
 * @api {get} /login Retrieve logins
 * @apiName RetrieveLogins
 * @apiGroup Login
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of logins.
 * @apiSuccess {Object[]} rows List of logins.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get('/',
  token({ required: true }),
  query(),
  index)

/**
 * @api {get} /login/:id Retrieve login
 * @apiName RetrieveLogin
 * @apiGroup Login
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} login Login's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Login not found.
 * @apiError 401 user access only.
 */
router.get('/:id',
  token({ required: true }),
  show)

/**
 * @api {put} /login/:id Update login
 * @apiName UpdateLogin
 * @apiGroup Login
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam userName Login's userName.
 * @apiParam password Login's password.
 * @apiSuccess {Object} login Login's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Login not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  body({ userName, password }),
  update)

/**
 * @api {delete} /login/:id Delete login
 * @apiName DeleteLogin
 * @apiGroup Login
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Login not found.
 * @apiError 401 user access only.
 */
router.delete('/:id',
  token({ required: true }),
  destroy)

export default router
