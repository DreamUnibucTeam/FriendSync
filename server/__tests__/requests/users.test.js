const httpMocks = require("node-mocks-http");
const { db } = require("../../firebase/firebase.admin");
require("dotenv").config();
const UserController =
  require("../../controllers/user.controller").getInstance();

describe("User Controller", () => {
  let req, res, admin1, admin2;

  beforeEach(() => {
    res = httpMocks.createResponse();
    admin1 = process.env.ADMIN_1_UID;
    admin2 = process.env.ADMIN_2_UID;
  });

  it("should update a user's location", async () => {
    const latitude = Math.random() * 90;
    const longitude = Math.random() * 180;

    req = httpMocks.createRequest({
      method: "PUT",
      url: `/api/users/user/${admin1}`,
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        uid: admin1,
      },
      body: {
        latitude,
        longitude,
      },
      user: {
        uid: admin1,
      },
    });

    /* Test the request function */
    await UserController.updateLocation(req, res);

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
      "Succesfully updated user's location"
    );

    /* Check the coordonates from the database after update */
    const adminSnapshot = await db.collection("users").doc(admin1).get();
    expect(adminSnapshot.exists).toBeTruthy();

    const data = adminSnapshot.data();

    expect(data.location).toBeDefined();
    expect(data.location).toEqual({ longitude, latitude });
  });

  it("should send a friend request to another user and reject it", async () => {
    req = httpMocks.createRequest({
      method: "POST",
      url: `/api/users/friendRequests`,
      headers: {
        "Content-Type": "application/json",
      },
      params: {},
      body: {
        fromUid: admin1,
        toUid: admin2,
      },
      user: {
        uid: admin1,
      },
    });

    /* Test the request function */
    await UserController.sendFriendRequest(req, res);

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
      "Friend request has been successfully sent"
    );

    /* Test if the friend request has been added */
    let friendRequestQuery = await db
      .collection("friendRequests")
      .where("fromUid", "==", admin1)
      .where("toUid", "==", admin2)
      .get();

    expect(friendRequestQuery.empty).toBeFalsy();
    expect(friendRequestQuery.size).toEqual(1);

    /* Reject the friend request */
    let requestId = null;
    friendRequestQuery.forEach((fr) => (requestId = fr.id));

    req = httpMocks.createRequest({
      method: "DELETE",
      url: `/api/users/friendRequests/${requestId}`,
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        id: requestId,
      },
      body: {},
      user: {
        uid: admin1,
      },
    });
    res = httpMocks.createResponse();

    /* Test the request */
    await UserController.rejectFriendRequest(req, res);

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
      "Friend request has been rejected successfully"
    );

    /* Test if the friend request has been removed from the database */
    friendRequestQuery = await db
      .collection("friendRequests")
      .where("fromUid", "==", admin1)
      .where("toUid", "==", admin2)
      .get();

    expect(friendRequestQuery.empty).toBeTruthy();
    expect(friendRequestQuery.size).toEqual(0);
  });

  it("should send a friend request to another user and accept it", async () => {
    req = httpMocks.createRequest({
      method: "POST",
      url: `/api/users/friendRequests`,
      headers: {
        "Content-Type": "application/json",
      },
      params: {},
      body: {
        fromUid: admin1,
        toUid: admin2,
      },
      user: {
        uid: admin2,
      },
    });

    /* Test the request function */
    await UserController.sendFriendRequest(req, res);

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
      "Friend request has been successfully sent"
    );

    /* Test if the friend request has been added */
    let friendRequestQuery = await db
      .collection("friendRequests")
      .where("fromUid", "==", admin1)
      .where("toUid", "==", admin2)
      .get();

    expect(friendRequestQuery.empty).toBeFalsy();
    expect(friendRequestQuery.size).toEqual(1);

    /* Reject the friend request */
    let requestId = null;
    friendRequestQuery.forEach((fr) => (requestId = fr.id));

    req = httpMocks.createRequest({
      method: "POST",
      url: `/api/users/friendRequests/${requestId}`,
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        id: requestId,
      },
      body: {
        uid1: admin1,
        uid2: admin2,
      },
      user: {
        uid: admin2,
      },
    });
    res = httpMocks.createResponse();

    /* Test the request */
    await UserController.acceptFriendRequest(req, res);

    expect(res).toBeDefined();
    expect(res).not.toBeUndefined();
    expect(res).not.toBeNull();
    expect(res._getStatusCode()).toBe(200);
    expect(res._getStatusMessage()).toBe("OK");
    expect(res._isUTF8()).toBeTruthy();
    expect(res._getJSONData()).toBeDefined();
    expect(res._getJSONData()).not.toBeUndefined();
    expect(res._getJSONData()).not.toBeNull();
    expect(res._getJSONData().message).toEqual("New friendship has been made");

    /* Test if the friend request has been removed from the database */
    friendRequestQuery = await db
      .collection("friendRequests")
      .where("fromUid", "==", admin1)
      .where("toUid", "==", admin2)
      .get();

    expect(friendRequestQuery.empty).toBeTruthy();
    expect(friendRequestQuery.size).toEqual(0);

    /* Test if the friendship has been added to the database */
    const friendshipQuery = await db
      .collection("friendships")
      .where("uid1", "==", admin1)
      .where("uid2", "==", admin2)
      .get();

    expect(friendshipQuery.empty).toBeFalsy();
    expect(friendshipQuery.size).toEqual(1);
  });

  it("should remove the newly made friend request between two users", async () => {
    let friendshipQuery = await db
      .collection("friendships")
      .where("uid1", "==", admin1)
      .where("uid2", "==", admin2)
      .get();

    expect(friendshipQuery.empty).toBeFalsy();
    expect(friendshipQuery.size).toEqual(1);

    let friendshipId = null;
    friendshipQuery.forEach((friendship) => (friendshipId = friendship.id));

    req = httpMocks.createRequest({
      method: "DELETE",
      url: `/api/users/friendships/${friendshipId}`,
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        id: friendshipId,
      },
      body: {},
      user: {
        uid: admin1,
      },
    });

    /* Test the request function */
    await UserController.deleteFriendship(req, res);

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
      "Friend has been remove successfully"
    );

    /* Test if the friend has been deleted */
    friendshipQuery = await db
      .collection("friendships")
      .where("uid1", "==", admin1)
      .where("uid2", "==", admin2)
      .get();

    expect(friendshipQuery.empty).toBeTruthy();
    expect(friendshipQuery.size).toEqual(0);
  });
});
