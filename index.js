// Base URL for API
const baseURL =
  "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2501-FTB-WEB-PT/events";

// Targeting HTML elements
const partyList = document.getElementById("party-list");
const partyForm = document.getElementById("party-form");

// Fetches party data from the api
async function getParties() {
  try {
    const response = await fetch(baseURL);
    const data = await response.json();
    renderParties(data.data);
  } catch (error) {
    console.error("Failed to fetch parties", error);
  }
}

// Render parties in browser
function renderParties(parties) {
  partyList.innerHTML = "";
  parties.forEach((party) => {
    const partyEl = document.createElement("div");
    partyEl.innerHTML = `
      <h3>${party.name}</h3>
      <p>${party.date}</p>
      <p>${party.location}</p>
      <p>${party.description}</p>
      <button data-id="${party.id}">Delete</button>
    `;
    partyList.appendChild(partyEl);

    const deleteBtn = partyEl.querySelector("button");
    deleteBtn.addEventListener("click", () => deleteParty(party.id));
  });
}

// Event listener for submitting new party
partyForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(partyForm);
  const newParty = {
    name: formData.get("name"),
    description: formData.get("description"),
    date: new Date(formData.get("date")).toISOString(),
    location: formData.get("location"),
  };

  // Posting new party
  try {
    const response = await fetch(baseURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newParty),
    });
    if (response.ok) {
      getParties();
      partyForm.reset();
    } else {
      throw new Error("Failed to add party");
    }
  } catch (error) {
    console.error(error);
  }
});

// Delete party from data
async function deleteParty(id) {
  try {
    const response = await fetch(`${baseURL}/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      getParties();
    } else {
      throw new Error("Failed to delete party");
    }
  } catch (error) {
    console.error(error);
  }
}


getParties();
