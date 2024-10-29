const { zodResponseFormat } = require("openai/helpers/zod");
const openAI = require("openai").default;

//create OpenAI Client

class OpenAI {
  constructor() {
    this.openAIClient = null;
  }

  initialize(apiKey) {
    this.openAIClient = new openAI({
      apiKey,
    });

    console.log("ChatGPT initialization done");
  }

  async getGPTStream({ message, schema }) {
    console.log(this.openAIClient)
    return this.openAIClient.chat.completions.create({
      model: "gpt-4o-2024-08-06", 
      messages: message,
      response_format: zodResponseFormat(schema, "streamData"),
      temperature: 0.5,
      stream: true,
    });
  }
}

const GPTObject = new OpenAI();
module.exports = GPTObject;
