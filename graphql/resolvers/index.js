const SwaggerParser = require("@apidevtools/swagger-parser");
const flatten = require("flat");
const winston = require('winston');
const path = require('path');

const {
	getNewRequestsAPI,
	getNewResponseAPI,
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
} = require("../../utils");


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
			name_i = arrayJson.map(res => {
				return sanitizeName(res.name)
			})
			logger.info(generateFilename(name_i.join("-")))
			fileGenerated = saveJson(`data/${name_i.join("-")}.json`, arrayJson, 4);

			return {
				"extractedApiList": arrayJson,
				fileGenerated
			}

			// return arrayJson;
		},
		getSimilaritiesFromAPIs: async (_, { apiList }) => {
			const len = apiList.length;
			if (len <= 1) {
				throw new Error("You need to pass at least two api for the analyzer");
			}
			const similarities = [];
			const requests = [];
			const responses = [];

			const similiaritiesBack = [];
			const requestsBack = [];
			const responsesBack = [];

			apiList.map(async (api, i) => {
				//Parser each API
				const parser = new SwaggerParser();
				const apiRef = await parser.dereference(api.path);
				const apiKeys = Object.keys(apiRef.paths);
				const apiValues = Object.values(apiRef.paths);

				//Report requests and responses from each API
				let reportRequestsAPI = {};
				let reportResponsesAPI = {};

				apiValues.map(async (value, i) => {
					reportResponsesAPI[apiKeys[i]] = "";
					["get", "post"].map((method) => {
						getResponsesApi(value, method, reportResponsesAPI, apiKeys, i);
						getRequestsAPI(value, method, reportRequestsAPI, apiKeys, i);
					});
					api["requests"] = [reportRequestsAPI];
					api["responses"] = [reportResponsesAPI];
				});
				requests.push([reportRequestsAPI]);
				responses.push([reportResponsesAPI]);
			});
			// Time to ensure that requests and responses are integrated for each API
			await wait(200);

			const apisExample = [
				{
					name: "TiTechNF",
					requests: [
						{ "/api/request/NF1": { get: [{ id: "int" }] } },
						{ "/api/request/NF2": { get: [{ num: "int" }] } },
						{ "/api/request/NF3": { post: [Object] } },
					],
					responses: [
						{ "/api/response/NF1": { get: [{ name: "string" }] } },
						{ "/api/response/NF2": { get: [{ email: "string" }] } },
						{
							"/api/response/NF3": {
								post: [{ mat: "string" }, { id: "int" }],
							},
						},
					],
				},
				{
					name: "TiTechC",
					requests: [{ "/api/request/C1": { post: [{ name: "string" }] } }],
					responses: [
						{ "/api/response/C1": { get: [{ user: "string" }] } },
						{ "/api/response/C2": { post: [Object] } },
						{ "/api/response/C3": { post: [Object] } },
					],
				},
			];

			let apis = apisExample;

			apis.map((currentApi, i) => {
				apis.slice(i + 1).map((targetApi) => {
					currentApi.responses.map((response, itRes) => {
						//Check response data on API
						if (!Object.values(Object.values(response)[0])[0]) {
							return;
						} else {
							targetApi.requests.map((request, itReq) => {
								// console.log(Object.values(Object.values(response)[0]));
								Object.values(Object.values(response)[0])[0].map((res) => {
									Object.values(Object.values(request)[0])[0].map((req) => {
										if (Object.keys(res)[0] == Object.keys(req)[0]) {
											let origin = {};
											origin["api"] = currentApi.name;
											origin["url"] = Object.keys(response)[0];
											origin["method"] = Object.keys(
												Object.values(response)[0]
											)[0];
											origin["parametersIn"] = Object.values(
												Object.values(currentApi.requests[itRes])[0]
											)[0];
											origin["parametersOut"] = Object.values(
												Object.values(currentApi.responses[itRes])[0]
											)[0];
											let target = {};
											target["api"] = targetApi.name;
											target["url"] = Object.keys(request)[0];
											target["method"] = Object.keys(
												Object.values(request)[0]
											)[0];
											target["parametersIn"] = Object.values(
												Object.values(targetApi.requests[itReq])[0]
											)[0];
											target["parametersOut"] = Object.values(
												Object.values(targetApi.responses[itReq])[0]
											)[0];
											similarities.push({
												originAPI: origin,
												targetAPI: target,
											});
										}
									});
								});
							});
						}
					});
				});
			});

			return {
				requests: requests,
				responses: responses,
				similarities: similarities,
			};
		}
	},
};

module.exports = resolvers;
