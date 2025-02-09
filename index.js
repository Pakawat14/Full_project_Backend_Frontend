const express = require('express');
const cors = require('cors'); // แก้ไขชื่อตัวแปรจาก core เป็น cors
const app = express();
const apiRouter = require('./routes/api'); // แก้ไข requie -> require
const https = require('https'); // เปลี่ยนจาก http -> https เพราะใช้งาน SSL
const { swaggerSpecs, swaggerUi, swaggerUI } = require('./swagger');
const cookieParser = require('cookie-parser');
const fs = require('fs');

app.use(express.json());
app.use(cors({
    origin: true,
    credentials: true,
}));
app.use(cookieParser());
app.use('/api/v1', apiRouter);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpecs));

const ssl_options = {
    key: fs.readFileSync('./ssl/key.pem'),
    cert: fs.readFileSync('./ssl/cert.pem'),
};

const port = 8800;
const secure_port = 8443;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

https.createServer(ssl_options, app).listen(secure_port, () => {
    console.log(`HTTPS Server listening on port ${secure_port}`);
});
