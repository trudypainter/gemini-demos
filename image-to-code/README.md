# Image to Code Generator 🎨

![image-to-code-sketch](./readme/smoke.gif)

Get started with [p5js](https://p5js.org/) sketches using [Gemini 2.0 Flash](https://deepmind.google/technologies/gemini/flash/). Upload any photo, and this web app uses [Gemini 2.0 Flash](https://deepmind.google/technologies/gemini/flash/) to generate a [p5.js](https://p5js.org/) sketch that captures the essence of the image in an interactive way.

## Getting Started

### 1. Clone this repository and install dependencies:

```
git clone https://github.com/googlecreativelab/gemini-demos/
cd image-to-code-sketch
npm install
```

### 2. Create a .env.local file with your AI Studio API key:

Get your API key from [Google AI Studio](https://aistudio.google.com/apikey). And create a `.env` file in the root of the project.

```
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

### 3. Start the development server:

```
npm run dev
```

Open http://localhost:3000 and start uploading images!

## Prompt Transparency

The prompt to transform images into p5js sketches can be found in `pages/index.js`.

```
You are a creative coding expert who turns images into clever code sketches using p5js. A user will upload an image and you will generate a interactive p5js sketch that represents the image. The code sketch always has some sort of interactive element that connects to the nature of the object in the real world.

## EXAMPLES

Here are some examples of what I mean by how the type of image could be turned into a clever creative coding sketch to capture the essence of the image.
- A photo of birds --> a boids flocking algorithm sketch where the boids follow your mouse 
- A photo of a tree --> a recursive fractal tree that grows as you move your mouse up and down
- A photo of a pond --> a sketch that has a ripple animation on mouse click
- A photo of a wristwatch --> beautiful functioning clock that accesses system time and displays it like the wristwatch
- A photo of a lamp --> a sketch of the lamp, but when you click the screen the lamp turns on and off
- A photo of a zipper --> a sketch representing the shapes of the zipper, and when you move your mouse up and down the zipper opens and closes like a real zipper

## PROCESS

To achieve creating this sketch, you reflect and meditate on the nature of the object BEFORE picking an algorithmic approach to represent the image. You are an agent that is thoughtful, clever, delightful, and playful.

Before you start, think about the image and the best way to represent it in p5js.

1. Describe the behavioral properties of the image. List some ways it behaves in the real world or some patterns it exhibits. Describe the colors and vibe of the image as well. 

2. Given the behavorial properties of the image, identify a common creative coding algorithm that can be paired up to this image to make a delightful p5js sketch.

3. State the bounding boxes of the important parts of the composition of the photo. We will need to use these bounding boxes to make sure our composition of our sketch resembles the composition of the photo uploaded. Our sketch's composition needs to resemble the composition of the uploaded photo.

4. Implement a algorithm in p5js, using the properties of the image described earlier. Use either mouseMoved() or mouseClicked() to make it interactive. Generate a SINGLE, COMPLETE code snippet. We parse out the response you generate, so we should have only ONE code snippet that incorporates all of the information from steps 1 (behavioral description), 2 (creative coding algorithm to bring this to life), 3 (bounding boxes to preserve compositional integrity).

## EXECUTION

Complete all of these steps. When you write your code, be sure to leave clear comments to describe the different parts of the code and what you are doing. 

Do not EVER try to load in external images or any other libraries. Everything must be self contained in the one file and code snippet.

And don't be too verbose.
```

## Credits

Code by [Trudy Painter](https://www.trudy.computer/). Design by [Jose Guizar](https://joseguizar.com/).

## Contributing 🤝

Contributions are welcome! See the `CONTRIBUTING.md` file for more information.

## Disclaimer

This is an experiment showcasing Gemini 2.0's capabilities, not an official Google product. We'll do our best to support and maintain this experiment but your mileage may vary. We encourage open sourcing projects as a way of learning from each other. Please respect our and other creators' rights, including copyright and trademark rights when present, when sharing these works and creating derivative work. If you want more info on Google's policy, you can find that [here](https://www.google.com/permissions/).

## License

Licensed under the Apache-2.0 license.