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
  async  UpdateUser(client, nameOfListing, updatedListing){
    const result = await client.db("User").collection("Userdata")
                        .updateOne({ _id: nameOfListing }, { $set: updatedListing });
    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
  }
}
exports.userDBService = userDBService;
