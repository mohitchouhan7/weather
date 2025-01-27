import "./style.css";
import { clearSearchResult } from "./search";
import { createUi } from "./weatherUi";

const mainElement = document.querySelector("main");

mainElement.addEventListener("click", () => clearSearchResult());
createUi(21.71, 75.85);
