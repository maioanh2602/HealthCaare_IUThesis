const db = require('./db');
const userServices = require('../services/user.services');

beforeAll(async () => {
  await db.connectMongo();
});
afterEach(async () => {
  await db.clearDatabase()
});

afterAll(async () => {
  await db.closeConnection();
});
describe('UserController', () => {
  const user = {
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe',
    email: 'johndoe@gmail.com',
    password: '123456',
    address: '123 ABC',
    gender: 'male',
    avatar: 'http://google.com',
    dateOfBirth: new Date(),
    role: 'doctor',

  };
  const loginCredentials = {
    email: 'johndoe@gmail.com',
    password: '123456',
  }
  const updateData = {
    firstName: 'John1',
    lastName: 'Doe1',
  }

  it('should create a user', async () => {

    const result = await userServices.register(user);
    expect(result._id).toBeDefined();

  });
  it('should login', async () => {
    await userServices.register({...user, password: "123456"});
    const result = await userServices.login(loginCredentials);
    expect(result.token).toBeDefined();
    expect(result.password).toBeUndefined();
  });
  it('should update user', async () => {
    let newUser = await userServices.register(user);
    updateData['userID'] = newUser._id;
    const result = await userServices.update(updateData);
    expect(result).toBeDefined();
  });

  it('should get user details', async () => {
    let newUser = await userServices.register(user);
    const query = {
      userID: newUser._id,
    }

    const userInfo = await userServices.getDetails(query);
    expect(userInfo.firstName).toBe(user.firstName);
    expect(userInfo.password).toBeUndefined();
  })

})