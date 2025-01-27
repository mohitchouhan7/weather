import { createUi } from "./weatherUi";

const searchResult = document.getElementById("searchResult");
const searchBtn = document.getElementById("search");
const clearBtn = document.getElementById("clear");
const searchInput = document.getElementById("searchField");
function clearSearchResult() {
    searchResult.innerHTML = "";
}
function buildSearchResult(results) {
    clearSearchResult();
    const temp = document.createElement("div");
    const tempCityHead = document.createElement("p");
    const tempCordHead = document.createElement("p");
    tempCityHead.textContent = "City";
    tempCordHead.textContent = "cordinates";
    temp.appendChild(tempCityHead);
    temp.appendChild(tempCordHead);
    temp.className = "citySearchResult";
    searchResult.appendChild(temp);

    results.forEach((result) => {
        const city = document.createElement("div");
        const name = document.createElement("p");
        const cords = document.createElement("p");
        const seperator = document.createElement("hr");
        let latitude = result.lat;
        let longitude = result.lon;
        latitude = latitude.toString();
        latitude = latitude.slice(0, latitude.indexOf(".") + 3);

        longitude = longitude.toString();
        longitude = longitude.slice(0, longitude.indexOf(".") + 3);
        cords.textContent = `${latitude},${longitude}`;
        name.textContent = `${result.name}, ${result.state}, ${result.country}`;
        city.appendChild(name);
        city.appendChild(cords);
        city.className = "citySearchResult";
        city.addEventListener("click", () => {
            createUi(result.lat, result.lon);
            clearSearchResult();
        });
        searchResult.appendChild(seperator);
        searchResult.appendChild(city);
    });
}
async function getLocation() {
    let searchName = searchInput.value;
    let response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${searchName}&limit=5&appid=c04840e13d6693402b11ab12a705c788`,
        { mode: "cors" }
    );
    let results = await response.json();
    buildSearchResult(results);
}
searchBtn.addEventListener("click", (event) => {
    event.preventDefault();
    getLocation();
});
clearBtn.addEventListener("click", (event) => {
    event.preventDefault();
    searchInput.value = "";
    clearSearchResult();
});
export { clearSearchResult };
