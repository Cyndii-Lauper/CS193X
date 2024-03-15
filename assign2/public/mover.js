/* Text to add to the move here button */
const MOVE_HERE_TEXT = "— Move here —";

export default class Mover {
  constructor() {
    this.selectedCard = null;
    this.buttonArrays = []
  }

  startMoving(card) {
    this.selectedCard = card;
    let excludeCard = document.querySelector(".template");
    let cardCollection = document.querySelectorAll(".card");
    let columnTileCollection = document.querySelectorAll(".columnTitle");
    for (let i of cardCollection) {
      if (i == excludeCard) {
        continue;
      }
      i.after(this._createMoveHereButton());
    }
    for (let i of columnTileCollection) {
      i.after(this._createMoveHereButton());
    }
  }

  stopMoving() {
    if (this.selectedCard) {
      this.selectedCard.classList.remove("moving");
    }
    for (let i of this.buttonArrays) {
      i.remove();
    }
    this.buttonArrays = [];
  }

  _createMoveHereButton() {
    let button = document.createElement("button");
    button.textContent = MOVE_HERE_TEXT;
    button.classList.add("moveHere");
    button.addEventListener("click", (event)=>{
      event.preventDefault();
      button.after(this.selectedCard);
      this.stopMoving();
    });
    this.buttonArrays.push(button);
    return button;
  }
}
