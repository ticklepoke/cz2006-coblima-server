# cz2006-coblima-server [![Build Status](http://35.240.188.10:8080/buildStatus/icon?job=coblima-server)](http://34.87.46.94:8080/job/coblima-server/)

Server repo for CZ2006 COBLIMA Project

## Development and Production Databases

Development and Production databases are hosted separately. The development database is hosted on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) while the production database is hosted via [KubeDB](https://kubedb.com/). Contact Nigel for access keys to each database instance.

## Linting

We will be using [StandardJS](https://standardjs.com/) for syntax styles and [CommonJS](https://requirejs.org/docs/commonjs.html) for modules style. Linting is enforced by [Husky](https://github.com/typicode/husky) and [lint staged](https://github.com/okonet/lint-staged).

## Continuous Deployment

Continuous Deployment is setup using Jenkins.
