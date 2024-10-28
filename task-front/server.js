const http = require('http');
const fs = require('fs');
const path = require('path');

const verArchivo = (req, res) => {
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);

    // Detección del tipo de contenido
    const extname = path.extname(filePath);
    let contentType = 'text/html';

    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.gif':
            contentType = 'image/gif';
            break;
        case '.svg':
            contentType = 'image/svg+xml';
            break;
        case '.wav':
            contentType = 'audio/wav';
            break;
    }

    // Lee y sirve el archivo
    fs.readFile(filePath, (error, contenido) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - Not Found</h1>');
            } else {
                res.writeHead(500);
                res.end('Error loading the file');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(contenido, 'utf-8');
        }
    });
};

const server = http.createServer(verArchivo);

server.listen(8888, () => console.log('Server running on http://localhost:8888 👌'));
