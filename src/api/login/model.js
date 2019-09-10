import mongoose, { Schema } from 'mongoose'

const loginSchema = new Schema({
  userName: {
    type: String
  },
  password: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

loginSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      userName: this.userName,
      password: this.password,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Login', loginSchema)

export const schema = model.schema
export default model
