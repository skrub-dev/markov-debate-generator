const fs = require('fs');

// Generates debate with Trump and Biden using Markov Chains
// Possibly Todo:
// - Create Website
// - Add Chris Wallace
// - Optimize for future debates
// - Malarky Adder
// - Similar to above but for Trump

// Function to Generate a Markov Chain
// Also See: https://en.wikipedia.org/wiki/Markov_chain
function generate_markov_chain(markovTextInput) {
  const markovChain = {};
  const textArray = markovTextInput.split(' ');
  for (let mot = 0; mot < textArray.length; mot++) {
      let word = textArray[mot].toLowerCase().replace(/[\W_]/, "");
      if (!markovChain[word]) markovChain[word] = [];
      if (textArray[mot + 1]) markovChain[word].push(textArray[mot + 1].toLowerCase().replace(/[\W_]/, ""));
  }
  const words = Object.keys(markovChain);
  let word = words[Math.floor(Math.random() * words.length)];
  let result = "";
  for (let mot = 0; mot < words.length; mot++) {
      result += word + " ";
      word = markovChain[word][Math.floor(Math.random() * markovChain[word].length)];
      if (!word || !markovChain.hasOwnProperty(word)) word = words[Math.floor(Math.random() * words.length)];
  }
  return result;
}

// Create a random number (I hate randomness in js)
function getRandInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

// Extract the speech from the debate_transcript.txt file
function extract_speech(file) {
  try {
    const data = fs.readFileSync(file, 'UTF-8');
    const lines = data.split(/\r?\n/);
    const bidenList = [];
    const trumpList = [];
  
    for (i = 0; i < lines.length-1; i++) {
        if (i+1 > lines.length-1) return;
        if (lines[i].startsWith("Vice President Joe Biden:")) bidenList.push(lines[i+1]);
        else if (lines[i].startsWith("President Donald J. Trump:")) trumpList.push(lines[i+1]);
    }
    return {"biden": bidenList.join(" "), "trump": trumpList.join(" ")};
    
  } catch (err) {
    throw err;
  }
}

// Put said speech in the markov chain machine!
function synthesize_speech(bidenMinSentenceSize, bidenMaxSentenceSize, trumpMinSentenceSize, trumpMaxSentenceSize) {
  var speech = extract_speech("debate_transcript.txt");
  var biden_markov = generate_markov_chain(speech.biden).split(" ");
  var trump_markov = generate_markov_chain(speech.trump).split(" ");
  var bidenWords = "";
  var trumpWords = "";
  var end_result = "";
  while (biden_markov.length != 0 && trump_markov.length != 0) {
    bidenWords = "";
    trumpWords = "";
    for (i = 0; i < getRandInteger(bidenMinSentenceSize, bidenMaxSentenceSize); i++) if (!!biden_markov.length) bidenWords += biden_markov.shift() + " ";
    for (i = 0; i < getRandInteger(trumpMinSentenceSize, trumpMaxSentenceSize); i++) if (!!trump_markov.length) trumpWords += trump_markov.shift() + " ";
    end_result += `Vice President Joe Biden:\n${bidenWords}\n\nPresident Donald J. Trump:\n${trumpWords}\n\n`;
  }
  return end_result;
}

//Output this to txt file
fs.appendFile("new_debate.txt", synthesize_speech(31, 1, 31, 1), function lol(lmao) {});