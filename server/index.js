require('module-alias/register');

const schema = require('@server/src/schema');

const express = require('express');

const app = express();

schema.applyMiddleware({ app });

app.listen({ port: 3000 }, () => console.log(`🚀 Server ready at http://localhost:3000${schema.graphqlPath}`));
