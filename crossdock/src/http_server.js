// @flow
// Copyright (c) 2016 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import bodyParser from 'body-parser';
import express from 'express';
import Helpers from './helpers';

export default class HttpServer {
    constructor() {
        let app = express();
        this._helpers = new Helpers();

        // json responses need bodyParser when working with express
        app.use(bodyParser.json());

        app.post('/start_trace', (req, res) => {
            let startRequest: boolean = true;
            let traceRequest = req.body;
            let headers = req.headers;
            let promise = this._helpers.handleRequest(
                startRequest,
                'start_trace#',
                traceRequest,
                headers
            );
            promise.then((response) => {
                let traceResponse = JSON.stringify(response);
                res.send(traceResponse);
            });
        });

        app.post('/join_trace', (req, res) => {
            let startRequest: boolean = false;
            let traceRequest = req.body;
            let headers = req.headers;
            let promise = this._helpers.handleRequest(
                startRequest,
                'join_trace#',
                traceRequest,
                headers
            );
            promise.then((response) => {
                let traceResponse = JSON.stringify(response);
                res.send(traceResponse);
            });
        });

        app.listen(8081, () => {
            console.log('HTTP server listening on port 8081...');
        });
    }
}

if ((require: any).main === module) {
    let http = new HttpServer();
}
