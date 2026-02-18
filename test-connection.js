// Save as test-connection.js
const http = require('http');

// Test backend
console.log('Testing backend connection...');
http.get('http://localhost:3001/api/projects', (res) => {
  console.log(`Backend status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const projects = JSON.parse(data);
      console.log(`✅ Backend is working! Found ${projects.length} projects`);
    } catch (e) {
      console.log('❌ Backend returned invalid JSON');
    }
  });
}).on('error', (err) => {
  console.log('❌ Backend connection failed:', err.message);
});

// Test frontend
console.log('\nTesting frontend connection...');
http.get('http://localhost:5173', (res) => {
  console.log(`Frontend status: ${res.statusCode}`);
  console.log('✅ Frontend is running!');
}).on('error', (err) => {
  console.log('❌ Frontend connection failed:', err.message);
});


// node test-connection.js  - run this to do test