# API Syntactic Extractor Service (ASE)

## Overview

The API Syntactic Extractor Service (ASE) is a software implementation of the ASE algorithm, an integral component of the "Agape" approach. Developed in the System of Systems domain, the Agape approach outlines foundational algorithms and methodologies, with the ASE algorithm being a central element. By translating this algorithm into a tangible service, the ASE provides a practical embodiment of the theoretical concepts presented.

The ASE service's primary role is to validate 3 API contracts and meticulously extract key information from description files adhering to OpenAPI standards. Adhering to the guidelines set by the ASE algorithm, the service efficiently captures the specifics of each API—paths, components, definitions, endpoints, methods, fields, and both input and output parameters. These are then organized into a clear JSON format, segmented by API names, requests, and responses.

## Implementation Details

Constructed using JavaScript, the ASE service is a lightweight, dynamic, and web-compatible solution. The choice of language complements the ASE algorithm's versatility and caters to the overarching requirements of the System of Systems context, as described within the Agape approach.

## Algorithm

The ASE's core is based on the algorithm described below.

<img src="/images/ase_algorithm.png" height="300"/>

## Setup

Use the package manager [npm](https://www.npmjs.com) to install the ASE.

```bash
npm install
```

## Usage

Before you start the ASE, be sure to start it.

```bash
npm start
```

Access the ASE from the GraphQL endpoint:

```bash
http://localhost:4001/graphql
```

**Note**:

- The default PORT is _4001_, but can be change for your convenience.
- This project heavily relies on GraphQL, a powerful query language for APIs, and a server-side runtime for executing those queries with your existing data. If you're unfamiliar with GraphQL or wish to dive deeper, you can [learn more about GraphQL here](https://graphql.org/).

## References

- **Agape Approach**: As the Agape approach is being validated through conferences and journals, updates will be periodically provided here. Once the validation process concludes and findings are published, a direct link to the paper will be shared in this section for easy accessibility.

## Project Status

The ASE, currently in the evolutionary phase, functions as a proof of concept. It is actively undergoing improvements and changes to refine its capabilities and more effectively meet new requirements.

## Author

**Marcos Borges**  
PhD Student at Federal University of Ceará, Brazil  
Email: [marcos.borges@alu.ufc.br](mailto:marcos.borges@alu.ufc.br)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
