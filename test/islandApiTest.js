'use strict';

const assert = require('chai').assert;
const PoiService = require('./poi-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');
const utils = require('../app/api/utils.js');

const poiService = new PoiService(fixtures.poiService);

suite('Islands API tests', function () {

  let islands = fixtures.islands;
  let newIsland = fixtures.newIsland;
  let newUser = fixtures.newUser;

  suiteSetup(async function() {
    const returnedUser = await poiService.createUser(newUser);
    const response = await poiService.authenticate(newUser);
  });

  suiteTeardown(async function() {
    await poiService.deleteAllUsers();
    poiService.clearAuth();
  });

  setup(async function() {
    await poiService.deleteAllIslands();
  });

  teardown(async function() {
    await poiService.deleteAllIslands();
  });

  test('create an island', async function () {
    const returnedIsland = await poiService.createIsland(newIsland);
    assert(_.some([returnedIsland], newIsland), 'returnedIsland must be a superset of newIsland');
    assert.isDefined(returnedIsland._id);
  });
  test('get islands', async function () {
    const i1 = await poiService.createIsland(newIsland);
    const i2 = await poiService.getIsland(i1._id);
    assert.deepEqual(i1, i2);
  });
  test('get invalid island', async function () {
    const i1 = await poiService.getIsland('1234');
    assert.isNull(i1);
    const i2 = await poiService.getIsland('012345678901234567890123');
    assert.isNull(i2);
  });
  test('delete an island', async function () {
    let island = await poiService.createIsland(newIsland);
    assert(island._id != null);
    await poiService.deleteOneIsland(island._id);
    island = await poiService.getIsland(island._id);
    assert(island == null);
  });
  test('delete island one from many', async function () {
    for (let i of islands) {
      await poiService.createIsland(i);
    }
    let island = await poiService.createIsland(newIsland);
    let allIslands = await poiService.getIslands();
    const amount = allIslands.length;
    await poiService.deleteOneIsland(island._id);
    allIslands = await poiService.getIslands();
    const newAmount = allIslands.length;
    assert(newAmount === amount - 1);
  });

  test('delete islands added by given user', async function () {
    for (let i of islands) {
      await poiService.createIsland(i);
    }
    const allNotMatchingIslands = await poiService.getIslandByAdded("User2");
    await poiService.deleteAllIslandsAddedByUser("User1");
    const allIslands = await poiService.getIslands();
    assert.equal(allIslands.length, allNotMatchingIslands.length);
  });
  test('delete islands modified by given user', async function () {
    for (let i of islands) {
      await poiService.createIsland(i);
    }
    const allNotMatchingIslands = await poiService.getIslandByModified("User2");
    await poiService.deleteAllIslandsModifiedByUser("User1");
    const allIslands = await poiService.getIslands();
    assert.equal(allIslands.length, allNotMatchingIslands.length);
  });
  test('delete islands from category', async function () {
    for (let i of islands) {
      await poiService.createIsland(i);
    }
    const allNotMatchingIslands = await poiService.getIslandByCategory("Cat2");
    console.log(allNotMatchingIslands.length);
    await poiService.deleteIslandsOfCategory("Cat1");
    const allIslands = await poiService.getIslands();
    assert.equal(allIslands.length, allNotMatchingIslands.length);
  });


  test('get all islands', async function () {
    for (let i of islands) {
      await poiService.createIsland(i);
    }
    const allIslands = await poiService.getIslands();
    assert.equal(allIslands.length, islands.length);
  });
  test('get all islands of given category', async function () {
    for (let i of islands) {
      await poiService.createIsland(i);
    }
    const allMatchingIslands = await poiService.getIslandByCategory("Cat1");
    const allIslands = await poiService.getIslands();
    const allNotMatchingIslands = await poiService.getIslandByCategory("Cat2");
    assert.equal(allMatchingIslands.length, allIslands.length - allNotMatchingIslands.length);
  });
  test('get all islands added by given user', async function () {
    for (let i of islands) {
      await poiService.createIsland(i);
    }
    const allMatchingIslands = await poiService.getIslandByAdded("User1");
    const allIslands = await poiService.getIslands();
    const allNotMatchingIslands = await poiService.getIslandByAdded("User2");
    assert.equal(allMatchingIslands.length, allIslands.length - allNotMatchingIslands.length);
  });
  test('get all islands modified by given user', async function () {
    for (let i of islands) {
      await poiService.createIsland(i);
    }
    const allMatchingIslands = await poiService.getIslandByModified("User1");
    const allIslands = await poiService.getIslands();
    const allNotMatchingIslands = await poiService.getIslandByModified("User2");
    assert.equal(allMatchingIslands.length, allIslands.length - allNotMatchingIslands.length);
  });
  test('get island detail', async function () {
    for (let i of islands) {
      await poiService.createIsland(i);
    }
    const allIslands = await poiService.getIslands();
    for (let i = 0; i < islands.length; i++) {
      assert(_.some([allIslands[i]], islands[i]), 'returnedIsland must be a superset of newIsland');
    }
  });
  test('get all islands empty', async function () {
    const allIslands = await poiService.getIslands();
    assert.equal(allIslands.length, 0);
  });
});

