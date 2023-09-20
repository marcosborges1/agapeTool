import dotenv from 'dotenv';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { buildSubgraphSchema } from '@apollo/subgraph';
import bodyParser from 'body-parser';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

dotenv.config()
import typeDefs from "./graphql/schemas/index.js";
import resolvers from "./graphql/resolvers/index.js";

const app = express();
const PORT = process.env.PORT;

const server = new ApolloServer({
	schema: buildSubgraphSchema({ typeDefs, resolvers }),
});
await server.start();

app.use(cors());
app.use('/data', express.static(path.join(dirname(fileURLToPath(import.meta.url)), 'data')));
app.use('/graphql', bodyParser.json(), expressMiddleware(server));
app.listen(PORT, () => {
	console.log(`🚀  Server ready at http://localhost:${PORT}/graphql`);
	console.log(`📂  Static files available at http://localhost:${PORT}/data`);
});