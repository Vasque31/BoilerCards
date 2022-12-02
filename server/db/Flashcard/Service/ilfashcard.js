class FlascardDBService {
  constructor() {}
  async Createfolder(client, newListing) {
    const result = await client
      .db("Flashcard")
      .collection("Folder")
      .insertOne(newListing);
    console.log(
      `New listing created with the following id: ${result.insertedId}`
    );
    return result;
  }
  async CreateSet(client, newListing) {
    const result = await client
      .db("Flashcard")
      .collection("Flashcardset")
      .insertOne(newListing);
    console.log(
      `New listing created with the following id: ${result.insertedId}`
    );

    return result;
  }
  async CreateFlashcard(client, newListing) {
    const result = await client
      .db("Flashcard")
      .collection("Flashcard")
      .insertOne(newListing);
    console.log(
      `New listing created with the following id: ${result.insertedId}`
    );
    return result;
  }
  async CreateLabel(client, newListing) {
    const result = await client
      .db("Flashcard")
      .collection("Label")
      .insertOne(newListing);
    console.log(
      `New listing created with the following id: ${result.insertedId}`
    );
    return result;
  }

  async GetLabel(client, id) {
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
  async UpdateLabel(client, nameOfListing, updatedListing) {
    const result = await client
      .db("Flashcard")
      .collection("Label")
      .updateOne({ _id: nameOfListing }, { $set: updatedListing });
    console.log(
      `${result.matchedCount} document(s) matched the query criteria.`
    );
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
  }
  async UpdateFolder(client, nameOfListing, updatedListing) {
    const result = await client
      .db("Flashcard")
      .collection("Folder")
      .updateOne({ _id: nameOfListing }, { $set: updatedListing });
    console.log(
      `${result.matchedCount} document(s) matched the query criteria.`
    );
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
  }
  async SearchSet(client, nameOfListing) {
    const result = await client
      .db("Flashcard")
      .collection("Flashcardset")
      .find({ setname: { $regex: ".*" + nameOfListing + ".*" } })
      .toArray();
    //console.log(result);
    if (result) {
      console.log(
        `Found ${result.length} results ` +
          "matched based on criteria " +
          "'" +
          nameOfListing +
          "'"
      );

      return result;
    } else {
      console.log(`no search result`);
      return false;
    }
  }
  async UpdateSet(client, nameOfListing, updatedListing) {
    const result = await client
      .db("Flashcard")
      .collection("Flashcardset")
      .updateOne({ _id: nameOfListing }, { $set: updatedListing });
    console.log(
      `${result.matchedCount} document(s) matched the query criteria.`
    );
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
  }
  async UpdateFlashcard(client, nameOfListing, updatedListing) {
    const result = await client
      .db("Flashcard")
      .collection("Flashcard")
      .updateOne({ _id: nameOfListing }, { $set: updatedListing });
    console.log(
      `${result.matchedCount} document(s) matched the query criteria.`
    );
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
  }
  async GetFolderasync(client, id) {
    const result = await client
      .db("Flashcard")
      .collection("Folder")
      .findOne({ _id: id });
    /*const json = JSON.stringify(result);
  const obj = JSON.parse(json);*/
    if (result) {
      console.log(
        `Found a listing in the collection with the name '${result.foldername}':`
      );
      return result;
    } else {
      console.log(`No listings found with the name '${id}'`);
      return false;
    }
  }
  async GetFlashcardasync(client, id) {
    const result = await client
      .db("Flashcard")
      .collection("Flashcard")
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
  async GetFlashcardsetasync(client, id) {
    const result = await client
      .db("Flashcard")
      .collection("Flashcardset")
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
  async deleteFlashcard(client, id) {
    const result = await client
      .db("Flashcard")
      .collection("Flashcard")
      .deleteOne({ _id: id });
    console.log(`${result.deletedCount} document(s) was/were deleted.`);
  }
  async deleteFlashcardFolder(client, id) {
    const result = await client
      .db("Flashcard")
      .collection("Folder")
      .deleteOne({ _id: id });
    console.log(`${result.deletedCount} document(s) was/were deleted.`);
  }
  async deleteSet(client, id) {
    const result = await client
      .db("Flashcard")
      .collection("Flashcardset")
      .deleteOne({ _id: id });
    console.log(`${result.deletedCount} document(s) was/were deleted.`);
  }
  async reportSet(client, set) {
    const result = await client
      .db("Flashcard")
      .collection("Flagged Set")
      .insertOne(set);
    console.log(`${result.deletedCount} document(s) was/were deleted.`);
  }
}
exports.FlascardDBService = FlascardDBService;
