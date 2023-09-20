import flatten from "flat";
import unflatten from "flat";
import fs from "fs";
import winston from 'winston';

const BASE_URL = `http://localhost:${process.env.PORT}`;

export function getAllIndexes(arr, val) {
	var indexes = [],
		i = -1;
	while ((i = arr.indexOf(val, i + 1)) != -1) {
		indexes.push(i);
	}
	return indexes;
}

export function replaceRange(s, start, end, substitute) {
	return s.substring(0, start) + substitute + s.substring(end);
}
export function extractArrayType(array) {
	const extratedArrays = [];
	const arrayAux = Object.entries(array);
	arrayAux.map((res) => {
		if (res[1] == "array") {
			extratedArrays.push(res[0]);
		}
	});
	return extratedArrays;
}
export async function isValidAPI(SwaggerParser, api) {
	try {
		await SwaggerParser.validate(api.path)
		return true;
	} catch (err) {
		console.error(`API is invalid. ${err.message}`);
		return false;
	}
}
export const sanitizeName = (name) => {
	// Remove spaces, special characters, comma, dash, hyphen
	return name.replace(/[ \-,\\(\)\[\]{}!@#$%^&*+=?<>~`/\\|:;"']/g, '').toLowerCase();
}
export const generateFilename = (name) => {
	// Format the date for readability and uniqueness
	const date = new Date();
	const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
	return `${name}__${formattedDate}`;  // Change .txt to the file type you need
}
export const logger = () => {
	return winston.createLogger({
		level: 'info',
		format: winston.format.simple(),
		transports: [
			new winston.transports.File({ filename: 'logs/combined.log' }),
			new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
			new winston.transports.Console()
		]
	});
}
export const adapateToJson = (obj) => {
	let new_requests = JSON.stringify(obj)
		.replaceAll('"integer"', 0)
		.replaceAll('"boolean"', true);
	return JSON.parse(new_requests);
}
export const saveJson = (path, json, indent) => {
	fs.writeFile(path, JSON.stringify(json, null, indent), function (err) {
		if (err) throw err;
		console.log(`File '${path}' Saved!`);
	});
	return `${BASE_URL}/${path}`
}
export const removeArrayType = (array, fieldsTypedArray) => {
	const keyArray = Object.entries(array);
	// console.log(keyArray);
	let auxField = fieldsTypedArray;
	let auxkeyArray = keyArray;

	const ra = auxField.map((res) => {
		auxkeyArray.map((resKey) => {
			resKey[0] = resKey[0].replace(res + ".", "");
			return resKey;
		});
		auxkeyArray = auxkeyArray.filter((a) => a[0] != res);
		return auxkeyArray;
	});

	return ra[auxField.length - 1];
}

export const getNewRequestsAPI = async (apiValue, method, requests, apiKeys, i) => {
	if (method == "get") {
		if (apiValue.hasOwnProperty(method)) {
			if (apiValue[method].hasOwnProperty("parameters")) {
				let keyMethod = {};
				keyMethod[method] = apiValue[method]["parameters"].map(
					(parameters, i) => {
						let param = {};
						param[parameters.name] = parameters.type;
						return param;
					}
				);
				const auxReport = {};
				auxReport[apiKeys[i]] = keyMethod;
				// console.log(JSON.stringify(auxReport, null, 4));
				requests.push(auxReport);
				// console.log(auxMethod);
			}
		}
	}
}

export const getRequestsOpenAPI2 = async (apiValue, method, requests, apiKeys, i, apiBundle) => {
	if (apiValue.hasOwnProperty(method)) {
		if (apiValue[method].hasOwnProperty("parameters")) {

			let object = {};
			let entityName = "";
			object = apiValue[method]["parameters"].map((parameters, p_i) => {
				// console.log(parameters)
				// if (parameters.hasOwnProperty("schema")) {
				// 	const schema = parameters["schema"];

				// 	const bundleSchema =
				// 		apiBundle.paths[apiKeys[i]][method]["parameters"][p_i][
				// 		"schema"
				// 		];
				// 	if (
				// 		schema.type == "object" &&
				// 		schema.hasOwnProperty("properties")
				// 	) {
				// 		if (bundleSchema.hasOwnProperty("$ref")) {
				// 			entityName = extractEntityName(
				// 				bundleSchema["$ref"]
				// 			);
				// 		}
				// 		return extractObject(entityName, schema);
				// 	} else if (schema.type == "array") {
				// 		const bundleObject =
				// 			apiBundle.paths[apiKeys[i]][method]["parameters"][p_i][
				// 			"schema"
				// 			]["items"];

				// 		if (bundleObject.hasOwnProperty("$ref")) {
				// 			entityName = extractEntityName(
				// 				bundleObject["$ref"]
				// 			);
				// 		}
				// 		if (bundleObject.hasOwnProperty("object")) {

				// 			return extractObject(
				// 				entityName,
				// 				schema["items"]
				// 			);
				// 		}
				// 		else {
				// 			return createAttributeValue(
				// 				parameters.name,
				// 				[schema["items"].type]
				// 			)
				// 		}
				// 		// const bundleObject =
				// 		// 	apiBundle.paths[apiKeys[i]][method]["parameters"][p_i][
				// 		// 	"schema"
				// 		// 	]["items"];

				// 		// if (bundleObject.hasOwnProperty("$ref")) {
				// 		// 	entityName = extractEntityName(
				// 		// 		bundleObject["$ref"]
				// 		// 	);
				// 		// }
				// 		// return extractObject(
				// 		// 	entityName,
				// 		// 	schema["items"]
				// 		// );
				// 		// console.log(JSON.stringify(object, null, 4));
				// 	}
				// } else {
				// 	if (parameters.type == "array") {
				// 		return createAttributeValue(parameters.name, [
				// 			parameters["items"].type,
				// 		]);
				// 	} else {
				// 		return createAttributeValue(
				// 			parameters.name,
				// 			parameters.type
				// 		);
				// 	}
				// }
				if (parameters.hasOwnProperty("schema")) {
					const schema = parameters["schema"];

					const bundleSchema =
						apiBundle.paths[apiKeys[i]][method]["parameters"][p_i][
						"schema"
						];
					if (
						schema.type == "object" &&
						schema.hasOwnProperty("properties")
					) {
						if (bundleSchema.hasOwnProperty("$ref")) {
							entityName = extractEntityName(
								bundleSchema["$ref"]
							);
						}
						return extractObject(entityName, schema);
					} else if (schema.type == "array") {

						const bundleObject =
							apiBundle.paths[apiKeys[i]][method]["parameters"][p_i][
							"schema"
							]["items"];

						if (bundleObject.hasOwnProperty("$ref")) {
							entityName = extractEntityName(
								bundleObject["$ref"]
							);
						}
						if (bundleObject.hasOwnProperty("object")) {

							return extractObject(
								entityName,
								schema["items"]
							);
						}
						else {
							return createAttributeValue(
								parameters.name,
								[schema["items"].type]
							)
						}
						// console.log(JSON.stringify(object, null, 4));
					}
					else {
						return createAttributeValue(
							parameters.name,
							schema.type
						);
					}
				} else {
					if (parameters.type == "array") {
						return createAttributeValue(parameters.name, [
							parameters["items"].type,
						]);
					} else {
						return createAttributeValue(
							parameters.name,
							parameters.type
						);
					}
				}
			});
			let keyMethod = {};
			keyMethod[method] = object;
			const auxReport = {};
			auxReport[apiKeys[i]] = keyMethod;
			// console.log(JSON.stringify(auxReport, null, 4));
			requests.push(auxReport);

		}
	}
}
export const getRequestsOpenAPI3 = async (apiValue, method, requests, apiKeys, i, apiBundle) => {

	if (apiValue.hasOwnProperty(method)) {
		let object = null;
		let schema = null;
		let bundleSchema = null;
		let aux = null;
		let auxReport = null;
		if (apiValue[method].hasOwnProperty("requestBody")) {
			if (apiValue[method]["requestBody"].hasOwnProperty("content")) {
				if (apiValue[method]["requestBody"]["content"].hasOwnProperty("application/json")) {
					if (apiValue[method]["requestBody"]["content"]["application/json"].hasOwnProperty("schema")) {

						schema = apiValue[method]["requestBody"]["content"]["application/json"]["schema"];
						bundleSchema =
							apiBundle.paths[apiKeys[i]][method]["requestBody"]["content"]["application/json"]["schema"];
						object = createObjectFromProperties(schema, bundleSchema)
						aux = createAttributeValue(method, object)
						auxReport = createAttributeValue(apiKeys[i], aux)
						requests.push(auxReport);
					}
				}
				// console.log(Object.values(apiValue[method]["requestBody"]["content"]))
			}
		}
		if (apiValue[method].hasOwnProperty("parameters")) {
			let entityName = "";
			object = apiValue[method]["parameters"].map((parameters, p_i) => {

				if (parameters.hasOwnProperty("schema")) {
					const schema = parameters["schema"];

					const bundleSchema =
						apiBundle.paths[apiKeys[i]][method]["parameters"][p_i][
						"schema"
						];
					if (
						schema.type == "object" &&
						schema.hasOwnProperty("properties")
					) {

						if (bundleSchema.hasOwnProperty("$ref")) {
							entityName = extractEntityName(
								bundleSchema["$ref"]
							);
						}

						return extractObject(entityName, schema);
					} else if (schema.type == "array") {

						const bundleObject =
							apiBundle.paths[apiKeys[i]][method]["parameters"][p_i][
							"schema"
							]["items"];

						if (bundleObject.hasOwnProperty("$ref")) {
							entityName = extractEntityName(
								bundleObject["$ref"]
							);
						}

						if (bundleObject.hasOwnProperty("object")) {

							return extractObject(
								entityName,
								schema["items"]
							);
						}
						else {
							return createAttributeValue(
								parameters.name,
								[schema["items"].type]
							)
						}
						// console.log(JSON.stringify(object, null, 4));
					}
					else {
						return createAttributeValue(
							parameters.name,
							schema.type
						);
					}
				} else {

					if (parameters.type == "array") {

						const bundleReference = apiBundle.paths[apiKeys[i]][method]["parameters"][p_i]
						return extractArray(bundleReference, parameters)
						// console.log(JSON.stringify(t))

						// console.log(apiBundle.paths[apiKeys[i]][method]["parameters"][p_i])
						// return createAttributeValue(parameters.name, [
						// 	parameters["items"].type,
						// ]);
					} else {
						return createAttributeValue(
							parameters.name,
							parameters.type
						);
					}
				}
			});
		}


		aux = createAttributeValue(method, object)
		auxReport = createAttributeValue(apiKeys[i], aux)
		// console.log(JSON.stringify(auxReport, null, 4));
		requests.push(auxReport);

		// let keyMethod = {};
		// keyMethod[method] = object;
		// const auxReport = {};
		// auxReport[apiKeys[i]] = keyMethod;
		// requests.push(auxReport);

	}
}

export const getResponsesOpenAPI2 = async (
	apiValue,
	method,
	responses,
	apiKeys,
	i,
	apiBundle
) => {
	if (apiValue.hasOwnProperty(method)) {
		if (apiValue[method].hasOwnProperty("responses")) {
			let object = null;
			let aux = null;
			let auxReport = null;
			if (apiValue[method]["responses"].hasOwnProperty("200")) {
				if (apiValue[method]["responses"]["200"].hasOwnProperty("schema")) {
					const schema = apiValue[method]["responses"]["200"]["schema"];
					const bundleSchema =
						apiBundle.paths[apiKeys[i]][method]["responses"]["200"]["schema"];
					object = createObjectFromProperties(schema, bundleSchema)
					aux = createAttributeValue(method, object)
					auxReport = createAttributeValue(apiKeys[i], aux)
					// console.log(JSON.stringify(auxReport, null, 4));
					responses.push(auxReport);
				}
			}
		}
	}
}

export const getResponsesOpenAPI3 = async (
	apiValue,
	method,
	responses,
	apiKeys,
	i,
	apiBundle
) => {
	if (apiValue.hasOwnProperty(method)) {
		if (apiValue[method].hasOwnProperty("responses")) {
			if (apiValue[method]["responses"].hasOwnProperty("200")) {
				let object = null;
				let schema = null;
				let bundleSchema = null;
				let aux = null;
				let auxReport = null;
				if (apiValue[method]["responses"]["200"].hasOwnProperty("content")) {
					if (apiValue[method]["responses"]["200"]["content"].hasOwnProperty("application/json")) {
						if (apiValue[method]["responses"]["200"]["content"]["application/json"].hasOwnProperty("schema")) {
							schema = apiValue[method]["responses"]["200"]["content"]["application/json"]["schema"];
							bundleSchema =
								apiBundle.paths[apiKeys[i]][method]["responses"]["200"]["content"]["application/json"]["schema"];
							object = createObjectFromProperties(schema, bundleSchema)
							// aux = createAttributeValue(method, object)
							// auxReport = createAttributeValue(apiKeys[i], aux)
							// responses.push(auxReport);
						}
					}

				}
				aux = createAttributeValue(method, object)
				auxReport = createAttributeValue(apiKeys[i], aux)
				responses.push(auxReport);
			}

		}

	}
}
// isValidPath: (api, ...path) => {

// 	path.map((p,i)=> {
// 		let aa = []
// 		for (j=0; j<=i; j++) {
// 			aa.push(path[j])
// 		}
// 		// aa.map(s=>console.log(s))
// 		// console.log(api[x])

// 	})


// },
export const createObjectFromProperties = (schema, bundleSchema) => {
	let object = {}; let entityName = "";
	if (
		schema.type == "object" &&
		schema.hasOwnProperty("properties")
	) {
		if (bundleSchema.hasOwnProperty("$ref")) {
			entityName = extractEntityName(
				bundleSchema["$ref"]
			);
		}
		object = extractObject(entityName, schema);
	} else if (schema.type == "array") {
		const bundleObject =
			apiBundle.paths[apiKeys[i]][method]["responses"]["200"][
			"schema"
			]["items"];

		if (bundleObject.hasOwnProperty("$ref")) {
			entityName = extractEntityName(
				bundleObject["$ref"]
			);
		}

		else if (bundleObject.hasOwnProperty("object")) {
			return extractObject(
				entityName,
				schema["items"]
			);
		}
		else {
			return createAttributeValue(
				parameters.name,
				[schema["items"].type]
			)
		}

		// object = extractObject(
		// 	entityName,
		// 	schema["items"]
		// );
	} else {
		object = createAttributeValue(
			Object.keys(schema)[0],
			schema[Object.keys(schema)[0]]
		)
		// console.log(object)
	}
	return object
}

export const extractEntityName = (name) => {
	const separated_name = name.split("/");
	return separated_name[separated_name.length - 1];
}
export const extractObject = (objectName, obj) => {

	if (obj.hasOwnProperty("properties")) {
		const object = Object.entries(obj["properties"]).map((parameters, i) => {
			if (parameters[1].type == "object") {
				return extractObject(parameters[0], parameters[1]);
			} else if (parameters[1].type == "array") {
				if (parameters[1]["items"].type == "object") {
					return extractObject(
						parameters[0],
						parameters[1]["items"]
					);
				} else {
					return createAttributeValue(parameters[0], [
						parameters[1]["items"].type,
					]);
				}

				// return extractObject(
				// 	parameters[1]["items"],
				// 	parameters[0]
				// );
			} else {
				return createAttributeValue(
					parameters[0],
					parameters[1].type
				);
			}
		});
		return createAttributeValue(objectName, object);
	}
	else {
		return createAttributeValue(objectName, [
			obj.type,
		]);
	}
}
export const extractArray = (bundleReference, parameters) => {

	if (bundleReference.hasOwnProperty("$ref")) {
		entityName = extractEntityName(
			bundleReference["$ref"]
		);
	}

	if (parameters["type"] == "array") {
		return extractArray(
			"entityName",
			parameters["items"]
		);
	}
	if (parameters["type"] == "object") {
		// console.log(parameters)
		return extractObject(
			entityName,
			parameters
		);
	}
	// else {
	// 	return createAttributeValue(
	// 		parameters.name,
	// 		[schema["items"].type]
	// 	)
	// }
}
export const createAttributeValue = (attr, value) => {
	let object = {};
	object[attr] = value;
	return object;
}
export const getRequestsAPI = async (value, method, reportAPI, keys, i) => {
	// const aux =
	// 		value[method]["responses"]["200"]["content"]["application/json"][
	// 			"schema"
	// 		];
	// let method = "post";
	if (value.hasOwnProperty(method)) {
		if (method == "get") {
			let keyMethod = {};
			keyMethod["request"] = "";
			const auxMethod = {};
			auxMethod[method] = keyMethod;
			reportAPI[keys[i]] = auxMethod;
		} else {
			const fields =
				value[method]["requestBody"]["content"]["application/json"]["schema"];
			const entries = Object.entries(flatten(fields));
			let auxInfoValues = {};

			// console.log(fields.oneOf);

			entries.map((entry, i) => {
				const key = entry[0];
				const value = entry[1];

				let newCorrectArray = {};
				if (RegExp(/.type/).test(key)) {
					// console.log(entry);
					// console.log(key);
					const keyWord = "properties";
					const indexBegin = key.indexOf(keyWord);
					// const newKey = key.substring(0, indexBegin + 10);
					const newKey = module.exports
						.replaceRange(key, 0, indexBegin + 11, "")
						.replace(/properties./gi, "")
						.replace(".type", "");

					// console.log(newKey);

					// const newKey = key.substring(0, indexBegin + 10);
					// console.log(unflatten(newKey));

					auxInfoValues[newKey] = value;

					// let extractedArray = extractArrayType(auxInfoValues);
					// newCorrectArray = removeArrayType(
					// 	auxInfoValues,
					// 	extractedArray
					// );
					// console.log(auxInfoValues);
				}
			});

			// const extractedArray = extractArrayType(auxInfoValues);
			// const newCorrectArray = removeArrayType(
			// 	auxInfoValues,
			// 	extractedArray
			// );

			// let newArray = {};
			// newCorrectArray.map((entry) => {
			// 	newArray[entry[0]] = entry[1];
			// });

			let keyMethod = {};
			keyMethod["request"] = unflatten(auxInfoValues);
			const auxMethod = {};
			auxMethod[method] = keyMethod;
			reportAPI[keys[i]] = auxMethod;

			// console.log(reportAPI);
			// const entries = Object.entries(flatten(fields));

			// entries.map((entry) => {
			// 	const key = entry[0];
			// 	const value = entry[1];
			// 	console.log(key);

			// 	// if (RegExp(/.type/).test(key)) {
			// 	// 	const keyWord = "properties";
			// 	// 	const indexBegin = key.indexOf(keyWord);
			// 	// 	const newKey = module.exports
			// 	// 		.replaceRange(key, 0, indexBegin + 11, "")
			// 	// 		.replace(/properties./gi, "")
			// 	// 		.replace(".type", "");
			// 	// 	auxInfoValues[newKey] = value;
			// 	// }
			// });
		}
	}
	return "";
}

export const getResponsesApi = (value, method, reportAPI, keys, i) => {
	if (value.hasOwnProperty(method)) {
		let auxInfoValues = {};

		if (!value[method]["responses"]["200"].hasOwnProperty("content")) {
			return;
		} else {
			const aux =
				value[method]["responses"]["200"]["content"]["application/json"][
				"schema"
				];

			const entries = Object.entries(flatten(aux));

			entries.map((entry) => {
				const key = entry[0];
				const value = entry[1];

				let newCorrectArray = {};
				if (RegExp(/.type/).test(key)) {
					const keyWord = "properties";
					const indexBegin = key.indexOf(keyWord);
					const newKey = module.exports
						.replaceRange(key, 0, indexBegin + 11, "")
						.replace(/properties./gi, "")
						.replace(".type", "");
					auxInfoValues[newKey] = value;
					let extractedArray = extractArrayType(auxInfoValues);
					newCorrectArray = removeArrayType(
						auxInfoValues,
						extractedArray
					);
				}
			});

			const extractedArray = extractArrayType(auxInfoValues);
			const newCorrectArray = removeArrayType(
				auxInfoValues,
				extractedArray
			);

			let newArray = {};
			newCorrectArray.map((entry) => {
				newArray[entry[0]] = entry[1];
			});

			let keyMethod = {};
			keyMethod["response"] = unflatten(newArray);
			const auxMethod = {};
			auxMethod[method] = keyMethod;
			reportAPI[keys[i]] = auxMethod;
		}
	}
}

export const wait = (milliseconds) =>
	new Promise((resolve) => setTimeout(resolve, milliseconds))

