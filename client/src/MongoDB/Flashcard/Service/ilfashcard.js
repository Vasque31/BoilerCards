export class FlascardDBService {
    constructor() {
      
    }
  async Createfolder(client,newListing){
      const result = await client.db("Flashcard").collection("Folder").insertOne(newListing);
      console.log(`New listing created with the following id: ${result.insertedId}`);
      return result;
  }
  async CreateSet(client,newListing){
    const result = await client.db("Flashcard").collection("Flashcardset").insertOne(newListing);
    console.log(`New listing created with the following id: ${result.insertedId}`);
    
    return result;
  }
  async CreateFlashcard(client,newListing){
    const result = await client.db("Flashcard").collection("Flashcard").insertOne(newListing);
    console.log(`New listing created with the following id: ${result.insertedId}`);
    return result;
  }
}