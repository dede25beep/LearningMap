<<<<<<< HEAD
function entrar() {
  const nome = document.getElementById("nome_login").value;
  const senha = document.getElementById("senha_login").value;

  if (nome && senha) {
    window.location.href = "main.html";
  } else {
    alert("Preencha os campos");
  }
}
=======
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
>>>>>>> f2e0eae2c0a58ceb56e2c289933497f363964975
