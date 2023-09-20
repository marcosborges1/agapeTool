import gql from 'graphql-tag';
import querySchema from "./query.js";

const typeDefs = gql`
	${querySchema}
`;

export default typeDefs

