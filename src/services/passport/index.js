import passport from 'passport'
import { Schema } from 'bodymen'
import { BasicStrategy } from 'passport-http'
import { Strategy as BearerStrategy } from 'passport-http-bearer'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { jwtSecret, masterKey } from '../../config'
import * as facebookService from '../facebook'
import * as githubService from '../github'
import * as googleService from '../google'
import User, { schema } from '../../api/user/model'

export const password = () => (req, res, next) =>
{
  console.log("request value ----------", req.body);
  passport.authenticate('password', { session: false }, (err, user, info) => {
    console.log(err, user, info)
    if (err && err.param) {
      return res.status(400).json(err)
    } else if (err || !user) {
      console.log("error in passport ---------",err,user,info);
      return res.status(401).json({ success: false, message: 'User Details could not be validated' }).end()
    }
    req.logIn(user, { session: false }, (err) => {
      if (err) return res.status(401).json({success:false,message:"User Details could not be validated"}).end()
      next()
    })
  })(req, res, next)
}  

export const facebook = () =>
  passport.authenticate('facebook', { session: false })

export const github = () =>
  passport.authenticate('github', { session: false })

export const google = () =>
  passport.authenticate('google', { session: false })

export const master = () =>
  passport.authenticate('master', { session: false })

// manually added
export const authorizeApp = () => (req, res, next) =>
  passport.authenticate('authorizeApp', { session: false }, (err, d) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Unauthorized Request' })
    }
    next()
  })(req, res, next)


export const token = ({ required, roles = User.roles } = {}) => (req, res, next) =>
  passport.authenticate('token', { session: false }, (err, user, info) => {
    if (err || (required && !user) || (required && !~roles.indexOf(user.role))) {
      return res.status(401).json({ success: false, message: "You are not authorized to access this API" }).end()
    }
    req.logIn(user, { session: false }, (err) => {
      if (err) return res.status(401).json({ success: false, message: "You are not authorized to access this API" }).end()
      next()
    })
  })(req, res, next)

passport.use('password', new BasicStrategy((email, password, done) => {
  console.log("i m triggered");
  const userSchema = new Schema({ email: schema.tree.email, password: schema.tree.password })
  console.log("triggered " );
  userSchema.validate({ email, password }, (err) => {
    if (err) done(err)
  })

  User.findOne({ email }).then((user) => {
    if (!user) {
  console.log("trigger 3")
      done(true)
      return null
    }
    return user.authenticate(password, user.password).then((user) => {
  console.log("trigger 4")
      done(null, user)
      return null
    }).catch(done)
  })
}))

// passport.use('facebook', new BearerStrategy((token, done) => {
//   facebookService.getUser(token).then((user) => {
//     return User.createFromService(user)
//   }).then((user) => {
//     done(null, user)
//     return null
//   }).catch(done)
// }))

// passport.use('github', new BearerStrategy((token, done) => {
//   githubService.getUser(token).then((user) => {
//     return User.createFromService(user)
//   }).then((user) => {
//     done(null, user)
//     return null
//   }).catch(done)
// }))

// passport.use('google', new BearerStrategy((token, done) => {
//   googleService.getUser(token).then((user) => {
//     return User.createFromService(user)
//   }).then((user) => {
//     done(null, user)
//     return null
//   }).catch(done)
// }))

passport.use('authorizeApp', new BearerStrategy((token, done) => {
  // if (token === masterKey) {
  //   done(null, {})
  // } else {
  //   done(null, false)
  // }
  console.log("trigger 2")
  token = Buffer.from(token, 'base64').toString('ascii')
  AuthorizedAppsModel.findOne({ appKey: token, isactive: true }).then((data) => {
    if (!data) { return done(true, null) }
    return done(null, data)
  }).catch(done)
}))

passport.use('token', new JwtStrategy({
  secretOrKey: jwtSecret,
  jwtFromRequest: ExtractJwt.fromExtractors([
    // ExtractJwt.fromUrlQueryParameter('access_token'),
    // ExtractJwt.fromBodyField('access_token'),
    ExtractJwt.fromAuthHeaderWithScheme('Bearer')
  ])
}, ({ id }, done) => {
  console.log("id::::::::::::::",id)
  User.findById(id).then((user) => {
    console.log("user:::::::::::::::::::::",user);
    done(null, user)
    return null
  }).catch(done)
}))
