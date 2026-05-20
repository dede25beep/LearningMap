import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = 'https://zzxignsbakvesqbgcqhu.supabase.co'
const supabaseKey = 'sb_publishable_xObUJV-_2JLp1ET127b71Q_rNNSgdmB'

const supabase = createClient(supabaseUrl, supabaseKey)

document.addEventListener('DOMContentLoaded', async function () {
  configurarNavegacaoSidebar()
  configurarTelaLogin()
  configurarFiltros()
  await redirecionarSeJaEstiverLogado()
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

      if (!targetSection) {
        return
      }

      document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('is-active')
      })

      targetSection.classList.add('is-active')

      targetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
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

      loginSection.classList.remove('is-active')
      registerSection.classList.add('is-active')
    })
  }

  if (showLogin && loginSection && registerSection) {
    showLogin.addEventListener('click', function (e) {
      e.preventDefault()

      registerSection.classList.remove('is-active')
      loginSection.classList.add('is-active')
    })
  }

  if (registerForm) {
    registerForm.addEventListener('submit', cadastrarUsuario)
  }

  if (loginForm) {
    loginForm.addEventListener('submit', logarUsuario)
  }
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

async function logout() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Erro ao sair:', error.message)
    return
  }

  window.location.href = 'login.html'
}

async function redirecionarSeJaEstiverLogado() {
  const paginaAtual = window.location.pathname

  const estaNoLogin = paginaAtual.endsWith('login.html')

  if (!estaNoLogin) {
    return
  }

  const { data, error } = await supabase.auth.getSession()

  if (error) {
    console.error('Erro ao verificar sessão:', error.message)
    return
  }

  if (data.session) {
    window.location.href = 'dashboard.html'
  }
}

window.logout = logout

function configurarFiltros() {
  const filtros = document.querySelectorAll('.filtro-btn')
  const cards = document.querySelectorAll('.cards > div')

  if (!filtros.length || !cards.length) return

  filtros.forEach(filtro => {
    filtro.addEventListener('change', () => {
      const categoria = filtro.getAttribute('data-categoria')

      if (categoria === 'todas' && filtro.checked) {
        filtros.forEach(f => {
          if (f !== filtro) f.checked = false
        })
      } else if (categoria !== 'todas' && filtro.checked) {
        const todas = document.querySelector('.filtro-btn[data-categoria="todas"]')
        if (todas) todas.checked = false
      }

      aplicarFiltros()
    })
  })

  function aplicarFiltros() {
    const selecionados = Array.from(filtros)
      .filter(f => f.checked && f.getAttribute('data-categoria') !== 'todas')
      .map(f => f.getAttribute('data-categoria'))

    const isTodasSelected = document.querySelector('.filtro-btn[data-categoria="todas"]')?.checked

    cards.forEach(card => {
      // Se não há nenhum filtro selecionado ou a opção "todas" está marcada, exibe todos
      if (selecionados.length === 0 || isTodasSelected) {
        card.style.display = ''
      } else {
        // Exibe o card se ele tiver ao menos uma das categorias selecionadas
        const cardClasses = Array.from(card.classList)
        const match = selecionados.some(sel => cardClasses.includes(sel))
        card.style.display = match ? '' : 'none'
      }
    })
  }
}
