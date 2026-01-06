class Validator {
  createVideoSchema() {
    return {
      body: {
        type: "object",
        required: [""],
        properties: {},
      },
    };
  }
}
export default new Validator();
