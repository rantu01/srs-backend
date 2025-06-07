const fs = require('fs');
const key = fs.readFileSync("./service-review-system-a0858-firebase-adminsdk-fbsvc-5949a9ed08.json")
const base64 = Buffer.from(key).toString('base64')
console.log(base64)