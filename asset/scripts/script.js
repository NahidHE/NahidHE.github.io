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
