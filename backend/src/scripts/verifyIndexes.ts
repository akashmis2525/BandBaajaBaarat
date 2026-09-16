import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../config/db';
import '../models';

async function main() {
  await connectDatabase();
  const collections = mongoose.connection.collections;
  for (const [name, collection] of Object.entries(collections)) {
    const indexes = await collection.indexes();
    console.log(`\n${name}`);
    for (const index of indexes) {
      const keys = JSON.stringify(index.key);
      const flags = [
        index.unique ? 'unique' : '',
        index.expireAfterSeconds !== undefined ? `ttl=${index.expireAfterSeconds}` : '',
        index['2dsphereIndexVersion'] ? '2dsphere' : '',
      ]
        .filter(Boolean)
        .join(', ');
      console.log(`  ${index.name} ${keys}${flags ? ` (${flags})` : ''}`);
    }
  }
  await disconnectDatabase();
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : 'Index verification failed');
  process.exit(1);
});
