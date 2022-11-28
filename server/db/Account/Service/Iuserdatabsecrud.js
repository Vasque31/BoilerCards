class userDBService {
  constructor() {}
  async AddAsync(client, newListing) {
    const result = await client
      .db("User")
      .collection("Userdata")
      .insertOne(newListing);
    console.log(
      `New listing created with the following id: ${result.insertedId}`
    );
    return result;
  }
  async createTeacherAccount(client, newListing) {
    const result = await client
      .db("User")
      .collection("TeacherData")
      .insertOne(newListing);
    console.log(
      `New listing created with the following id: ${result.insertedId}`
    );
    return result;
  }

  async AddScore(client, newListing) {
    const result = await client
      .db("User")
      .collection("Score")
      .insertOne(newListing);
    console.log(
      `New listing created with the following id: ${result.insertedId}`
    );
    return result;
  }
  async GetScore(client, id) {
    const result = await client
      .db("Flashcard")
      .collection("Label")
      .findOne({ _id: id });
    /*const json = JSON.stringify(result);
    const obj = JSON.parse(json);*/
    if (result) {
      /*console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
        console.log(result);*/
      return result;
    } else {
      //console.log(`No listings found with the name '${nameOfListing}'`);
      return false;
    }
  }
  async GetClass(client, id) {
    const result = await client
      .db("Flashcard")
      .collection("Label")
      .findOne({ classCode: id });
    /*const json = JSON.stringify(result);
    const obj = JSON.parse(json);*/
    if (result) {
      /*console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
        console.log(result);*/
      return result;
    } else {
      //console.log(`No listings found with the name '${nameOfListing}'`);
      return false;
    }
  }
  async AddLogAsync(client, newListing) {
    const result = await client
      .db("User")
      .collection("Userlog")
      .insertOne(newListing);
    console.log(
      `New listing created with the following id: ${result.insertedId}`
    );
  }
  async AddClass(client, newListing) {
    const result = client.db("User").collection("Class").insertOne(newListing);
  }
  async Addverification(client, newListing) {
    const result = await client
      .db("User")
      .collection("Verification code")
      .insertOne(newListing);
    console.log(
      `New listing created with the following id: ${result.insertedId}`
    );
  }
  async Updateverification(client, nameOfListing, updatedListing) {
    const result = await client
      .db("User")
      .collection("Verification")
      .updateOne({ _id: nameOfListing }, { $set: updatedListing });
    console.log(
      `${result.matchedCount} document(s) matched the query criteria.`
    );
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
  }
  async Getverificationcode(client, nameOfListing) {
    const result = await client
      .db("User")
      .collection("Verification")
      .findOne({ _id: nameOfListing });
    /*const json = JSON.stringify(result);
  const obj = JSON.parse(json);*/
    if (result) {
      /*console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
      console.log(result);*/
      return result;
    } else {
      //console.log(`No listings found with the name '${nameOfListing}'`);
      return false;
    }
  }
  async UpdateAsync(client, nameOfListing, updatedListing) {
    const result = await client
      .db("User")
      .collection("Userdata")
      .updateOne({ username: nameOfListing }, { $set: updatedListing });
    console.log(
      `${result.matchedCount} document(s) matched the query criteria.`
    );
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
  }
  async GetAsync(client, nameOfListing) {
    const result = await client
      .db("User")
      .collection("Userdata")
      .findOne({ username: nameOfListing });
    /*const json = JSON.stringify(result);
  const obj = JSON.parse(json);*/
    if (result) {
      /*console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
      console.log(result);*/
      return result;
    } else {
      //console.log(`No listings found with the name '${nameOfListing}'`);
      return false;
    }
  }
  async GetTeacher(client, nameOfListing) {
    const result = await client
      .db("User")
      .collection("TeacherData")
      .findOne({ username: nameOfListing });
    /*const json = JSON.stringify(result);
  const obj = JSON.parse(json);*/
    if (result) {
      /*console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
      console.log(result);*/
      return result;
    } else {
      //console.log(`No listings found with the name '${nameOfListing}'`);
      return false;
    }
  }
  async GetEmailAsync(client, nameOfListing) {
    const result = await client
      .db("User")
      .collection("Userdata")
      .findOne({ email: nameOfListing });
    /*const json = JSON.stringify(result);
  const obj = JSON.parse(json);*/
    if (result) {
      /*console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
      console.log(result);*/
      return result;
    } else {
      //console.log(`No listings found with the name '${nameOfListing}'`);
      return false;
    }
  }
  async GetAsyncbyid(client, nameOfListing) {
    const result = await client
      .db("User")
      .collection("Userdata")
      .findOne({ _id: nameOfListing });
    /*const json = JSON.stringify(result);
  const obj = JSON.parse(json);*/
    if (result) {
      /*console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
      console.log(result);*/
      return result;
    } else {
      //console.log(`No listings found with the name '${nameOfListing}'`);
      return false;
    }
  }
  async UpdateTeacher(client, nameOfListing, updatedListing) {
    const result = await client
      .db("User")
      .collection("TeacherData")
      .updateOne({ username: nameOfListing }, { $set: updatedListing });
    console.log(
      `${result.matchedCount} document(s) matched the query criteria.`
    );
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
  }
  async UpdateUser(client, nameOfListing, updatedListing) {
    const result = await client
      .db("User")
      .collection("Userdata")
      .updateOne({ _id: nameOfListing }, { $set: updatedListing });
    console.log(
      `${result.matchedCount} document(s) matched the query criteria.`
    );
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
  }
  async UpdateClass(client, nameOfListing, updatedListing) {
    const result = await client
      .db("User")
      .collection("Class")
      .updateOne({ classCode: nameOfListing }, { $set: updatedListing });
    console.log(
      `${result.matchedCount} document(s) matched the query criteria.`
    );
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
  }
}
exports.userDBService = userDBService;
