class Validator {
  createChannelSchema() {
    return {
      body: {
        type: "object",
        required: ["name", "handle"],
        properties: {
          name: {
            type: "string",
            minLength: 1,
            maxLength: 100,
          },
          handle: {
            type: "string",
            pattern: "^[a-zA-Z0-9][a-zA-Z0-9_]*$",
            minLength: 3,
            maxLength: 30,
          },
        },
      },
    };
  }

  getChannelByHandleSchema() {
    return {
      params: {
        type: "object",
        required: ["handle"],
        properties: {
          handle: {
            type: "string",
            minLength: 1,
          },
        },
      },
    };
  }
}
export default new Validator();
