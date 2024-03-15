/* The text to use when description is empty */
const NO_DESCRIPTION_TEXT = "(No description)";

export default class Card {
  constructor(title, color) {
    let templateCard = document.querySelector(".template");
    this.title = title;
    this.color = color;
    this.card = templateCard.cloneNode(true);
    this.description = this.card.querySelector(".description");
    this.editDescription = this.card.querySelector(".editDescription");
    this.editButton = this.card.querySelector(".buttons .edit");
    this.deleteButton = this.card.querySelector(".buttons .delete");
    this.startMoveButton = this.card.querySelector(".buttons .startMove");

    this.card.classList.remove("template");
    this.card.style.background = this.color;
    this.card.querySelector(".title").textContent = this.title;
    this.description.textContent = NO_DESCRIPTION_TEXT;
  }

  addToCol(colElem, mover) {
    mover.stopMoving();
    let toDoSection = document.getElementById(colElem);
    toDoSection.append(this.card);

    this.editDescription.addEventListener("blur", (event)=>{
      event.preventDefault();
      this.setDescription(event.currentTarget.value);
      this.description.classList.remove("hidden");
      this.editDescription.classList.add("hidden");
    });

    this.editButton.addEventListener("click", (event)=>{
      event.preventDefault();
      this.description.classList.add("hidden");
      this.editDescription.classList.remove("hidden");
    });
    
    this.deleteButton.addEventListener("click", (event)=>{
      event.preventDefault();
      mover.stopMoving();
      this.card.remove();
    });

    this.startMoveButton.addEventListener("click", (event)=>{
      event.preventDefault();
      mover.stopMoving();
      this.card.classList.add("moving");
      mover.startMoving(this.card);
    });
  }

  setDescription(text) {
    if (!text || text.length == 0) {
      return;
    }
    this.description.textContent = text;
  }
}
