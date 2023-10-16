import { Response } from "express";
import { Configuration, OpenAIApi } from "openai";

export class openAIController {
  private openAi: any;

  constructor() {
    const configuration = new Configuration({
      apiKey: "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",
    });
    this.openAi = new OpenAIApi(configuration);
  }

  public async generateChat(res: Response) {
    console.log("in...");
    const response = this.openAi.createChatCompletion(
      {
        model: "gpt-4",
        stream: true,
        messages: [
          {
            role: "system",
            content: "You are an SEO expert.",
          },
          {
            role: "user",
            content: "Write a paragraph about no-code tools to build in 2021.",
          },
        ],
      },
      { responseType: "stream" }
    );
    console.log(response);

    response.then((resp: any) => {
      resp.data.on("data", (chunk: any) => {
        // console.log the buffer value
        console.log("chunk: ", chunk);

        // this converts the buffer to a string
        const payloads = chunk.toString().split("\n\n");

        console.log("payloads: ", payloads);

        for (const payload of payloads) {
          // if string includes '[DONE]'
          if (payload.includes("[DONE]")) {
            res.end(); // Close the connection and return
            return;
          }
          if (payload.startsWith("data:")) {
            // remove 'data: ' and parse the corresponding object
            const data = JSON.parse(payload.replace("data: ", ""));
            try {
              const text = data.choices[0].delta?.content;
              if (text) {
                console.log("text: ", text);
                // send value of text to the client
                res.write(`${text}`);
              }
            } catch (error) {
              console.log(`Error with JSON.parse and ${payload}.\n${error}`);
            }
          }
        }
      });
    });
  }
}
