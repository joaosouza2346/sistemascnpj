document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.getElementById('search-btn')
  const cnpjInput = document.getElementById('cnpj-input')
  const errorMessage = document.getElementById('error-message')
  const resultsSection = document.getElementById('results-section')

  // Campos para preencher
  const fields = {
    razaoSocial: document.getElementById('razao-social'),
    nomeFantasia: document.getElementById('nome-fantasia'),
    cnpj: document.getElementById('cnpj'),
    situacao: document.getElementById('situacao'),
    endereco: document.getElementById('endereco'),
    atividadePrincipal: document.getElementById('atividade-principal'),
    capitalSocial: document.getElementById('capital-social'),
  }

  searchBtn.addEventListener('click', async () => {
    const cnpj = cnpjInput.value.replace(/\D/g, '') // remove tudo que não for número
    errorMessage.classList.add('hidden')
    resultsSection.classList.add('hidden')

    if (cnpj.length !== 14) {
      showError('CNPJ inválido. Deve conter 14 números.')
      return
    }

    try {
      const response = await fetch(
        `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`
      )

      if (!response.ok) {
        throw new Error('Erro ao buscar o CNPJ.')
      }

      const data = await response.json()

      // Preencher os dados
      fields.razaoSocial.textContent = data.razao_social || '-'
      fields.nomeFantasia.textContent = data.nome_fantasia || '-'
      fields.cnpj.textContent = formatCNPJ(data.cnpj) || '-'
      fields.situacao.textContent = data.descricao_situacao_cadastral || '-'

      const endereco = `${data.descricao_tipo_de_logradouro || ''} ${
        data.logradouro || ''
      }, ${data.numero || ''}, ${data.bairro || ''} - ${data.municipio || ''}/${
        data.uf || ''
      } - CEP: ${data.cep || ''}`
      fields.endereco.textContent = endereco

      fields.atividadePrincipal.textContent = data.cnae_fiscal_descricao || '-'
      fields.capitalSocial.textContent =
        formatCurrency(data.capital_social) || '-'

      resultsSection.classList.remove('hidden')
    } catch (error) {
      showError('CNPJ não encontrado ou erro na API.')
      console.error(error)
    }
  })

  function showError(message) {
    errorMessage.textContent = message
    errorMessage.classList.remove('hidden')
  }

  function formatCNPJ(cnpj) {
    return cnpj.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      '$1.$2.$3/$4-$5'
    )
  }

  function formatCurrency(value) {
    return Number(value).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }
})
