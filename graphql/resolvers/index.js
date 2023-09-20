import SwaggerParser from "@apidevtools/swagger-parser";
// import flatten from "flat";
import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import {
	getRequestsOpenAPI2,
	getRequestsOpenAPI3,
	getResponsesOpenAPI2,
	getResponsesOpenAPI3,
	wait,
	isValidAPI,
	adapateToJson,
	saveJson,
	sanitizeName,
	generateFilename
} from "../../utils/index.js";

console.log(path.resolve(__dirname, '../../'))
const projectRoot = path.resolve(__dirname, '../../');
const logsDir = path.join(projectRoot, 'logs');

const logger = winston.createLogger({
	level: 'info',
	format: winston.format.simple(),
	transports: [
		new winston.transports.File({ filename: path.join(logsDir, 'analysis.log') }),
		new winston.transports.File({ filename: path.join(logsDir, 'error.log'), level: 'error' }),
		new winston.transports.Console()
	]
});


const resolvers = {
	Query: {
		getExtractedApiList: async (_, { apiList }) => {
			let resultJson = [];
			let arrayJson = [];
			apiList.map(async (api, api_i) => {
				let parser = new SwaggerParser();
				if (isValidAPI(parser, api)) {
					const apiRef = await parser.dereference(api.path);

					//Validation if references are circulars
					if (parser.$refs.circular) {
						throw `The API '${api.name}' contains some circular reference. Please remove it to continue.`;
					}

					const apiBundle = await parser.bundle(api.path);
					const apiKeys = Object.keys(apiRef.paths);
					const apiValues = Object.values(apiRef.paths);

					let requests = [];
					let responses = [];

					apiValues.map(async (apiValue, i) => {

						["get", "post", "put"].map((method) => {

							if (apiRef.hasOwnProperty("openapi")) { // If is OpenAPI 3
								getRequestsOpenAPI3(apiValue, method, requests, apiKeys, i, apiBundle);
								getResponsesOpenAPI3(
									apiValue,
									method,
									responses,
									apiKeys,
									i,
									apiBundle
								);
							}
							else if (apiRef.hasOwnProperty("swagger")) { // If is OpenAPI 2
								getRequestsOpenAPI2(apiValue, method, requests, apiKeys, i, apiBundle);
								getResponsesOpenAPI2(
									apiValue,
									method,
									responses,
									apiKeys,
									i,
									apiBundle
								);
							}
						});
					});

					requests = adapateToJson(requests);
					responses = adapateToJson(responses);

					//Object Json
					resultJson = {
						name: api.name,
						requests,
						responses,
					};

					arrayJson.push(resultJson);


				} else {
					return {
						name: "Error! Any API is invalid!",
						requests: "Error! Any API is invalid!",
						responses: "Error! Any API is invalid!",
					};
				}
			});
			await wait(100);
			const name_i = arrayJson.map(res => {
				return sanitizeName(res.name)
			})
			logger.info(generateFilename(name_i.join("-")))
			const generatedExtractedFile = saveJson(`data/${name_i.join("-")}.json`, arrayJson, 4);

			return {
				"extractedApiList": arrayJson,
				generatedExtractedFile
			}

			// return arrayJson;
		}
	},
};

export default resolvers;
