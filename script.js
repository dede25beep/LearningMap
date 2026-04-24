function entrar() {
  const nome = document.getElementById("nome_login").value;
  const senha = document.getElementById("senha_login").value;

  if (nome && senha) {
    window.location.href = "main.html";
  } else {
    alert("Preencha os campos");
  }
}