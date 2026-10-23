const API_BASE_URL = "https://sim-activation-portal-3vdh.onrender.com/api";

// Display a result message on the page.
function showResult(elementId, message, success) {
  const element = document.getElementById(elementId);
  element.textContent = message;
  element.className = success ? "result text-green-700" : "result text-red-600";
}

// 1. Validate SIM
document.getElementById("simForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const simNumber = document.getElementById("simNumber").value.trim();
  const resultElement = document.getElementById("simResult");

  showResult("simResult", "Checking SIM...", true);

  try {
    const response = await fetch(
      `${API_BASE_URL}/sims/validate?simNumber=${encodeURIComponent(simNumber)}`,
    );

    if (response.status === 404) {
      showResult("simResult", "SIM not found in the database.", false);
      return;
    }

    if (!response.ok) {
      throw new Error("SIM validation failed.");
    }

    const message = await response.text();
    showResult(
      "simResult",
      message,
      message.includes("available for activation"),
    );
  } catch (error) {
    showResult(
      "simResult",
      "Cannot connect to the backend. Check that Spring Boot is running.",
      false,
    );
    console.error(error);
  }
});

// 2. Validate customer by email and date of birth
document
  .getElementById("customerForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("customerEmail").value.trim();
    const dateOfBirth = document.getElementById("customerDob").value;

    showResult("customerResult", "Validating customer...", true);

    const params = new URLSearchParams({ email, dateOfBirth });

    try {
      const response = await fetch(
        `${API_BASE_URL}/customers/validate-by-dob?${params.toString()}`,
      );

      if (response.status === 404) {
        showResult(
          "customerResult",
          "Customer details did not match a record.",
          false,
        );
        return;
      }

      if (!response.ok) {
        throw new Error("Customer validation failed.");
      }

      const data = await response.json();
      showResult(
        "customerResult",
        typeof data === "string" ? data : JSON.stringify(data),
        true,
      );
    } catch (error) {
      showResult(
        "customerResult",
        "Could not validate the customer. Check the backend and API response.",
        false,
      );
      console.error(error);
    }
  });

// 3. Load active special offers
async function loadOffers() {
  const container = document.getElementById("offersContainer");
  container.replaceChildren();

  const loadingMessage = document.createElement("p");
  loadingMessage.textContent = "Loading offers...";
  container.appendChild(loadingMessage);

  try {
    const response = await fetch(`${API_BASE_URL}/offers`);

    if (!response.ok) {
      throw new Error("Unable to load offers.");
    }

    const offers = await response.json();
    container.replaceChildren();

    if (offers.length === 0) {
      const message = document.createElement("p");
      message.textContent = "No active offers are available.";
      container.appendChild(message);
      return;
    }

    offers.forEach((offer) => {
      const card = document.createElement("article");
      card.className = "offer-card";

      const title = document.createElement("h3");
      title.className = "text-xl font-bold text-slate-800";
      title.textContent = offer.title;

      const description = document.createElement("p");
      description.className = "mt-2 text-slate-600";
      description.textContent = offer.description;

      const price = document.createElement("p");
      price.className = "offer-price mt-4";
      price.textContent = `₹${offer.price}`;

      const validity = document.createElement("p");
      validity.className = "mt-1 text-sm text-slate-500";
      validity.textContent = `${offer.validityDays} days validity`;

      card.append(title, description, price, validity);
      container.appendChild(card);
    });
  } catch (error) {
    container.replaceChildren();

    const message = document.createElement("p");
    message.className = "text-red-600";
    message.textContent =
      "Could not load offers. Check Spring Boot, CORS, and your API.";
    container.appendChild(message);

    console.error(error);
  }
}

document.getElementById("refreshOffers").addEventListener("click", loadOffers);

/* 4. Validate first name, last name and email */
document
  .getElementById("nameValidationForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const params = new URLSearchParams({
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      email: document.getElementById("validationEmail").value.trim(),
    });

    showResult("nameValidationResult", "Checking customer...", true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/customers/validate?${params.toString()}`,
      );

      const body = await response.text();

      if (!response.ok) {
        showResult(
          "nameValidationResult",
          body || "Customer details did not match.",
          false,
        );
        return;
      }

      showResult(
        "nameValidationResult",
        body || "Customer details validated successfully.",
        true,
      );
    } catch (error) {
      showResult(
        "nameValidationResult",
        "Could not connect to the backend.",
        false,
      );
      console.error(error);
    }
  });

/* 5. Update customer address */
document
  .getElementById("addressForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = document.getElementById("addressCustomerId").value;
    const address = document.getElementById("newAddress").value.trim();

    showResult("addressResult", "Updating address...", true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/customers/${encodeURIComponent(id)}/address`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ address }),
        },
      );

      const body = await response.text();

      if (!response.ok) {
        showResult(
          "addressResult",
          body || `Address update failed (${response.status}).`,
          false,
        );
        return;
      }

      showResult(
        "addressResult",
        body || "Address updated successfully.",
        true,
      );
    } catch (error) {
      showResult("addressResult", "Could not connect to the backend.", false);
      console.error(error);
    }
  });

/* 6. Validate ID proof */
document
  .getElementById("idProofForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const params = new URLSearchParams({
      idProofType: document.getElementById("idProofType").value,
      idProofNumber: document.getElementById("idProofNumber").value.trim(),
    });

    showResult("idProofResult", "Checking ID proof...", true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/customers/validate-id-proof?${params.toString()}`,
      );

      const body = await response.text();

      if (!response.ok) {
        showResult(
          "idProofResult",
          body || "ID proof details did not match.",
          false,
        );
        return;
      }

      showResult(
        "idProofResult",
        body || "ID proof details matched a stored record.",
        true,
      );
    } catch (error) {
      showResult("idProofResult", "Could not connect to the backend.", false);
      console.error(error);
    }
  });

// Load offers when the page opens.
loadOffers();
