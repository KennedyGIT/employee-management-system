/*
   GROUP 8
   MBANO KENNEDY - 8826852
   ASHITKUMAR JASOLIYA - 8871074
   HINAL VAGHELA - 8873133

   GROUP RESPONSIBILITY
   GRAPHQL API (Including Resolver, schema, models and dbinit file) - KENNEDY
   EMPLOYEE DIRECTORY AND EMPLOYEE TABLE COMPONENTS - ASHITKUMAR
   CREATE EMPLOYEE AND SEARCH EMPLOYEE COMPONENTTS - HINAL


 */

const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./schema/schema");
const resolvers = require("./resolvers/resolver");
const db = require("./db/dbinit");
const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

async function startApolloServer() {
  await server.start();
  server.applyMiddleware({ app });
}

startApolloServer();

app.listen({ port: 4200 }, () =>
  console.log(`Server listening on http://localhost:4200${server.graphqlPath}`)
);