suite('Users API tests', function () {

  let users = fixtures.users;
  let newUser = fixtures.newUser;
  let returnedUser;
  let response;

  suiteSetup(async function() {
    returnedUser = await poiService.createUser(newUser);
    response = await poiService.authenticate(newUser);
  });

  suiteTeardown(async function() {
    await poiService.deleteAllUsers();
    poiService.clearAuth();
  });

  // setup(async function() {
  //   await poiService.deleteAllUsers();
  // });
  //
  // teardown(async function() {
  //   await poiService.deleteAllUsers();
  // });

  test('create an user', async function() {
    assert(_.some([returnedUser], newUser), 'returnedUser must be a superset of newUser');
    assert.isDefined(returnedUser._id);
  });
  test('get user', async function() {
    const i1 = await poiService.createUser(newUser);
    const i2 = await poiService.getUser(i1._id);
    assert.deepEqual(i1, i2);
  });
  test('get invalid user', async function() {
    const i1 = await poiService.getUser('1234');
    assert.isNull(i1);
    const i2 = await poiService.getUser('012345678901234567890123');
    assert.isNull(i2);
  });
  test('delete an user', async function() {
    let user = await poiService.createUser(newUser);
    assert(user._id != null);
    await poiService.deleteOneUser(user._id);
    user = await poiService.getUser(user._id);
    assert(user == null);
  });
  test('delete user one from many', async function () {
    for (let i of users) {
      await poiService.createUser(i);
    }
    let user = await poiService.createUser(newUser);
    let allUsers = await poiService.getUsers();
    const amount = allUsers.length;
    await poiService.deleteOneUser(user._id);
    allUsers = await poiService.getUsers();
    const newAmount = allUsers.length;
    assert(newAmount === amount - 1);
  });
  test('get all users', async function() {
    await poiService.deleteAllUsers();
    await poiService.createUser(newUser);
    await poiService.authenticate(newUser);
    for (let u of users) {
      await poiService.createUser(u);
    }
    const allUsers = await poiService.getUsers();
    assert.equal(allUsers.length, users.length + 1);
  });
  test('get user detail', async function() {
    await poiService.deleteAllUsers();
    const user = await poiService.createUser(newUser);
    await poiService.authenticate(newUser);
    for (let i of users) {
      await poiService.createUser(i);
    }
    const testUser = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password
    };
    users.unshift(testUser);
    const allUsers = await poiService.getUsers();
    for (let i = 0; i < users.length; i++) {
      assert(_.some([allUsers[i]], users[i]), 'returnedUser must be a superset of newUser');
    }
  });
  test('get all users empty', async function() {
    await poiService.deleteAllUsers();
    const allUsers = await poiService.getUsers();
    assert.equal(allUsers.length, 0);
    await poiService.createUser(newUser);
    await poiService.authenticate(newUser);
    assert.notEqual(allUsers.length, 1);
  });
});

suite('Authentication API tests JWT', function () {

  let users = fixtures.users;
  let newUser = fixtures.newUser;
  let returnedUser;
  let response;

  suiteSetup(async function() {
    returnedUser = await poiService.createUser(newUser);
    response = await poiService.authenticate(newUser);
  });

  suiteTeardown(async function() {
    await poiService.deleteAllUsers();
    poiService.clearAuth();
  });

  test('authentication test', async function () {
    assert(response.success);
    assert.isDefined(response.token);
  });
  test('verify Token', async function () {
    const userInfo = utils.decodeToken(response.token);
    assert.equal(userInfo.email, returnedUser.email);
    assert.equal(userInfo.userId, returnedUser._id);
  });
});

suite('Categories API tests', function () {

  let categories = fixtures.categories;
  let newCategory = fixtures.newCategory;
  let newUser = fixtures.newUser;
  let response;
  let returnedUser;

  suiteSetup(async function() {
    //await poiService.deleteAllUsers();
    returnedUser = await poiService.createUser(newUser);
    response = await poiService.authenticate(newUser);
  });

  suiteTeardown(async function() {
    await poiService.deleteAllUsers();
    poiService.clearAuth();
  });

  setup(async function() {
    await poiService.deleteAllCategories();
  });

  teardown(async function() {
    await poiService.deleteAllCategories();
  });

  test('create new category', async function () {
    let returnedCategory = await poiService.createCategory(newCategory);
    console.log(returnedCategory);
    console.log(newCategory);
    assert(_.some([returnedCategory], newCategory), 'returnedUser must be a superset of newUser');
    assert.isDefined(returnedCategory._id);
  });
  test('get category', async function () {
    const i1 = await poiService.createCategory(newCategory);
    const i2 = await poiService.getCategory(i1._id);
    assert.deepEqual(i1, i2);
  });
  test('get invalid category', async function () {
    const i1 = await poiService.getCategory('1234');
    assert.isNull(i1);
    const i2 = await poiService.getCategory('012345678901234567890123');
    assert.isNull(i2);
  });
  test('delete Category', async function () {
    let category = await poiService.createCategory(newCategory);
    assert(category._id != null);
    await poiService.deleteOneCategory(category._id);
    category = await poiService.getCategory(category._id);
    assert(category == null);
  });
  test('delete category one from many', async function () {
    for (let i of categories) {
    await poiService.createCategory(i);
    }
    let category = await poiService.createCategory(newCategory);
    let allCategories = await poiService.getCategories();
    const amount = allCategories.length;
    await poiService.deleteOneCategory(category._id);
    allCategories = await poiService.getCategories();
    const newAmount = allCategories.length;
    assert(newAmount === amount - 1);
  });
  test('get all categories', async function () {
    for (let i of categories) {
      await poiService.createCategory(i);
    }
    const allCategories = await poiService.getCategories();
    assert.equal(allCategories.length, categories.length);
  });
  test('get category details', async function () {
    for (let i of categories) {
      await poiService.createCategory(i);
    }
    const allCategories = await poiService.getCategories();
    for (let i = 0; i < categories.length; i++) {
      assert(_.some([allCategories[i]], categories[i]), 'returnedCategories must be a superset of newCategories');
    }
  });
  test('get all categories empty', async function () {
    const allCategories = await poiService.getCategories();
    assert.equal(allCategories.length, 0);
  });

});