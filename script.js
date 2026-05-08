import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = 'https://zzxignsbakvesqbgcqhu.supabase.co'
const supabaseKey = 'sb_publishable_xObUJV-_2JLp1ET127b71Q_rNNSgdmB'

const supabase = createClient(supabaseUrl, supabaseKey)

document.addEventListener('DOMContentLoaded', async function () {
  configurarNavegacaoSidebar()
  configurarTelaLogin()
  await protegerPaginasPrivadas()
})

function configurarNavegacaoSidebar() {
  const navLinks = document.querySelectorAll('.sidebar a')

  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href')

      if (!targetId || !targetId.startsWith('#')) {
        return
      }

      e.preventDefault()

      const targetSection = document.querySelector(targetId)

      document.querySelectorAll('section[id]').forEach(section => {
        section.style.display = 'none'
      })

      if (targetSection) {
        targetSection.style.display = 'block'
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'  
        })
      }
    })
  })
}

function configurarTelaLogin() {
  const loginSection = document.querySelector('#login')
  const registerSection = document.querySelector('#register')

  const showRegister = document.querySelector('#show-register')
  const showLogin = document.querySelector('#show-login')

  const loginForm = document.querySelector('#login-form')
  const registerForm = document.querySelector('#register-form')

  if (showRegister && loginSection && registerSection) {
    showRegister.addEventListener('click', function (e) {
      e.preventDefault()
      loginSection.style.display = 'none'
      registerSection.style.display = 'block'
    })
  }

  if (showLogin && loginSection && registerSection) {
    showLogin.addEventListener('click', function (e) {
      e.preventDefault()
      registerSection.style.display = 'none'
      loginSection.style.display = 'block'
    })
  }

  if (registerForm) {
    registerForm.addEventListener('submit', cadastrarUsuario)
  }

  if (loginForm) {
    loginForm.addEventListener('submit', logarUsuario)
  }
}

async function cadastrarUsuario(event) {
  event.preventDefault()

  const email = document.querySelector('#register-email').value
  const password = document.querySelector('#register-password').value
  const message = document.querySelector('#register-message')

  message.textContent = 'Criando conta...'

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password
  })

  if (error) {
    message.textContent = `Erro ao cadastrar: ${error.message}`
    return
  }

  message.textContent = 'Conta criada com sucesso. Agora faça login.'

  console.log('Usuário cadastrado:', data)
}

async function logarUsuario(event) {
  event.preventDefault()

  const email = document.querySelector('#login-email').value
  const password = document.querySelector('#login-password').value
  const message = document.querySelector('#login-message')

  message.textContent = 'Entrando...'

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  })

  if (error) {
    message.textContent = `Erro ao entrar: ${error.message}`
    return
  }

  message.textContent = 'Login realizado com sucesso.'

  console.log('Sessão:', data.session)
  console.log('Usuário:', data.user)

  window.location.href = 'dashboard.html'
}

async function protegerPaginasPrivadas() {
  const paginaAtual = window.location.pathname

  const paginasPrivadas = [
    'dashboard.html'
  ]

  const estaEmPaginaPrivada = paginasPrivadas.some(pagina => {
    return paginaAtual.endsWith(pagina)
  })

  if (!estaEmPaginaPrivada) {
    return
  }

  const { data, error } = await supabase.auth.getSession()

  if (error) {
    console.error('Erro ao verificar sessão:', error.message)
    window.location.href = 'login.html'
    return
  }

  if (!data.session) {
    window.location.href = 'login.html'
  }
}

async function logout() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Erro ao sair:', error.message)
    return
  }

  window.location.href = 'login.html'
}

window.logout = logout