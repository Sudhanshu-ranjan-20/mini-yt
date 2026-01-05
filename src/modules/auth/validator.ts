class Validator {
  signupSchema() {
    return {
      body: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
          },
          password: {
            type: "string",
            minLength: 5,
          },
        },
      },
    };
  }
  loginSchema() {
    return {
      body: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
          },
          password: {
            type: "string",
          },
        },
      },
    };
  }
}

export default new Validator();
