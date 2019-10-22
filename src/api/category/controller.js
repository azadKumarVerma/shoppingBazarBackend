import { success, notFound, authorOrAdmin, successResponse } from '../../services/response/'
import  Category  from './model'

export const create = ({ user, bodymen: { body } }, res, next) =>{
  console.log("create Category controller !!!");
  Category.create({ ...body, createdBy: user })
    .then((category) =>{
      console.log("category is added ---- ", category);
      successResponse(res, 201, category)
    } )
    .catch(next)
  }

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Category.count(query)
    .then(count => Category.find(query, select, cursor))
    .then(categories=>{
      console.log("categories------------------",categories);
      if(categories) successResponse(res, 201, categories)
    })
    //   .populate('createdBy')
    //   .then((logins) => ({
    //     count,
    //     rows: logins.map((login) => login.view())
    //   }))
    // )
    // .then(success(res))
    .catch(next)

// export const show = ({ params }, res, next) =>
//   Login.findById(params.id)
//     .populate('createdBy')
//     .then(notFound(res))
//     .then((login) => login ? login.view() : null)
//     .then(success(res))
//     .catch(next)

// export const update = ({ user, bodymen: { body }, params }, res, next) =>
//   Login.findById(params.id)
//     .populate('createdBy')
//     .then(notFound(res))
//     .then(authorOrAdmin(res, user, 'createdBy'))
//     .then((login) => login ? Object.assign(login, body).save() : null)
//     .then((login) => login ? login.view(true) : null)
//     .then(success(res))
//     .catch(next)

// export const destroy = ({ user, params }, res, next) =>
//   Login.findById(params.id)
//     .then(notFound(res))
//     .then(authorOrAdmin(res, user, 'createdBy'))
//     .then((login) => login ? login.remove() : null)
//     .then(success(res, 204))
//     .catch(next)
