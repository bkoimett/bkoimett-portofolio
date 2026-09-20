const { GridFSBucket } = require('mongodb');
const mongoose = require('mongoose');

const gridfs = {
  getBucket() {
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database not connected');
    }
    return new GridFSBucket(db, { bucketName: 'cvs' });
  },
};

module.exports = gridfs;