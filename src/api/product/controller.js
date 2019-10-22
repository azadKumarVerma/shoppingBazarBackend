import { success, notFound, authorOrAdmin, successResponse } from '../../services/response/'
import  Product  from './model'

export const create = ({ user, bodymen: { body } }, res, next) =>{
  console.log("create product controller !!!", body, typeof body['category'] ,JSON.parse(JSON.stringify(body['category']))) ;
  // let {category, price, title} = body;
  // console.log("category -------------- ", category);
  Product.create({ ...body, createdBy: user })
    .then((product) =>{
      console.log("product is added ---- ", product);
      successResponse(res, 201, product)
    } )
    // .then(success(res, 201))
    .catch(next)
  }

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Product.count(query)
    .then(count => Product.find(query, select, cursor))
      .then((products) => {
        let data = {
          // total: count,
          products: products
        }
        successResponse(res, 201, data );
      })
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
