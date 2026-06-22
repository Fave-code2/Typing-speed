# Frontend Mentor - Typing Speed Test solution

This is a solution to the [Typing Speed Test challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/typing-speed-test). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
  - [AI Collaboration](#ai-collaboration)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

### The challenge

Users should be able to:

- View the optimal layout for the interface depending on their device's screen size
- See hover and focus states for all interactive elements on the page

- Start a typing test by clicking the start button or clicking the text
- Choose between easy, medium, and hard difficulty levels
- Switch between timed (60s) and passage modes
- See live WPM, accuracy, and countdown timer while typing
- View a results card on completion showing WPM, accuracy, and character stats
- See different result cards for a baseline run, a normal run, and a new personal best
- Have their personal best saved and displayed across sessions

### Screenshot

![](./screenshot.jpg)

Add a screenshot of your solution. The easiest way to do this is to use Firefox to view your project, right-click the page and select "Take a Screenshot". You can choose either a full-height screenshot or a cropped one based on how long the page is. If it's very long, it might be best to crop it.

Alternatively, you can use a tool like [FireShot](https://getfireshot.com/) to take the screenshot. FireShot has a free option, so you don't need to purchase it.

Then crop/optimize/edit your image however you like, add it to your project, and update the file path in the image above.

### Links

- Solution URL: [https://github.com/Fave-code2/Typing-speed]
- Live Site URL: [Add live site URL here](https://typing-speed-zeta-two.vercel.app/)

## My process

I started with structuring the HTML using HTML 5, I then proceeded to styling the page with vanilla css, I did the desktop view first then I proceeded to the tablet, mobile and landscape view. Then came the javascript and typescript for the functionality.

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- JavaScript
- TypeScript

### What I learned

- Managing complex UI state with a typed `state` object in TypeScript
- Handling keyboard events and per-character span rendering for a typing test
- Building a fixed header layout with proper stacking context and `z-index` management
- Handling mobile-specific layouts with custom dropdowns and responsive CSS
- Using `localStorage` to persist and display personal best scores
- Calculating live WPM and accuracy from raw typing data
- Structuring event listeners with data-driven `forEach` patterns to avoid repetition
- Fetching and rendering JSON data dynamically with Axios

To see how you can add code snippets, see below:

```js
 const difficulties = [
    { element: easy, level: "easy" },
    { element: medium, level: "medium" },
    { element: hard, level: "hard" },
  ] as const;

  difficulties.forEach(({ element, level }) => {
    element.addEventListener("click", () => {
      state.difficulty = level;
      difficultyButtons.forEach((el) => el.classList.remove("active"));
      element.classList.add("active");
      fetchData("/src/data.json", level);
    });
  });
```

If you want more help with writing markdown, we'd recommend checking out [The Markdown Guide](https://www.markdownguide.org/) to learn more.

### Continued development

I would love to focus on my general javaScript knowledge doing more projects and growing this field.

### Useful resources

- [MDN KeyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) - reference for handling key inputs
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) - TypeScript reference
- [Vite Docs](https://vitejs.dev/guide/) - build tool documentation
- [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) - for persisting personal best

### AI Collaboration

Describe how you used AI tools (if any) during this project. This helps demonstrate your ability to work effectively with AI assistants.

- What tools did you use?
  I used chatGpt and claude.
- How did you use them?
  Brainstorming solutions
- What worked well? What didn't?
  Giving me the calculation of WPM accuracy, how to structure the code e.t.c
  What did not work was I could keep the header on the top of the page while typing on mobile which affected the general layout on mobile, i had to reduce the text fontsize to avoid scrolling.

## Author

- Frontend Mentor - [@Fave_code2](https://www.frontendmentor.io/profile/Fave-code2)
- Twitter - [@thefavestyle](https://x.com/thefavestyle)

## Acknowledgments

I want to give a big shout out to the frontend mentor for give me a learning platform, claude and chatGPT for insight on how to achieve things in different ways.
