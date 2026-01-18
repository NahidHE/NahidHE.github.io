// Code to render publication page
let allPublications = [];
let authorData = [];
let currentFilter = "All";

// Fetch and render publications on page load
document.addEventListener("DOMContentLoaded", function () {
  loadPublications();
  setupFilterButtons();
});

function loadPublications() {
  // Fetch author data first, then publications
  fetch("../../data/author.json")
    .then((response) => response.json())
    .then((data) => {
      authorData = data.author || [];
      console.log("Authors loaded:", authorData.length);

      // After authors loaded, fetch publications
      return fetch("../../data/publications.json");
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load publications");
      }
      return response.json();
    })
    .then((data) => {
      allPublications = data.publications || [];
      console.log("Publications loaded:", allPublications.length);
      console.log("Author data available:", authorData.length);
      renderPublications(allPublications);
    })
    .catch((error) => {
      console.error("Error loading data:", error);
      const publicationsList = document.getElementById("publications_list");
      if (publicationsList) {
        publicationsList.innerHTML =
          '<p style="text-align: center; padding: 40px; color: red;">Error loading publications. Please refresh the page.</p>';
      }
    });
}

function setupFilterButtons() {
  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      // Add active class to clicked button
      this.classList.add("active");

      // Filter and render publications
      const filterType = this.dataset.filter;
      console.log("Filter selected:", filterType);

      if (filterType === "All") {
        renderPublications(allPublications);
      } else {
        const filtered = allPublications.filter(
          (pub) => pub.type === filterType,
        );
        console.log("Filtered publications:", filtered.length);
        renderPublications(filtered);
      }
    });
  });
}

function renderPublications(publications) {
  const publicationsList = document.getElementById("publications_list");

  if (!publicationsList) {
    console.error("publications_list element not found");
    return;
  }

  publicationsList.innerHTML = "";

  if (!publications || publications.length === 0) {
    publicationsList.innerHTML =
      '<p style="text-align: center; padding: 40px;">No publications found.</p>';
    return;
  }

  publications.forEach((publication) => {
    const pubBox = document.createElement("div");
    pubBox.className = "publication-box";

    // Get authors names
    let authorNames = "Unknown";
    if (publication.authors && publication.authors.length > 0) {
      const names = publication.authors
        .map((authorIndex) => {
          if (authorData && authorData[authorIndex]) {
            const author = authorData[authorIndex];
            return `${author.firstName} ${author.lastName}`;
          }
          return "";
        })
        .filter((name) => name !== "")
        .join(", ");

      if (names) {
        authorNames = names;
      }
    }

    // Build publication HTML
    pubBox.innerHTML = `
      <div class="publication-content">
        <div class="publication-title">${publication.title}</div>
        <div class="publication-authors">${authorNames}</div>
        <div class="publication-venue">${publication.journal_conference} (${publication.year})</div>
      </div>
      <div class="publication-actions">
        <a href="${publication.link || "#"}" target="_blank" rel="noopener noreferrer" class="pub-btn read-btn">Read</a>
        <button class="pub-btn cite-btn" onclick="copyCitation('${publication.citation.replace(/'/g, "\\'")}')">Cite</button>
      </div>
    `;

    publicationsList.appendChild(pubBox);
  });

  console.log("Rendered publications:", publications.length);
}

function copyCitation(citation) {
  navigator.clipboard
    .writeText(citation)
    .then(() => {
      alert("Citation copied to clipboard!");
    })
    .catch(() => {
      alert("Failed to copy citation. Please try again.");
    });
}
