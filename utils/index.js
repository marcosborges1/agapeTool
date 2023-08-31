const flatten = require("flat");
const { unflatten } = require("flat");
const fs = require("fs");
const winston = require('winston');

module.exports = {
	getAllIndexes: function (arr, val) {
		var indexes = [],
			i = -1;
		while ((i = arr.indexOf(val, i + 1)) != -1) {
			indexes.push(i);
		}
		return indexes;
	},
	replaceRange: function (s, start, end, substitute) {
		return s.substring(0, start) + substitute + s.substring(end);
	},
	extractArrayType: function (array) {
		const extratedArrays = [];
		const arrayAux = Object.entries(array);
		arrayAux.map((res) => {
			if (res[1] == "array") {
				extratedArrays.push(res[0]);
			}
		});
		return extratedArrays;
	},
	isValidAPI: async (SwaggerParser, api) => {
		try {
			await SwaggerParser.validate(api.path)
			return true;
		} catch (err) {
			console.error(`API is invalid. ${err.message}`);
			return false;
		}
	},
	sanitizeName: (name) => {
		// Remove spaces, special characters, comma, dash, hyphen
		return name.replace(/[ \-,\\(\)\[\]{}!@#$%^&*+=?<>~`/\\|:;"']/g, '').toLowerCase();
	},
	generateFilename: (name) => {
		// Format the date for readability and uniqueness
		const date = new Date();
		const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
		return `${name}__${formattedDate}`;  // Change .txt to the file type you need
	},
	logger: () => {
		return winston.createLogger({
			level: 'info',
			format: winston.format.simple(),
			transports: [
				new winston.transports.File({ filename: 'logs/combined.log' }),
				new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
				new winston.transports.Console()
			]
		});
	},
	adapateToJson: (obj) => {
		let new_requests = JSON.stringify(obj)
			.replaceAll('"integer"', 0)
			.replaceAll('"boolean"', true);
		return JSON.parse(new_requests);
	},
	saveJson: (path, json, indent) => {
		fs.writeFile(path, JSON.stringify(json, null, indent), function (err) {
			if (err) throw err;
			console.log(`File '${path}' Saved!`);
		});
		return path
	},
	removeArrayType: function (array, fieldsTypedArray) {
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
	},

	getNewRequestsAPI: async (apiValue, method, requests, apiKeys, i) => {
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
	},
	getRequestsOpenAPI2: async (apiValue, method, requests, apiKeys, i, apiBundle) => {
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
					// 			entityName = module.exports.extractEntityName(
					// 				bundleSchema["$ref"]
					// 			);
					// 		}
					// 		return module.exports.extractObject(entityName, schema);
					// 	} else if (schema.type == "array") {
					// 		const bundleObject =
					// 			apiBundle.paths[apiKeys[i]][method]["parameters"][p_i][
					// 			"schema"
					// 			]["items"];

					// 		if (bundleObject.hasOwnProperty("$ref")) {
					// 			entityName = module.exports.extractEntityName(
					// 				bundleObject["$ref"]
					// 			);
					// 		}
					// 		if (bundleObject.hasOwnProperty("object")) {

					// 			return module.exports.extractObject(
					// 				entityName,
					// 				schema["items"]
					// 			);
					// 		}
					// 		else {
					// 			return module.exports.createAttributeValue(
					// 				parameters.name,
					// 				[schema["items"].type]
					// 			)
					// 		}
					// 		// const bundleObject =
					// 		// 	apiBundle.paths[apiKeys[i]][method]["parameters"][p_i][
					// 		// 	"schema"
					// 		// 	]["items"];

					// 		// if (bundleObject.hasOwnProperty("$ref")) {
					// 		// 	entityName = module.exports.extractEntityName(
					// 		// 		bundleObject["$ref"]
					// 		// 	);
					// 		// }
					// 		// return module.exports.extractObject(
					// 		// 	entityName,
					// 		// 	schema["items"]
					// 		// );
					// 		// console.log(JSON.stringify(object, null, 4));
					// 	}
					// } else {
					// 	if (parameters.type == "array") {
					// 		return module.exports.createAttributeValue(parameters.name, [
					// 			parameters["items"].type,
					// 		]);
					// 	} else {
					// 		return module.exports.createAttributeValue(
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
								entityName = module.exports.extractEntityName(
									bundleSchema["$ref"]
								);
							}
							return module.exports.extractObject(entityName, schema);
						} else if (schema.type == "array") {

							const bundleObject =
								apiBundle.paths[apiKeys[i]][method]["parameters"][p_i][
								"schema"
								]["items"];

							if (bundleObject.hasOwnProperty("$ref")) {
								entityName = module.exports.extractEntityName(
									bundleObject["$ref"]
								);
							}
							if (bundleObject.hasOwnProperty("object")) {

								return module.exports.extractObject(
									entityName,
									schema["items"]
								);
							}
							else {
								return module.exports.createAttributeValue(
									parameters.name,
									[schema["items"].type]
								)
							}
							// console.log(JSON.stringify(object, null, 4));
						}
						else {
							return module.exports.createAttributeValue(
								parameters.name,
								schema.type
							);
						}
					} else {
						if (parameters.type == "array") {
							return module.exports.createAttributeValue(parameters.name, [
								parameters["items"].type,
							]);
						} else {
							return module.exports.createAttributeValue(
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
	},
	getRequestsOpenAPI3: async (apiValue, method, requests, apiKeys, i, apiBundle) => {

		if (apiValue.hasOwnProperty(method)) {
			let object = null;
			if (apiValue[method].hasOwnProperty("requestBody")) {
				if (apiValue[method]["requestBody"].hasOwnProperty("content")) {
					if (apiValue[method]["requestBody"]["content"].hasOwnProperty("application/json")) {
						if (apiValue[method]["requestBody"]["content"]["application/json"].hasOwnProperty("schema")) {

							const schema = apiValue[method]["requestBody"]["content"]["application/json"]["schema"];
							const bundleSchema =
								apiBundle.paths[apiKeys[i]][method]["requestBody"]["content"]["application/json"]["schema"];
							object = module.exports.createObjectFromProperties(schema, bundleSchema)
							aux = module.exports.createAttributeValue(method, object)
							auxReport = module.exports.createAttributeValue(apiKeys[i], aux)
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
								entityName = module.exports.extractEntityName(
									bundleSchema["$ref"]
								);
							}

							return module.exports.extractObject(entityName, schema);
						} else if (schema.type == "array") {

							const bundleObject =
								apiBundle.paths[apiKeys[i]][method]["parameters"][p_i][
								"schema"
								]["items"];

							if (bundleObject.hasOwnProperty("$ref")) {
								entityName = module.exports.extractEntityName(
									bundleObject["$ref"]
								);
							}

							if (bundleObject.hasOwnProperty("object")) {

								return module.exports.extractObject(
									entityName,
									schema["items"]
								);
							}
							else {
								return module.exports.createAttributeValue(
									parameters.name,
									[schema["items"].type]
								)
							}
							// console.log(JSON.stringify(object, null, 4));
						}
						else {
							return module.exports.createAttributeValue(
								parameters.name,
								schema.type
							);
						}
					} else {

						if (parameters.type == "array") {

							const bundleReference = apiBundle.paths[apiKeys[i]][method]["parameters"][p_i]
							return module.exports.extractArray(bundleReference, parameters)
							// console.log(JSON.stringify(t))

							// console.log(apiBundle.paths[apiKeys[i]][method]["parameters"][p_i])
							// return module.exports.createAttributeValue(parameters.name, [
							// 	parameters["items"].type,
							// ]);
						} else {
							return module.exports.createAttributeValue(
								parameters.name,
								parameters.type
							);
						}
					}
				});
			}


			aux = module.exports.createAttributeValue(method, object)
			auxReport = module.exports.createAttributeValue(apiKeys[i], aux)
			// console.log(JSON.stringify(auxReport, null, 4));
			requests.push(auxReport);

			// let keyMethod = {};
			// keyMethod[method] = object;
			// const auxReport = {};
			// auxReport[apiKeys[i]] = keyMethod;
			// requests.push(auxReport);

		}
	},
	getResponsesOpenAPI2: async (
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
					if (apiValue[method]["responses"]["200"].hasOwnProperty("schema")) {
						const schema = apiValue[method]["responses"]["200"]["schema"];
						const bundleSchema =
							apiBundle.paths[apiKeys[i]][method]["responses"]["200"]["schema"];
						object = module.exports.createObjectFromProperties(schema, bundleSchema)
						aux = module.exports.createAttributeValue(method, object)
						auxReport = module.exports.createAttributeValue(apiKeys[i], aux)
						// console.log(JSON.stringify(auxReport, null, 4));
						responses.push(auxReport);
					}
				}
			}
		}
	},
	getResponsesOpenAPI3: async (
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
					object = null;
					if (apiValue[method]["responses"]["200"].hasOwnProperty("content")) {
						if (apiValue[method]["responses"]["200"]["content"].hasOwnProperty("application/json")) {
							if (apiValue[method]["responses"]["200"]["content"]["application/json"].hasOwnProperty("schema")) {
								const schema = apiValue[method]["responses"]["200"]["content"]["application/json"]["schema"];
								const bundleSchema =
									apiBundle.paths[apiKeys[i]][method]["responses"]["200"]["content"]["application/json"]["schema"];
								object = module.exports.createObjectFromProperties(schema, bundleSchema)
								// aux = module.exports.createAttributeValue(method, object)
								// auxReport = module.exports.createAttributeValue(apiKeys[i], aux)
								// responses.push(auxReport);
							}
						}

					}
					aux = module.exports.createAttributeValue(method, object)
					auxReport = module.exports.createAttributeValue(apiKeys[i], aux)
					responses.push(auxReport);
				}

			}

		}
	},
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
	createObjectFromProperties: (schema, bundleSchema) => {
		let object = {}; let entityName = "";
		if (
			schema.type == "object" &&
			schema.hasOwnProperty("properties")
		) {
			if (bundleSchema.hasOwnProperty("$ref")) {
				entityName = module.exports.extractEntityName(
					bundleSchema["$ref"]
				);
			}
			object = module.exports.extractObject(entityName, schema);
		} else if (schema.type == "array") {
			const bundleObject =
				apiBundle.paths[apiKeys[i]][method]["responses"]["200"][
				"schema"
				]["items"];

			if (bundleObject.hasOwnProperty("$ref")) {
				entityName = module.exports.extractEntityName(
					bundleObject["$ref"]
				);
			}

			else if (bundleObject.hasOwnProperty("object")) {
				return module.exports.extractObject(
					entityName,
					schema["items"]
				);
			}
			else {
				return module.exports.createAttributeValue(
					parameters.name,
					[schema["items"].type]
				)
			}

			// object = module.exports.extractObject(
			// 	entityName,
			// 	schema["items"]
			// );
		} else {
			object = module.exports.createAttributeValue(
				Object.keys(schema)[0],
				schema[Object.keys(schema)[0]]
			)
			// console.log(object)
		}
		return object
	},
	extractEntityName: (name) => {
		separated_name = name.split("/");
		return separated_name[separated_name.length - 1];
	},
	extractObject: (objectName, obj) => {

		if (obj.hasOwnProperty("properties")) {
			const object = Object.entries(obj["properties"]).map((parameters, i) => {
				if (parameters[1].type == "object") {
					return module.exports.extractObject(parameters[0], parameters[1]);
				} else if (parameters[1].type == "array") {
					if (parameters[1]["items"].type == "object") {
						return module.exports.extractObject(
							parameters[0],
							parameters[1]["items"]
						);
					} else {
						return module.exports.createAttributeValue(parameters[0], [
							parameters[1]["items"].type,
						]);
					}

					// return module.exports.extractObject(
					// 	parameters[1]["items"],
					// 	parameters[0]
					// );
				} else {
					return module.exports.createAttributeValue(
						parameters[0],
						parameters[1].type
					);
				}
			});
			return module.exports.createAttributeValue(objectName, object);
		}
		else {
			return module.exports.createAttributeValue(objectName, [
				obj.type,
			]);
		}
	},
	extractArray: (bundleReference, parameters) => {

		if (bundleReference.hasOwnProperty("$ref")) {
			entityName = module.exports.extractEntityName(
				bundleReference["$ref"]
			);
		}

		if (parameters["type"] == "array") {
			return module.exports.extractArray(
				"entityName",
				parameters["items"]
			);
		}
		if (parameters["type"] == "object") {
			// console.log(parameters)
			return module.exports.extractObject(
				entityName,
				parameters
			);
		}
		// else {
		// 	return module.exports.createAttributeValue(
		// 		parameters.name,
		// 		[schema["items"].type]
		// 	)
		// }
	},
	createAttributeValue: (attr, value) => {
		let object = {};
		object[attr] = value;
		return object;
	},

	getRequestsAPI: async (value, method, reportAPI, keys, i) => {
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

						// let extractedArray = module.exports.extractArrayType(auxInfoValues);
						// newCorrectArray = module.exports.removeArrayType(
						// 	auxInfoValues,
						// 	extractedArray
						// );
						// console.log(auxInfoValues);
					}
				});

				// const extractedArray = module.exports.extractArrayType(auxInfoValues);
				// const newCorrectArray = module.exports.removeArrayType(
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
	},
	getResponsesApi: function (value, method, reportAPI, keys, i) {
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
						let extractedArray = module.exports.extractArrayType(auxInfoValues);
						newCorrectArray = module.exports.removeArrayType(
							auxInfoValues,
							extractedArray
						);
					}
				});

				const extractedArray = module.exports.extractArrayType(auxInfoValues);
				const newCorrectArray = module.exports.removeArrayType(
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
	},
	wait: (milliseconds) =>
		new Promise((resolve) => setTimeout(resolve, milliseconds)),
};
