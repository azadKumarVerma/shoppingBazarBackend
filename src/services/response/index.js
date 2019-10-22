export const success = (res, status) => (entity) => {
  if (entity) {
    console.log("entity --------- ", entity);
    res.status(status || 200).json({res:entity,err:null})
  }
  return null
}

export const notFound = (res) => (entity) => {
  if (entity) {
    return entity
  }
  res.status(404).end()
  return null
}

export const authorOrAdmin = (res, user, userField) => (entity) => {
  if (entity) {
    const isAdmin = user.role === 'admin'
    const isAuthor = entity[userField] && entity[userField].equals(user.id)
    if (isAuthor || isAdmin) {
      return entity
    }
    res.status(401).end()
  }
  return null
}

export const successResponse = (res, status, data=null) => {
    if(res){
      res.status(status || 200).json({res:data,err:null})
    }
  return null
}
