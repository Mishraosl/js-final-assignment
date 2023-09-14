function createEntriesPreview(entries) {
  let previewHTML = "";
  entries.forEach((entry) => {
    previewHTML += "<ul>";
    for (const key in entry) {
      if (entry.hasOwnProperty(key)) {
        previewHTML += `<li><strong>${key}:</strong> ${entry[key]}</li>`;
      }
    }
    previewHTML += "</ul>";
  });
  return previewHTML;
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("resume-form");
  const livePreview = document.getElementById("live-preview");
  const previewImage = document.getElementById("preview-image");
  const urlParams = new URLSearchParams(window.location.search);
  const resumeId = urlParams.get("id");
  const isEditing = urlParams.get("edit") === "true"; // Check if we are in edit mode

  // Initialize resumeData as an array of objects
  let resumeData = [];

  // Retrieve the resumeData from local storage if it exists
  const storedResumeData = JSON.parse(localStorage.getItem("resumeData"));
  if (storedResumeData) {
    resumeData = storedResumeData;
  }

  // Find the resume data with the matching ID
  const resume = resumeData.find((data) => data.id === resumeId);

  if (isEditing && resume) {
    // Fill in the form fields with the resume data
    form.name.value = resume.personalInfo.name;
    form.email.value = resume.personalInfo.email;
    form.phone.value = resume.personalInfo.phone;
    form.address.value = resume.personalInfo.address;
    previewImage.src = resume.personalInfo.photo;
    populateEntries("education", resume.education);
    populateEntries("experience", resume.experience);
    populateEntries("skills", resume.skills);

    // Update the live preview
    updatePreview();
  }

  document.getElementById("photo").addEventListener("change", function () {
    const fileInput = this;
    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        previewImage.src = e.target.result;
      };
      reader.readAsDataURL(fileInput.files[0]);
    }
  });

  const eduBtn = document.getElementById("edu-button");
  eduBtn.addEventListener("click", () => {
    createEducationEntry();
  });

  function createEducationEntry() {
    const educationSection = document.getElementById("education-section");
    const eduNewDiv = createEntryDiv("education-entry");
    const deleteButton = getDeleteButton();

    const university = createLabelInput("university", "University:", "text");
    const degree = createLabelInput("degree", "Degree:", "text");
    const gradYear = createLabelInput("grad-year", "Graduation Year:", "text");

    eduNewDiv.appendChild(deleteButton);
    eduNewDiv.appendChild(university);
    eduNewDiv.appendChild(degree);
    eduNewDiv.appendChild(gradYear);

    educationSection.appendChild(eduNewDiv);

    deleteButton.addEventListener("click", () => {
      eduNewDiv.remove();
      updatePreview();
    });
  }

  const workXpButton = document.getElementById("work-xp-button");
  workXpButton.addEventListener("click", () => {
    createWorkExperienceEntry();
  });

  function createWorkExperienceEntry() {
    const workXpSection = document.getElementById("experience-section");
    const workXpNewDiv = createEntryDiv("experience-entry");
    const deleteButton = getDeleteButton();

    const compName = createLabelInput("company", "Company Name:", "text");
    const position = createLabelInput("position", "Position:", "text");
    const duration = createLabelInput("duration", "Duration:", "text");

    workXpNewDiv.appendChild(deleteButton);
    workXpNewDiv.appendChild(compName);
    workXpNewDiv.appendChild(position);
    workXpNewDiv.appendChild(duration);

    workXpSection.appendChild(workXpNewDiv);
    deleteButton.addEventListener("click", () => {
      workXpNewDiv.remove();
      updatePreview();
    });
  }

  const skillsButton = document.getElementById("skills-button");
  skillsButton.addEventListener("click", () => {
    createSkillsEntry();
  });

  function createSkillsEntry() {
    const skillsSection = document.getElementById("skills-section");
    const skillsNewDiv = createEntryDiv("skills-entry");
    const deleteButton = getDeleteButton();

    const skills = createLabelInput("skills", "Skills:", "text");

    skillsNewDiv.appendChild(deleteButton);
    skillsNewDiv.appendChild(skills);

    skillsSection.appendChild(skillsNewDiv);

    deleteButton.addEventListener("click", () => {
      skillsNewDiv.remove();
      updatePreview();
    });
  }

  function createEntryDiv(className) {
    const entryDiv = document.createElement("div");
    entryDiv.className = className;
    return entryDiv;
  }

  function createLabelInput(elementDetail, elementName, inputType) {
    const labelTag = document.createElement("label");
    const inputTag = document.createElement("input");

    labelTag.htmlFor = elementDetail;
    labelTag.innerText = elementName;

    inputTag.className = "form-control";
    inputTag.id = elementDetail;
    inputTag.type = inputType;
    inputTag.name = elementDetail;

    const outerDiv = document.createElement("div");
    outerDiv.className = "form-group";

    outerDiv.appendChild(labelTag);
    outerDiv.appendChild(inputTag);
    return outerDiv;
  }

  function getDeleteButton() {
    const deleteButtonDiv = document.createElement("div");
    const deleteButton = document.createElement("a");
    deleteButton.className = "btn btn-success btn-sm toggle-section";
    deleteButton.innerText = "Delete";
    deleteButtonDiv.appendChild(deleteButton);

    return deleteButtonDiv;
  }

  // Function to populate entries for a specific section
  function populateEntries(sectionName, entries) {
    const section = document.getElementById(`${sectionName}-section`);

    entries.forEach((entryData) => {
      const entryDiv = createEntryDiv(`${sectionName}-entry`);
      const deleteButton = getDeleteButton();

      Object.keys(entryData).forEach((key) => {
        const input = createLabelInput(
          key,
          key.charAt(0).toUpperCase() + key.slice(1) + ":",
          "text"
        );
        input.querySelector("input").value = entryData[key];
        entryDiv.appendChild(input);
      });

      entryDiv.appendChild(deleteButton);
      section.appendChild(entryDiv);

      deleteButton.addEventListener("click", () => {
        entryDiv.remove();
        updatePreview();
      });
    });
  }

  // Function to update the live preview
  function updatePreview() {
    // Construct the resume preview here (include multiple entries)

    // Personal Information
    const personalInfo = {
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      address: form.address.value,
      photo: previewImage.src,
    };

    // Educational Background
    const education = gatherEntries("education-entry");

    // Work Experience
    const experience = gatherEntries("experience-entry");

    // Skills
    const skills = gatherEntries("skills-entry");

    // Create the resume preview HTML
    const resumePreview = `
    <h2>${personalInfo.name}</h2>
    <p>Email: ${personalInfo.email}</p>
    <p>Phone: ${personalInfo.phone}</p>
    <p>Address: ${personalInfo.address}</p>
    <img src="${personalInfo.photo}" alt="Preview Image">
    <h2>Educational Background</h2>
    ${createEntriesPreview(education)}
    <h2>Work Experience</h2>
    ${createEntriesPreview(experience)}
    <h2>Skills</h2>
    ${createEntriesPreview(skills)}
  `;

    // Update the live preview
    livePreview.innerHTML = resumePreview;
  }

  // Function to gather entries of a specific section
  function gatherEntries(entryClassName) {
    const entries = [];
    const entryDivs = document.querySelectorAll(`.${entryClassName}`);
    entryDivs.forEach((entryDiv) => {
      const entryData = {};
      entryDiv.querySelectorAll("input").forEach((input) => {
        entryData[input.name] = input.value;
      });
      entries.push(entryData);
    });
    return entries;
  }
  // Listen to input events on form elements
  form.addEventListener("input", updatePreview);

  // Function to generate a unique ID for each resume entry
  function generateUniqueId() {
    return "_" + Math.random().toString(36).substr(2, 9);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission behavior
    const newResumeId = resumeId || generateUniqueId();

    // Create a new resume entry in the resumeData array
    const newResume = {
      id: newResumeId,
      personalInfo: {
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value,
        address: form.address.value,
        photo: previewImage.src,
      },
      education: gatherEntries("education-entry"),
      experience: gatherEntries("experience-entry"),
      skills: gatherEntries("skills-entry"),
    };

    // Push the new resume entry into the resumeData array
    resumeData.push(newResume);

    // Store the updated resumeData in local storage
    localStorage.setItem("resumeData", JSON.stringify(resumeData));
    form.reset();
    updatePreview();

    // Redirect to a new page where you can display the generated resume
    window.location.href = `resume.html?id=${newResumeId}`;
  });
});
