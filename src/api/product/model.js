import mongoose, { Schema } from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'
import { env } from '../../config'

const roles = ['user', 'admin']

const productSchema = new Schema({
  title:{
      type: String,
      required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  price: {
    type: String,
    required: true
  },
  image:{
    type: String,
    required: true
  },
  createdBy: {
      type: String,
    //   required: true
  }
  // services: {
  //   facebook: String,
  //   github: String,
  //   google: String
  // },
  // role: {
  //   type: String,
  //   enum: roles,
  //   default: 'user'
  // },
  // picture: {
  //   type: String,
  //   trim: true
  // }
}, {
  timestamps: true
})





// userSchema.statics = {
//   roles,

//   createFromService ({ service, id, email, name, picture }) {
//     return this.findOne({ $or: [{ [`services.${service}`]: id }, { email }] }).then((user) => {
//       if (user) {
//         user.services[service] = id
//         user.name = name
//         user.picture = picture
//         return user.save()
//       } else {
//         const password = randtoken.generate(16)
//         return this.create({ services: { [service]: id }, email, password, name, picture })
//       }
//     })
//   }
// }

const model = mongoose.model('Product', productSchema)

export const schema = model.schema
export default model
