import gql from 'graphql-tag';

const querySchema = gql`
	scalar JSON
	input inputAPI {
		name: String
		path: String
	}
	type Query {
		getExtractedApiList(apiList: [inputAPI]): exApiList
	}

	type exApiList @key(fields: "generatedExtractedFile") {
		extractedApiList: [extractedApi]
		generatedExtractedFile: String
	}

	type extractedApi {
		name: String
		requests: JSON
		responses: JSON
	}
`;

export default querySchema;
