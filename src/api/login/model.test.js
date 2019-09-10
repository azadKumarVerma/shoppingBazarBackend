import { Login } from '.'
import { User } from '../user'

let user, login

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  login = await Login.create({ createdBy: user, userName: 'test', password: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = login.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(login.id)
    expect(typeof view.createdBy).toBe('object')
    expect(view.createdBy.id).toBe(user.id)
    expect(view.userName).toBe(login.userName)
    expect(view.password).toBe(login.password)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = login.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(login.id)
    expect(typeof view.createdBy).toBe('object')
    expect(view.createdBy.id).toBe(user.id)
    expect(view.userName).toBe(login.userName)
    expect(view.password).toBe(login.password)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
