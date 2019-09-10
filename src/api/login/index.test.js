import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Login } from '.'

const app = () => express(apiRoot, routes)

let userSession, anotherSession, login

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  login = await Login.create({ createdBy: user })
})

test('POST /login 201 (user)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession, userName: 'test', password: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.userName).toEqual('test')
  expect(body.password).toEqual('test')
  expect(typeof body.createdBy).toEqual('object')
})

test('POST /login 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /login 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
  expect(typeof body.rows[0].createdBy).toEqual('object')
})

test('GET /login 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /login/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${login.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(login.id)
  expect(typeof body.createdBy).toEqual('object')
})

test('GET /login/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${login.id}`)
  expect(status).toBe(401)
})

test('GET /login/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})

test('PUT /login/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${login.id}`)
    .send({ access_token: userSession, userName: 'test', password: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(login.id)
  expect(body.userName).toEqual('test')
  expect(body.password).toEqual('test')
  expect(typeof body.createdBy).toEqual('object')
})

test('PUT /login/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${login.id}`)
    .send({ access_token: anotherSession, userName: 'test', password: 'test' })
  expect(status).toBe(401)
})

test('PUT /login/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${login.id}`)
  expect(status).toBe(401)
})

test('PUT /login/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: anotherSession, userName: 'test', password: 'test' })
  expect(status).toBe(404)
})

test('DELETE /login/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${login.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /login/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${login.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /login/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${login.id}`)
  expect(status).toBe(401)
})

test('DELETE /login/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
