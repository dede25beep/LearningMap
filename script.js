document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".sidebar a");

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

const container = document.getElementById('ias');

container.addEventListener('toggle', (e) => {
  if (!e.target.open) return; // ignora eventos de fechar

  container.querySelectorAll('details[open]').forEach(d => {
    if (d !== e.target) d.removeAttribute('open');
  });
}, true);
