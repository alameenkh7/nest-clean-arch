import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Sample data generation
function generateTags(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    id: `tag_${index + 1}`,
    name: `Tag ${index + 1}`,
    description: `Description for Tag ${index + 1}`,
    foreground: `#${Math.floor(Math.random()*16777215).toString(16)}`,
    background: `#${Math.floor(Math.random()*16777215).toString(16)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));
}

async function seedFirebase() {
  // Manually set environment variables
  process.env.FIREBASE_PROJECT_ID = 'graphql-93091';
  process.env.FIREBASE_CLIENT_EMAIL = 'firebase-adminsdk-fbsvc@graphql-93091.iam.gserviceaccount.com';
  process.env.FIREBASE_PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCcB5Q73NMXFs4+\nfx1QzuZf3oja4tqoBRQ11HH60sSobS4aUP662RhQq8tWzGcxCx4VKgge6kNlmMbH\nrFLI1jQ09tlZMVpXai7BahM/HLYXF2zdO1rFnUhtnnLetjuaXfr/vHnS5aSFxn+d\nWrFYk5C5QDamEdFKCJrrZZBc4cHRVuUTiCp7qMRHrUgVRgL//MtmKCS0BF8y9f0i\nR7++AWast/5cNibl1z1T+tJSu9ihALYAk4iTgHucVLOiRqU0hVTiVidim8xVm7p/\nzUMQ8K0NwpE9JwJ3bTphzMry6s9i0ln8qJ+k2Npv7N7bxjcNRqXFg6E4t1lHgvHR\nXFkmea0FAgMBAAECggEALkxHbX3oexzuxPemBMDn9gGL3VtcI2giZ5iq25Dn/swq\n1m87LslVYDahxxcu9YwFeKU4tKexqPds4HnfNK3u3tpygvdUhcTBq+2kWWFVHMP8\nLyc6F5JEmBZgonozdGo3nOPZyD0RFQrh+hibsBtVYcrOjHeUASJNidTgwdbRUqK9\n1Qqk3BFgKVVP49tSqN9c4d+7u7aIFUxy8MGeZDr/WJWBer/ik0jEsPDFVsejHwL5\nO8unYm0t093OokMhxVHWCWbnKVrqnMqqO75JdTiSrUP3lCkCSQkrmJrxSrwPnfG5\n+t6zbniD7UvlRg0ZkCO0oXYlUwYXf/xSkNq+7lpzLwKBgQDT/1B29iOea0w3tbS1\nSHK0mTXm7TogfsuS95vTVVD4K/x0jVrJqxkMViODBV9UKQ+vKQ2RmQvsyJDdbYw5\nr8K6T+L6xpuO6t9TNJmL9AO36wRMSM3os8wx8BcdYXZheE87S2BhzZPnJmdwhAvX\n+Hw2iCY8lEIwPEIKhNg7J1xZTwKBgQC8al1/UM6bvp8eHVkmpIXzvak0SScfNdqE\nbUM0t0nJ1frnaNrcEnLxxhPV7S00yG1LcbfvJP620d/HK+DW8loMTVaHIWTcoU4U\nXcbPjxzPrBQBCb7ZMU01GbtkhgsTxfaoVl+jHkxS3oYguE9KkxsA0l4+u8eEGb5C\nlaV4yHHXawKBgQCP3QED2cEOLo5Id/yr0QBWYmpbzbzWdHU9xN5wKcOKxn7JsWtc\n08lpv8LVlP2+JSdJnLhih9O52dnFCiRQuV+SA8hqmgDSmbz3wAg7G1qyosAF7Jof\nQnRdpypoe81UE8rg2CQN+u5VvJARoOpQo4XXk8ku7wWDqkC+1qvOaMWYrQKBgGbs\nU5awtawuPQ1eSszpIqM6/6soKs7JxEyCwyuQ1CYFVcIDbUq6aT/ZTAyYOxGSSuHj\nhO6F7v4/N1a9iVzhln8R4CqA+2/qTZSihW/sZXisL2FByZcrb1mKbOtErdhnU44x\nYJzieB7sn6hQBkBei2mvgPwT57Epvtzwkiugk09xAoGAJVirKC0B/bXZBiWtzNHh\nb8y6aX2QIsjD0kIvpaV7ClAh1S+yOWXAiqbPUY65+l6lG2xwd/nX2pmZ/tyUnAYd\nJ0xoF5WE12PFOMdILjJV9LUDi+PEGP5UFqMKnBib9WfcedKc/51HfWIs46dvEQmT\nlinHF2vJnECOWpy4nf0yrFs=\n-----END PRIVATE KEY-----\n';
  process.env.APP_NAME = 'RearwayGraphQL';
  process.env.APP_VERSION = '0.1.0';

  // Ensure all required environment variables are present
  const requiredEnvVars = [
    'FIREBASE_PROJECT_ID', 
    'FIREBASE_CLIENT_EMAIL', 
    'FIREBASE_PRIVATE_KEY',
    'APP_NAME',
    'APP_VERSION'
  ];

  console.log('Environment variables:', Object.keys(process.env));

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    console.error('Current environment:', JSON.stringify(process.env, null, 2));
    process.exit(1);
  }

  // Prepare Firebase credentials
  const firebaseCredentials: admin.ServiceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\n/g, '\n') || ''
  };

  // Initialize Firebase Admin
  try {
    if (!admin.apps.length) {
      console.log('Initializing Firebase Admin with credentials: %o', {
        projectId: firebaseCredentials.projectId,
        clientEmail: firebaseCredentials.clientEmail,
        privateKeyPresent: !!firebaseCredentials.privateKey
      });
      admin.initializeApp({
        credential: admin.credential.cert(firebaseCredentials)
      });
    }

    const firestore = admin.firestore();
    const tagsCollection = firestore.collection('tags');

    // Generate and add sample tags
    const sampleTags = generateTags(10); // Generate 10 sample tags

    // Batch write to avoid hitting Firestore write limits
    const batch = firestore.batch();
    sampleTags.forEach(tag => {
      const docRef = tagsCollection.doc(tag.id);
      batch.set(docRef, tag);
    });

    try {
      await batch.commit();
      console.log('Successfully seeded Firebase with 50 items');
    } catch (error) {
      console.error('Seeding Error:', error);
      process.exit(1);
    } finally {
      // Optional: Close Firebase app
      if (admin.apps.length) {
        admin.app().delete();
      }
    }
  } catch (error) {
    console.error('Initialization Error:', error);
    process.exit(1);
  }
}

// Run the seeding script
seedFirebase().catch((error) => {
  console.error('Seeding script failed:', error);
  process.exit(1);
});
