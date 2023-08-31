module.exports = {
    getNewResponseAPI: async (
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

                        // let object = {};
                        // let entityName = "";

                        object = module.exports.createObjectFromProperties(schema, bundleSchema)
                        aux = module.exports.createAttributeValue(method, object)
                        auxReport = module.exports.createAttributeValue(apiKeys[i], aux)
                        responses.push(auxReport);
                        // if (
                        // 	schema.type == "object" &&
                        // 	schema.hasOwnProperty("properties")
                        // ) {
                        // 	if (bundleSchema.hasOwnProperty("$ref")) {
                        // 		entityName = module.exports.extractEntityName(
                        // 			bundleSchema["$ref"]
                        // 		);
                        // 	}
                        // 	object = module.exports.extractObject(entityName, schema);
                        // } else if (schema.type == "array") {
                        // 	const bundleObject =
                        // 		apiBundle.paths[apiKeys[i]][method]["responses"]["200"][
                        // 		"schema"
                        // 		]["items"];

                        // 	if (bundleObject.hasOwnProperty("$ref")) {
                        // 		entityName = module.exports.extractEntityName(
                        // 			bundleObject["$ref"]
                        // 		);
                        // 	}
                        // 	object = module.exports.extractObject(
                        // 		entityName,
                        // 		schema["items"]
                        // 	);
                        // 	// console.log(JSON.stringify(object, null, 4));
                        // }

                        // let keyMethod = {};
                        // keyMethod[method] = object;
                        // const auxReport = {};
                        // auxReport[apiKeys[i]] = keyMethod;
                        // // console.log(JSON.stringify(auxReport, null, 4));
                        // responses.push(auxReport);
                    }
                }
            }
        }
    }
}