import mongoose from "mongoose";

export const dropAllCollections = async () => {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    try {
      await collection.drop();
    } catch (error: any) {
      if (error.message === "ns not found") return;

      console.log(error.message);
    }
  }
};
