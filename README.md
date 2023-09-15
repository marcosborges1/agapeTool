# API Syntactic Extractor Service (ASE)

## Overview

The API Syntactic Extractor Service (ASE) is a software implementation of the ASE algorithm, an integral component of the "Agape" approach. Developed in the System of Systems domain, the Agape approach outlines foundational algorithms and methodologies, with the ASE algorithm being a central element. By translating this algorithm into a tangible service, the ASE provides a practical embodiment of the theoretical concepts presented.

The ASE service's primary role is to validate 3 API contracts and meticulously extract key information from description files adhering to OpenAPI standards. Adhering to the guidelines set by the ASE algorithm, the service efficiently captures the specifics of each API—paths, components, definitions, endpoints, methods, fields, and both input and output parameters. These are then organized into a clear JSON format, segmented by API names, requests, and responses.

## Implementation Details

Constructed using JavaScript, the ASE service is a lightweight, dynamic, and web-compatible solution. The choice of language complements the ASE algorithm's versatility and caters to the overarching requirements of the System of Systems context, as described within the Agape approach.

## Project Status

Currently, the ASE serves as a proof of concept and is in an active phase of enhancement and evolution. Feedback and real-world applications are vital at this stage to refine its capabilities and to better align it with users' needs.

## Author

**Marcos Borges**  
PhD Student at Federal University of Ceará, Brazil  
Email: [marcos.borges@alu.ufc.br](mailto:marcos.borges@alu.ufc.br)

## Algorithm

The ASE's core is based on the algorithm described below.

<img src="/images/ase_algorithm.png" height="300"/>

## Setup

Use the package manager [npm](https://www.npmjs.com) to install micrographlgateway.

```bash
npm install
```

## Usage

Before you start registering the microservices below, be sure to start them.

```javascript
//Ommited Details
const server = new ApolloServer({
  cors: true,
  typeDefs,
  resolvers,
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

server.listen(process.env.PORT).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
//Ommited Details
```

**Note**: The default PORT is _4001_, but can be change for your convenience.

## Project Status

As it is a proof of concept, it is in a phase of improvement and evolution.

## Author

Marcos Borges

## References

- **_Agape Approach paper is still been validated_**: As the Agape approach undergoes validation in conferences and journals, further updates will be shared here. Once validated, a link to the respective paper will be made available in this section.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)

<!-- # MicroGraphQL - Api Similarity Analyzer Service

API Similarity Analyzer Service (ASAS) is a microservice that will analyze the similarities of requests and responses contained in OpenAPI description files.

<img src="https://github.com/marcosborges1/api-similarity-analyzer-service/blob/main/images/api_similarity.png" height="300"/>

## Note - Project Status

As it is a proof of concept, it is in a phase of improvement and evolution.

## Author

Marcos Borges

## Installation

Use the package manager [npm](https://www.npmjs.com) to install micrographlgateway.

```bash
npm install
```

## Usage

Before you start registering the microservices below, be sure to start them.

```javascript
//Ommited Details
const server = new ApolloServer({
	cors: true,
	typeDefs,
	resolvers,
	schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
	plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

server.listen(4001).then(({ url }) => {
	console.log(`Server ready at ${url}`);
});
//Ommited Details
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/) -->
