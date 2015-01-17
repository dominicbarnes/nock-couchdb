# nock-couchdb

> A nock helper library for mocking a CouchDB server

**NOTE:** this library is under heavy development right now, and is missing a
lot of features, but feel free to monitor the issues/milestones for progress
updates.

## Install

```sh
$ npm install nock-couchdb
```

## Usage

Most calls in this API use nock to add an interceptor for a given HTTP request
reflected by the server/database/document meta.

```js
var assert = require('assert');
var couchdb = require('nock-couchdb');
var supertest = require('supertest');

var url = 'http://localhost:5984/';
var server = couchdb.server(url);
var request = supertest(url);

describe('...', function () {
  it('...', function (done) {
    server
      .database('db')
      .document('doc')
      .get({ hello: 'world' }); // adds a nock interceptor
      
    request
      .get('doc/db')
      .expect(200)
      .expect(function (res) {
        assert.equal(res.body.hello, 'world');
      })
      .end(done);
  });
});
```

## Chainable API

### couchdb.server(href)

The top-level interface, which reflects a CouchDB server. The specified
`href` points to the CouchDB root. (default: `http://localhost:5984/`)

### server.database(name)

Part of the chainable interface, but reflects a specific database within
the parent server.

### database.document(id)

Part of the chainable interface, but reflects a specific document within
the parent database/server.

## Mock API

### server.info([data])

Parameter | Type | Description
--- | --- | ---
data | `Object` | Customizes the response body

Sets up a mock for the [server API root][1].

### database.info([data])

Parameter | Type | Description
--- | --- | ---
data | `Object` | Customizes the response body

Sets up a mock for the [database API root][2].

### document.get([data])

Parameter | Type | Description
--- | --- | ---
data | `Object` | Customizes the response body

Sets up a mock for [retrieving the document][3].

[1]: http://docs.couchdb.org/en/1.6.1/api/server/common.html#get--
[2]: http://docs.couchdb.org/en/1.6.1/api/database/common.html#get--db
[3]: http://docs.couchdb.org/en/1.6.1/api/document/common.html#get--db-docid
