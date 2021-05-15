const httpMocks = require("node-mocks-http");
const { db } = require("../../firebase/firebase.admin");
require("dotenv").config();
const GroupController =
  require("../../controllers/group.controller").getInstance();
const UserController =
  require("../../controllers/user.controller").getInstance();

describe("Group Controller", () => {
  let req, res, admin1, admin2;

  beforeEach(() => {
    res = httpMocks.createResponse();
    admin1 = process.env.ADMIN_1_UID;
    admin2 = process.env.ADMIN_2_UID;
  });

  it("should create a new group", async () => {
    req = httpMocks.createRequest({
      method: "POST",
      url: `/api/groups/group`,
      headers: {
        "Content-Type": "application/json",
      },
      params: {},
      body: {
        uid: admin1,
        name: "Test Group",
      },
      user: {
        uid: admin1,
      },
    });

    /* Test the request */
    await GroupController.createGroup(req, res);

    expect(res).toBeDefined();
    expect(res).not.toBeUndefined();
    expect(res).not.toBeNull();
    expect(res._getStatusCode()).toBe(200);
    expect(res._getStatusMessage()).toBe("OK");
    expect(res._isUTF8()).toBeTruthy();
    expect(res._getJSONData()).toBeDefined();
    expect(res._getJSONData()).not.toBeUndefined();
    expect(res._getJSONData()).not.toBeNull();
    expect(res._getJSONData().message).toEqual(
      "Group has been created successfully"
    );

    /* Test if the group has been added */
    const groupSnapshot = await db
      .collection("groups")
      .where("owner", "==", admin1)
      .where("name", "==", "Test Group")
      .get();

    expect(groupSnapshot.empty).toBeFalsy();
    expect(groupSnapshot.size).toBe(1);

    let groupId = null;
    groupSnapshot.forEach((group) => (groupId = group.id));

    /* Test if the admin belongs to belongsTo */
    const belongsToQuery = await db
      .collection("belongsTo")
      .where("groupId", "==", groupId)
      .where("userUid", "==", admin1)
      .where("isAdmin", "==", true)
      .get();

    expect(belongsToQuery.empty).toBeFalsy();
    expect(belongsToQuery.size).toBe(1);
  });

  it("should fail to add a user to group if the user who is adding is not the admin", async () => {
    /* Test if the group exists */
    let groupSnapshot = await db
      .collection("groups")
      .where("owner", "==", admin1)
      .where("name", "==", "Test Group")
      .get();

    expect(groupSnapshot.empty).toBeFalsy();
    expect(groupSnapshot.size).toBe(1);

    let groupId = null;
    groupSnapshot.forEach((group) => (groupId = group.id));

    req = httpMocks.createRequest({
      method: "POST",
      url: `/api/users/belongsTo`,
      headers: {
        "Content-Type": "application/json",
      },
      params: {},
      body: {
        adminUid: admin2,
        userUid: admin2,
        groupId,
      },
      user: {
        uid: admin2,
      },
    });

    /* Test the request */
    await UserController.addToGroup(req, res);

    expect(res).toBeDefined();
    expect(res).not.toBeUndefined();
    expect(res).not.toBeNull();
    expect(res._getStatusCode()).toBe(500);
    expect(res._isUTF8()).toBeTruthy();
    expect(res._getJSONData()).toBeDefined();
    expect(res._getJSONData()).not.toBeUndefined();
    expect(res._getJSONData()).not.toBeNull();
    expect(res._getJSONData().message).toEqual(
      "You are not the admin of the group"
    );

    /* Test if the user has been added */
    const belongsToQuery = await db
      .collection("belongsTo")
      .where("groupId", "==", groupId)
      .where("userUid", "==", admin2)
      .get();

    expect(belongsToQuery.empty).toBeTruthy();
    expect(belongsToQuery.size).toBe(0);
  });

  it("should add a user to the newly created group", async () => {
    /* Test if the group exists */
    let groupSnapshot = await db
      .collection("groups")
      .where("owner", "==", admin1)
      .where("name", "==", "Test Group")
      .get();

    expect(groupSnapshot.empty).toBeFalsy();
    expect(groupSnapshot.size).toBe(1);

    let groupId = null;
    groupSnapshot.forEach((group) => (groupId = group.id));

    req = httpMocks.createRequest({
      method: "POST",
      url: `/api/users/belongsTo`,
      headers: {
        "Content-Type": "application/json",
      },
      params: {},
      body: {
        adminUid: admin1,
        userUid: admin2,
        groupId,
      },
      user: {
        uid: admin1,
      },
    });

    /* Test the request */
    await UserController.addToGroup(req, res);

    expect(res).toBeDefined();
    expect(res).not.toBeUndefined();
    expect(res).not.toBeNull();
    expect(res._getStatusCode()).toBe(200);
    expect(res._getStatusMessage()).toBe("OK");
    expect(res._isUTF8()).toBeTruthy();
    expect(res._getJSONData()).toBeDefined();
    expect(res._getJSONData()).not.toBeUndefined();
    expect(res._getJSONData()).not.toBeNull();
    expect(res._getJSONData().message).toEqual("User added to group");

    /* Test if the user has been added */
    const belongsToQuery = await db
      .collection("belongsTo")
      .where("groupId", "==", groupId)
      .where("userUid", "==", admin2)
      .get();

    expect(belongsToQuery.empty).toBeFalsy();
    expect(belongsToQuery.size).toBe(1);
  });

  it("should delete the newly created group", async () => {
    /* Test if the group exists */
    let groupSnapshot = await db
      .collection("groups")
      .where("owner", "==", admin1)
      .where("name", "==", "Test Group")
      .get();

    expect(groupSnapshot.empty).toBeFalsy();
    expect(groupSnapshot.size).toBe(1);

    let groupId = null;
    groupSnapshot.forEach((group) => (groupId = group.id));

    req = httpMocks.createRequest({
      method: "DELETE",
      url: `/api/groups/group/${groupId}`,
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        id: groupId,
      },
      body: {
        uid: admin1,
      },
      user: {
        uid: admin1,
      },
    });

    /* Test the request */
    await GroupController.removeGroup(req, res);

    expect(res).toBeDefined();
    expect(res).not.toBeUndefined();
    expect(res).not.toBeNull();
    expect(res._getStatusCode()).toBe(200);
    expect(res._getStatusMessage()).toBe("OK");
    expect(res._isUTF8()).toBeTruthy();
    expect(res._getJSONData()).toBeDefined();
    expect(res._getJSONData()).not.toBeUndefined();
    expect(res._getJSONData()).not.toBeNull();
    expect(res._getJSONData().message).toEqual(
      "The group has been successfully deleted"
    );

    /* Test is the group has been removed */
    groupSnapshot = await db.collection("groups").doc(groupId).get();

    expect(groupSnapshot.exists).toBeFalsy();

    /* Test if the belongsTo relations have been removed */
    const belongsToQuery = await db
      .collection("belongsTo")
      .where("groupId", "==", groupId)
      .get();

    expect(belongsToQuery.empty).toBeTruthy();
    expect(belongsToQuery.size).toBe(0);
  });
});
