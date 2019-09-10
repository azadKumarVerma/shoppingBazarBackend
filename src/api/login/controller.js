import { success, notFound, authorOrAdmin } from '../../services/response/'
import { Login } from '.'

export const create = ({ user, bodymen: { body } }, res, next) =>{
  console.log("finalyy reached !!!");
  Login.create({ ...body, createdBy: user })
    .then((login) => login.view(true))
    .then(success(res, 201))
    .catch(next)
  }
export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Login.count(query)
    .then(count => Login.find(query, select, cursor)
      .populate('createdBy')
      .then((logins) => ({
        count,
        rows: logins.map((login) => login.view())
      }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Login.findById(params.id)
    .populate('createdBy')
    .then(notFound(res))
    .then((login) => login ? login.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Login.findById(params.id)
    .populate('createdBy')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'createdBy'))
    .then((login) => login ? Object.assign(login, body).save() : null)
    .then((login) => login ? login.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ user, params }, res, next) =>
  Login.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'createdBy'))
    .then((login) => login ? login.remove() : null)
    .then(success(res, 204))
    .catch(next)
