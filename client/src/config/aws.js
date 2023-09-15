const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_ACCESS_KEY_SECRET,
    region: process.env.REACT_APP_AWS_REGION
});

module.exports = AWS;