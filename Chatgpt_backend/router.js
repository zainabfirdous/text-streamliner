const express = require("express");
const router = express.Router();
const ChatGPTService = require("./chatGPT_service.js")
const { z } = require("zod");

router.put("/jd", async(req, res)=>{
    try {
        const { companyName, jobLocation, jobTitle } = req.body;
    
        // Define the schema for HTML elements
        const htmlElementSchema = z.lazy(() =>
          z.object({
            type: z.enum([
              "div",
              "button",
              "header",
              "section",
              "field",
              "form",
              "p",
              "h1",
              "h2",
              "h3",
              "ul",
              "li",
            ]),
            content: z.string().optional(), 
          }),
        );
    
        const message = [
          {
            role: "system",
            content:
              "You are HRGPT, an expert in HR, recruitment and labour laws in the US.\
                        Your expertise lies in helping me as a business owner to manage tasks like creating compelling job descriptions",
          },
          {
            role: "user",
            content: `
                          I run a business called ${companyName} in ${jobLocation}.\
                        I am hiring for a role of a ${jobTitle}. This is a part time, hourly wage job.`,
          },
          {
            role: "system",
            content: "create a job description based on user input.",
          },
          {
            role: "system",
            content: ` Make sure you do not use \n in response, instead use <br>, since \n in response won't look clean to the user.
                      Use the following code snippet as an example of the format for your response:
                      <html>
                      <div>
                     [job description in html format]
                    </div>
                    <html>`,
          },
        ];
    
        const headers = {
          "Content-Type": "text/event-stream",
          Connection: "keep-alive",
          "Cache-Control": "no-cache",
        };
    
        const streamData = await ChatGPTService.getGPTStream({
          message: message,
          schema: htmlElementSchema,
        });
    
        res.writeHead(200, headers);
    
        for await (const chunk of streamData) {
          const chunkMessage = chunk?.choices[0]?.delta.content || "";
          res.write(`data: ${JSON.stringify({ chunkMessage, time: Date.now() })}\n\n`);
        }
      } catch (err) {
        console.log("Chat GPT error: ", err);
        res.status(500).write("Something went wrong! try again later");
        }
      finally {
        res.write(`data: [DONE]\n\n`);
        res.end();
      }

})


module.exports = router