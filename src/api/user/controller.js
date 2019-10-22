import { success, notFound } from '../../services/response/'
import { User } from '.'
import { sign } from '../../services/jwt'
var nodemailer = require('nodemailer')

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  User.count(query)
    .then(count => User.find(query, select, cursor)
      .then(users => ({
        rows: users.map((user) => user.view()),
        count
      }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>{
  console.log("show controller called ------1")
  User.findById(params.id)
  .then(notFound(res))
  .then((user) => user ? user.view() : null)
  .then(success(res))
  .catch(next)
}
  

export const showMe = ({ user }, res) =>{
  console.log("show me called ")
  res.json(user.view(true))
}

export const create = ({ bodymen: { body } }, res, next) =>
  User.create(body)
    .then(user => {
      sign(user.id)
        .then((token) => ({ token, user: user.view(true) }))
        .then(success(res, 201))
    })
    .catch((err) => {
      /* istanbul ignore else */
      console.log("error--------------",err);
      if (err.name === 'MongoError' && err.code === 11000) {
        res.status(409).json({
          valid: false,
          param: 'email',
          message: 'email already registered'
        })
      } else {
        next(err)
      }
    })

export const update = ({ bodymen: { body }, params, user }, res, next) =>
  User.findById(params.id === 'me' ? user.id : params.id)
    .then(notFound(res))
    .then((result) => {
      if (!result) return null
      const isAdmin = user.role === 'admin'
      const isSelfUpdate = user.id === result.id
      if (!isSelfUpdate && !isAdmin) {
        res.status(401).json({
          valid: false,
          message: 'You can\'t change other user\'s data'
        })
        return null
      }
      return result
    })
    .then((user) => user ? Object.assign(user, body).save() : null)
    .then((user) => user ? user.view(true) : null)
    .then(success(res))
    .catch(next)

export const updatePassword = ({ bodymen: { body }, params, user }, res, next) =>
  User.findById(params.id === 'me' ? user.id : params.id)
    .then(notFound(res))
    .then((result) => {
      if (!result) return null
      const isSelfUpdate = user.id === result.id
      if (!isSelfUpdate) {
        res.status(401).json({
          valid: false,
          param: 'password',
          message: 'You can\'t change other user\'s password'
        })
        return null
      }
      return result
    })
    .then((user) => user ? user.set({ password: body.password }).save() : null)
    .then((user) => user ? user.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  User.findById(params.id)
    .then(notFound(res))
    .then((user) => user ? user.remove() : null)
    .then(success(res, 204))
    .catch(next)

export const sendSmsController = async({params}, res, next)=>{
  try{
    console.log("reached to the sms controller ------------------------");
    const way2sms = require('way2sms');
    way2sms.login('9015336265', 'password');
    let smsResult = await way2sms.send(cookie, '8976543210', 'foggy day');
    console.log("sms Result",smsResult )
    res.send("msg sent successfully"); 
  }
  catch(next){
    console.log("i m i catch", next)
  }
}  

export const sendEmailController = async({params}, res, next)=>{
  try{
    console.log("reached to the sms controller ------------------------");
    // set up transport object for nodemailer
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'azad.verma@geminisolutions.in',
        pass: 'Azad@1508'
      }
    })

    const mailOptions = {
      from: 'azad.verma@geminisolutions.in', // sender address
      to: 'azadsachin115@gmail.com', // list of receivers
      subject: 'Test Email', // Subject line
      html: '<p>my first email</p>'// plain text body
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if(err){
        console.log("error encountered in sending email ------",err)
        res.send("unable to send message ");
      }
      else{
        console.log("email send successfully ------",info);
        res.send("message sent successfully");
      }
        
   });
  }
  catch(next){
    console.log("i m i catch", next)
  }
}  
