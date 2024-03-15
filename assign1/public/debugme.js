import {secret} from "./secret.js?";

const ANSWER_LEN = 8;

const checkAnswer = (answer) => {
  /* If there is no secret, an error should have been printed already, so we stop here. */
  if (!secret) return;

  let correct = secret.slice(0, ANSWER_LEN);
  if (answer === correct) {
    console.log("Success! You entered the correct answer.");
    return false;
  } else {
    console.error("Your answer is not correct.");
    return true;
  }
};
export default checkAnswer;