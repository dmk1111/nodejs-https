const http = require('http');
const https = require('https');
const redirectHttps = require('redirect-https');

function handler(req, res) {
    console.log('triggered');
    res.writeHead(200);
    res.end('Hello World!');
}

const PROD = false;
const lex = require('greenlock-express').create({
    version: 'draft-11',
    server: PROD ? 'https://acme-v02.api.letsencrypt.org/directory' : 'https://acme-staging-v02.api.letsencrypt.org/directory',
    approveDomains: (opts, certs, cb) => {
    if (certs) {
        // change domain list here
        opts.domains = ['example.com', 'yourdomain.com', 'localhost', '127.0.0.1']
    } else {
        // change default email to accept agreement
        opts.email = 'dimagolysh@gmail.com';
opts.agreeTos = true;
}
cb(null, { options: opts, certs: certs });
}
// optional: see "Note 3" at the end of the page
// communityMember: true
});
const middlewareWrapper = lex.middleware;


http.createServer(lex.middleware(redirectHttps())).listen(8080);

https.createServer(
    lex.httpsOptions,
    middlewareWrapper(handler)
).listen(8081);