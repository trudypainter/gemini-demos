# Gemini API Demos

Hello! 👋 This is a repository of examples built with Google's Gemini API, which lets you build multimodal AI applications with text, images, and more.

## What You'll Find:

Examples: These demos show the latest Gemini models (Flash 1.5, Pro, and others) in action. Dive into projects that demonstrate:

- Image and Video understanding: Analyze content, classify objects, and even generate timestamped summaries.
- Multimodal interaction: Combine text and image inputs to create engaging user experiences.
- Technical Inspiration: Get hands-on with code examples that show you how to use the Gemini API effectively. Learn best practices for prompt engineering, caching and embedding, and integrating Gemini into your own applications.

## Getting Started:

1. Obtain an API Key: To use the Gemini API, you'll need an API key. You can get one [here](https://ai.google.dev/gemini-api/docs/api-key) or from [AI Studio](https://aistudio.google.com/app/apikey)
2. Explore the Docs: The official documentation is your comprehensive guide to the Gemini API: https://ai.google.dev/gemini-api/docs/
3. Dive into the Demos: Choose a demo that sparks your interest and follow the instructions in its README. You'll be up and running in no time!

## Important Notes:

1. API Usage Limits: Google may have usage limits and associated costs for the Gemini API. Be sure to review the details on their website.
2. Responsible AI: Please use the Gemini API responsibly and ethically. Avoid generating harmful or misleading content.
3. Feedback Welcome: We value your input! If you encounter issues, have suggestions, or want to share your creations, please open an issue or pull request.

## Current Projects

| Name                                            | Description                                                                                                                                                                                                                                                                                   | Tools                                                                                                                                                                                                        |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Multimodal Embeddings](/multimodal-embeddings) | Using Gemini's new Multimodal Embeddings API, we'll explore high dimensional embedding space of text, images, and videos.                                                                                                                                                                     | [Multimodal Embeddings API](https://cloud.google.com/vertex-ai/generative-ai/docs/embeddings/get-multimodal-embeddings), [Firestore Vector Search](https://firebase.google.com/docs/firestore/vector-search) |
| [Gemini Video Scrubber](/video-scrubber)        | "GVS" is a prototype that uses Gemini's multimodal video understanding capabilities to create timestamped summaries of videos with a simple UI to play those timestamps back in sequence, giving you the ability to quickly scan videos for interesting moments, common occurences, and more! | Multimodal Gemini, File API, Caching                                                                                                                                                                         |
| [Voice Cursor](/voice-cursor)                    | An experimental text editor that lets you highlight phrases and instantly hear them spoken by Gemini 2.0 in different expressive styles. Simply select text, choose a tone, and hear AI-generated speech with customizable prompts. | [Gemini 2.0 Native Audio Output](https://ai.google.dev/gemini-api/docs/models/gemini-v2#speech-generation-early-accessallowlist)                                                                                                                                                                   |
| [Image to Code](/image-to-code)                  | An experimental site that uses Gemini 2.0 Flash to turn an image --> into a creative code sketch (p5.js). | [Gemini 2.0 Flash](https://deepmind.google/technologies/gemini/flash/) |

## Experiments for all

This is an experiment, not an official Google product. We'll do our best to support and maintain this experiment but your mileage may vary.

We encourage open sourcing projects as a way of learning from each other. Please respect our and other creators' rights, including copyright and trademark rights when present, when sharing these works and creating derivative work. If you want more info on Google's policy, you can find that [here](https://www.google.com/permissions/).
