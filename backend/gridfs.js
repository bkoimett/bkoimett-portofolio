const { GridFSBucket } = require('mongodb');
const mongoose = require('mongoose');

const gridfs = {
  getBucket(bucketName = 'cvs') {
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database not connected');
    }
    return new GridFSBucket(db, { bucketName });
  },
  getImageBucket() {
    return this.getBucket('images');
  },
};

module.exports = gridfs;