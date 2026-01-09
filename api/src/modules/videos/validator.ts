class Validator {
  readonly createVideoSchema = {
    body: {
      type: "object",
      required: ["title", "contentType"],
      properties: {
        title: {
          type: "string",
          minLength: 1,
          maxLength: 200,
        },
        description: {
          type: "string",
          maxLength: 5000,
        },
        contentType: {
          type: "string",
          pattern: "^video/",
        },
      },
    },
  } as const;

  readonly finalizeVideoSchema = {
    params: {
      type: "object",
      required: ["id"],
      properties: {
        id: {
          type: "string",
        },
      },
    },
  } as const;

  readonly getVideoMetadataSchema = {
    params: {
      type: "object",
      required: ["id"],
      properties: {
        id: {
          type: "string",
        },
      },
    },
  } as const;
}
export default new Validator();
