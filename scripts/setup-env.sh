#!/bin/bash

# Create .env.local file with Firebase configuration
cat > .env.local << EOF
VITE_FIREBASE_API_KEY=AIzaSyDazmoZ4hGks6Lw1E56wmp7F2rEivDjKwU
VITE_FIREBASE_AUTH_DOMAIN=mike-wolf.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mike-wolf
VITE_FIREBASE_STORAGE_BUCKET=mike-wolf.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=595993744223
VITE_FIREBASE_APP_ID=1:595993744223:web:9d992db48c10795c0a9cea
VITE_FIREBASE_MEASUREMENT_ID=G-JN7VTQKP24
EOF

echo "✅ Created .env.local with Firebase configuration"

