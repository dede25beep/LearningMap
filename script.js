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
  const searchForm = document.querySelector('.search-box')
  const searchInput = document.querySelector('.search-box input[type="search"]')

  if (!filtros.length || !cards.length) return

  filtros.forEach(filtro => {
    filtro.addEventListener('click', () => {
      // Limpa a search box ao selecionar um filtro
      if (searchInput && searchInput.value !== '') {
        searchInput.value = ''
      }

      const categoria = filtro.getAttribute('data-categoria')
      const isEspecial = categoria === 'gratuito' || categoria === 'limitado'

      if (isEspecial) {
        // Se for um filtro especial, ele alterna (toggle)
        if (filtro.classList.contains('is-active')) {
          filtro.classList.remove('is-active')
        } else {
          // Desmarca o outro filtro especial
          filtros.forEach(f => {
            const cat = f.getAttribute('data-categoria')
            if (cat === 'gratuito' || cat === 'limitado') f.classList.remove('is-active')
          })
          filtro.classList.add('is-active')
        }
      } else {
        // Apenas um filtro normal ativo por vez
        filtros.forEach(f => {
          const cat = f.getAttribute('data-categoria')
          if (cat !== 'gratuito' && cat !== 'limitado') f.classList.remove('is-active')
        })
        filtro.classList.add('is-active')
      }

      aplicarFiltros()
    })
  })

  // Previne o recarregamento da página ao dar Enter no formulário (ou clicar no ícone)
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault()

      // Vai para a página de ferramentas se não estiver nela
      const ferramentasSection = document.getElementById('ferramentas')
      if (ferramentasSection && !ferramentasSection.classList.contains('is-active')) {
        document.querySelectorAll('.page-section').forEach(section => section.classList.remove('is-active'))
        ferramentasSection.classList.add('is-active')
        ferramentasSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }

      aplicarFiltros()
    })
  }

  // Aciona a filtragem sempre que o usuário digitar no input
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      // Ao digitar na search box, vai para a página de ferramentas se não estiver nela
      const ferramentasSection = document.getElementById('ferramentas')
      if (ferramentasSection && !ferramentasSection.classList.contains('is-active')) {
        document.querySelectorAll('.page-section').forEach(section => section.classList.remove('is-active'))
        ferramentasSection.classList.add('is-active')
        ferramentasSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }

      if (searchInput.value.trim() !== '') {
        // Ao digitar na search box, desmarca filtros normais e volta para "Todas"
        // Deixamos os filtros especiais intocados caso o usuário queira buscar "livre"
        const filtroTodas = Array.from(filtros).find(f => f.getAttribute('data-categoria') === 'todas')
        filtros.forEach(f => {
          const cat = f.getAttribute('data-categoria')
          if (cat !== 'gratuito' && cat !== 'limitado') f.classList.remove('is-active')
        })
        if (filtroTodas) filtroTodas.classList.add('is-active')
      }
      aplicarFiltros()
    })
  }

  function aplicarFiltros() {
    const normais = Array.from(filtros).filter(f => {
      const cat = f.getAttribute('data-categoria')
      return cat !== 'gratuito' && cat !== 'limitado' && f.classList.contains('is-active')
    })
    const especiais = Array.from(filtros).filter(f => {
      const cat = f.getAttribute('data-categoria')
      return (cat === 'gratuito' || cat === 'limitado') && f.classList.contains('is-active')
    })

    const categoriaNormal = normais.length > 0 ? normais[0].getAttribute('data-categoria') : 'todas'
    const categoriaEspecial = especiais.length > 0 ? especiais[0].getAttribute('data-categoria') : null

    // Removemos todos os espaços e transformamos em minúsculo para busca super flexível
    const termoBusca = searchInput ? searchInput.value.toLowerCase().replace(/\s+/g, '') : ''

    cards.forEach(card => {
      const nomeFerramentaSpan = card.querySelector('h3 span')
      const nomeFerramenta = nomeFerramentaSpan ? nomeFerramentaSpan.textContent.toLowerCase().replace(/\s+/g, '') : ''

      const cardClasses = Array.from(card.classList)

      // O card atende ao filtro de categoria normal?
      const matchNormal = categoriaNormal === 'todas' || cardClasses.includes(categoriaNormal)
      
      // O card atende ao filtro de categoria especial?
      const matchEspecial = !categoriaEspecial || cardClasses.includes(categoriaEspecial)

      // O card atende ao filtro de busca? (se vazio, sempre atende)
      const matchBusca = termoBusca === '' || nomeFerramenta.includes(termoBusca)

      if (matchNormal && matchEspecial && matchBusca) {
        card.style.display = ''
      } else {
        card.style.display = 'none'
      }
    })
  }
}
