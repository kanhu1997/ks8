const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('"Deployment in the development environment on Kubernetes is managed using Jenkins CI/CD."!');
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
