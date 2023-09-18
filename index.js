require('dotenv').config();
const express = require('express');
const { ApolloServer } = require("apollo-server-express");
const {
	ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");
const { buildSubgraphSchema } = require("@apollo/subgraph");

const typeDefs = require("./graphql/schemas");
const resolvers = require("./graphql/resolvers");

const app = express();

// Middleware to check the path and refuse connections other than /graphql
app.use((req, res, next) => {
	if (req.path !== '/graphql') {
		return res.status(403).send('Forbidden');
	}
	next();
});

const server = new ApolloServer({
	cors: true,
	typeDefs,
	resolvers,
	schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
	plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

// Ensure you start the ApolloServer before applying middleware
async function startServer() {
	await server.start();
	server.applyMiddleware({ app, path: '/graphql' });

	const PORT = process.env.PORT;
	app.listen({ port: PORT }, () => {
		console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
	});
}

startServer();