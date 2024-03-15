const QUESTIONS = [
  "sunetid", "name", "pronouns", "classYear", "major",
  "topicInterest", "priorWebdev", "favCSExp", "anythingElse"
];

const collectAnswers = (survey) => {
  let answers = {};
  let extra = new Set(Object.keys(survey));
  for (let key of QUESTIONS) {
    if (!(key in survey)) {
      console.error(`Missing question: ${key}`);
      return null;
    }
    let answer = survey[key];
    if (answer.includes("TODO")) {
      console.warn(`Answer to ${key} has TODO`);
      return null;
    }
    answers[key] = answer;
    extra.delete(key);
  }
  if (extra.size) {
    console.error(`Unrecognized question(s): ${Array.from(extra).join(", ")}`);
    return null;
  }
  return answers;
};

let SURVEY = null;

const saveAnswers = async () => {
  if (!SURVEY) {
    console.error("Error reading survey.js or missing answers. See above messages (or refresh if the console is empty).");
    return;
  }
  let res = await fetch(`/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(SURVEY)
  });
  let json = await res.json();
  if (!json.success) {
    console.error("Something went wrong while saving answers. You may have to check your terminal window for a Noje.js error.");
    return;
  }
  console.log("You're all set! You should now have an answers.json file in your assignment directory.");
  console.log("Please submit your assignment directory to Paperless to complete the assignment.");
};
window.saveAnswers = saveAnswers;

const main = async () => {
  document.querySelector("#load-error").style.display = "none";
  document.querySelector("#assign0").style.display = "";

  console.log("Page loaded successfully");
  try {
    let survey = await import("/survey.js");
    SURVEY = collectAnswers(survey);
    if (SURVEY) {
      window.SURVEY = SURVEY;
      console.log("All answers found:", SURVEY);
      console.log("Please call saveAnswers() to continue");
    }
  } catch (e) {
    console.error("Error importing survey.js. Please check your syntax:");
    console.error(e);
  }
};
main();
