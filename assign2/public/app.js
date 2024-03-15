import Card from "./card.js";
import Mover from "./mover.js";

export default class App {
  constructor() {
    this.mover = new Mover();
    document.getElementById("addButton").addEventListener("click", (event)=>{
      event.preventDefault();
      let cardTitle = document.getElementById("cardTitle");
      let cardColor = document.getElementById("cardColor")
      let title = cardTitle.value;
      let color = cardColor.value;
      if (!title) {
        alert("you should give the cardTitle");
        return;
      }
      this.addCard("todo", title, color);//DOM对象引用了this(app)
      cardTitle.value = null;
      cardColor.value = null;
    });
  }

  addCard(col, title, color) {
    let card = new Card(title, color);
    card.addToCol(col, this.mover);
    return card;
  }
}
