// esperar o DOM carregar
document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".topics-nav a");

  navLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");         // "#Início", "#Ferramentas", etc.
      const targetSection = document.querySelector(targetId);

      // esconde todas as sections
      document.querySelectorAll("section[id]").forEach(section => {
        section.style.display = "none";
      });

      // mostra só a clicada e rola suave
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


