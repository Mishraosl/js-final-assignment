document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const resumeId = urlParams.get("id");

  // Retrieve the resumeData from local storage
  const resumeData = JSON.parse(localStorage.getItem("resumeData")) || [];

  // Debugging: Log the resumeData to check its contents
  // Find the resume data with the matching ID
  const resume = resumeData.find((data) => data.id === resumeId);
  if (resume) {
    console.log(resume);
    // Construct the resume preview HTML
    const resumePreview = `
        <h2>Resume</h2>
        <h3>Personal Information</h3>
        <p>Name: ${resume.personalInfo.name}</p>
        <p>Email: ${resume.personalInfo.email}</p>
        <p>Phone: ${resume.personalInfo.phone}</p>
        <p>Address: ${resume.personalInfo.address}</p>
        <h3>Educational Background</h3>
        <ul>
            ${resume.education
              .map(
                (edu) => `
                <li>
                    University: ${edu.university}<br>
                    Degree: ${edu.degree}<br>
                    Graduation Year: ${edu.gradYear}
                </li>
            `
              )
              .join("")}
        </ul>
        <h3>Work Experience</h3>
        <ul>
            ${resume.experience
              .map(
                (work) => `
                <li>
                    Company: ${work.company}<br>
                    Position: ${work.position}<br>
                    Duration: ${work.duration}
                </li>
            `
              )
              .join("")}
        </ul>
        <h3>Skills</h3>
        <ul>
            ${resume.skills
              .map(
                (skill) => `
                <li>
                    Skills: ${skill.skills}<br>
                </li>
            `
              )
              .join("")}
        </ul>
    `;

    document.getElementById("live-preview").innerHTML = resumePreview;

    // Add an "Edit" button click event listener
    const editButton = document.getElementById("edit-button");
    editButton.addEventListener("click", function () {
      // Redirect back to the form page with the selected ID as a query parameter
      window.location.href = `index.html?id=${resumeId}&edit=true`;
    });
  } else {
    // Handle the case where no resume data is available
    document.getElementById("live-preview").innerHTML =
      "<p>No resume data available.</p>";
  }
  const backToFormButton = document.getElementById("back-to-form");
  backToFormButton.addEventListener("click", function () {
    // Redirect back to the form page
    window.location.href = "index.html";
  });
});
