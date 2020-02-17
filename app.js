const express = require('express');
const cors = require('cors');

const server = express();
server.use(cors());
server.use(express.json());


let posts  = [];
let nextPostId = 1;

const ERR_NOT_FOUND = 'error.not_found';
const ERR_BAD_REQUEST = 'error.bad_request';

server.get('/api/posts', (req, res) => {
    res.send(posts);
});

server.get('/api/posts/:id', (req, res) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        res.statusCode = 400;
        res.send({error: ERR_BAD_REQUEST});
        return;
    }
    
    const result = posts.find(p => p.id === id);

    if (result === undefined) {
        res.statusCode = 404;
        res.send({error: ERR_NOT_FOUND});
        return;
    }

    res.send(result);
});

server.post('/api/posts', (req, res) => {
    const post = req.body;
    const id = Number(post.id);

    if (isNaN(id) || !post.title) {
        res.statusCode = 400;
        res.send({error: ERR_BAD_REQUEST});
        return;
    }

    if (id === 0) {
        posts = [...posts, { id: nextPostId, title: post.title }];
        nextPostId++;
        res.statusCode = 201;
        res.send();
        return;
    }

    posts = posts.map(p => {
        if (p.id === id) {
            return {...p, title: post.title};
        }
        return p;
    });
    res.send();
});

server.delete('/api/posts/:id', (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.statusCode = 400;
        res.send({error: ERR_BAD_REQUEST});
        return;
    }
    posts = posts.filter(p => p.id !== id);
    res.send();
});

server.listen(process.env.PORT || 9999);
