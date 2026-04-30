document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".topics-nav a");

  navLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");       
      const targetSection = document.querySelector(targetId);

   
      document.querySelectorAll("section[id]").forEach(section => {
        section.style.display = "none";
      });

    
      if (targetSection) {
        targetSection.style.display = "block";
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });
});

