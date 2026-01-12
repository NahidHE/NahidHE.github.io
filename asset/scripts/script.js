// Render publications list on homepage with mapped author names
Promise.all([
  fetch("./data/publications.json").then((r) => r.json()),
  fetch("./data/author.json").then((r) => r.json()),
]).then(([pubData, authorData]) => {
  const publications = pubData.publications.slice(0, 3);
  const authors = authorData.author;
  const getAuthorName = (id) => {
    const found = authors.find((a) => a.id == id);
    return found ? `${found.firstName} ${found.lastName}` : "";
  };
  const container = document.getElementById("publications_container");
  if (container && publications.length) {
    let html = '<div class="publications-list">';
    publications.forEach((pub) => {
      const authorNames = pub.authors.map(getAuthorName).join(", ");
      html += `
        <a href="${pub.link}" target="_blank" class="publication-box">
          <div class="publication-title">${pub.title}</div>
          <div class="publication-authors">${authorNames}</div>
          <div class="publication-meta">${pub.journal_conference}, ${pub.year}</div>
        </a>
      `;
    });
    html += "</div>";
    container.innerHTML = html;
  }
});
// import experienceData from '../data/experience.json' assert { type: 'json' };
fetch("./data/experience.json")
  .then((response) => response.json())
  .then((data) => {
    const experienceList = data.experience;
    const section = document.querySelector("#experience_container");
    if (section && Array.isArray(experienceList)) {
      let html = '<ul class="experience-list">';
      experienceList.forEach((exp) => {
        html += `
          <li class="experience-item">
            <div class="experience-flex">
              <div class="experience-logo-wrap">
                <img src="./${exp.logo}" alt="${exp.company} logo" class="experience-logo" />
              </div>
              <div class="experience-details">
                <h3 class="experience-position">${exp.position}</h3>
                <div class="experience-company">${exp.company}</div>
                <div class="experience-duration">${exp.duration}</div>
                <div class="experience-location">${exp.location}</div>
                <div class="experience-description">${exp.description}</div>
              </div>
            </div>
          </li>
        `;
      });
      html += "</ul>";
      section.innerHTML = html;
    }
  });

// Render education section (same visual style as experience)
fetch("./data/education.json")
  .then((res) => res.json())
  .then((eduData) => {
    const list = eduData.education;
    const container = document.getElementById("education_container");
    if (container && Array.isArray(list)) {
      let html = '<ul class="experience-list">';
      list.forEach((ed) => {
        // decide logo path: if contains '/' use as-is, otherwise look in asset/images
        let logoPath = ed.logo || "";
        if (logoPath && !logoPath.includes("/")) {
          logoPath = `asset/logos/${logoPath}`;
        }
        // ensure relative path from script: prefix ./
        if (logoPath && !logoPath.startsWith("./")) logoPath = "./" + logoPath;

        html += `
          <li class="experience-item">
            <div class="experience-flex">
              <div class="experience-logo-wrap">
                <img src="${logoPath}" alt="${
          ed.institute
        } logo" class="experience-logo" />
              </div>
              <div class="experience-details">
                <h3 class="experience-position">${ed.degree}</h3>
                <div class="experience-company">${ed.institute}</div>
                <div class="experience-duration">${ed.year || ""}</div>
              </div>
            </div>
          </li>
        `;
      });
      html += "</ul>";
      container.innerHTML = html;
    }
  })
  .catch((err) => console.error("Failed to load education.json", err));
