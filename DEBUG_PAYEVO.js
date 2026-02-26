/**
 * Script de Debug - Testar Integração PayEvo
 * 
 * Use este script abrir o console do navegador (F12) e colar o código
 * para testar se a integração está funcionando
 */

// ============================================
// 1️⃣ TESTAR CREDENCIAIS NO NETLIFY
// ============================================

async function testarCredenciaisPayEvo() {
  console.log('🔍 Testando credenciais PayEvo no Netlify...\n');
  
  try {
    // Fazer uma requisição para a function para ver os logs
    const response = await fetch('/.netlify/functions/create-payevo-transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: 1990, // R$ 19,90 para teste
        customer: {
          name: 'Teste Cliente',
          cpf: '00000000191', // CPF válido para testes
          phone: '11999999999',
          cep: '01310100',
          address: 'Rua Teste',
          numero: '123',
          email: 'teste@email.com'
        },
        items: [{
          title: 'Frete de Teste',
          quantity: 1,
          unitPrice: 1990
        }]
      })
    });

    const data = await response.json();
    
    console.log('📤 Status da Resposta:', response.status);
    console.log('📋 Resposta Completa:', JSON.stringify(data, null, 2));
    
    if (response.status === 200) {
      console.log('✅ PIX gerado com sucesso!');
      if (data.data && data.data.qrCode) {
        console.log('🎯 QR Code:', data.data.qrCode);
        console.log('🔑 Chave PIX:', data.data.pixKey);
      }
    } else {
      console.error('❌ Erro ao gerar PIX');
      if (data.details) {
        console.error('📝 Detalhes do erro:', data.details);
      }
    }
  } catch (error) {
    console.error('❌ Erro na requisição:', error);
  }
}

// Executar
testarCredenciaisPayEvo();


// ============================================
// 2️⃣ VERIFICAR SE A INTEGRAÇÃO ESTÁ CARREGADA
// ============================================

function verificarIntegracaoCarregada() {
  console.log('\n🔍 Verificando se a integração PayEvo está carregada...\n');
  
  if (window.payevoIntegration) {
    console.log('✅ window.payevoIntegration - CARREGADA');
    console.log('   Métodos disponíveis:', Object.getOwnPropertyNames(window.payevoIntegration.__proto__));
  } else if (window.pixIntegration) {
    console.log('✅ window.pixIntegration - CARREGADA');
    console.log('   Métodos disponíveis:', Object.getOwnPropertyNames(window.pixIntegration.__proto__));
  } else {
    console.error('❌ Nenhuma integração de pagamento carregada');
  }
  
  if (typeof finalizar === 'function') {
    console.log('✅ Função finalizar() - DISPONÍVEL');
  } else {
    console.error('❌ Função finalizar() - NÃO DISPONÍVEL');
  }
  
  if (typeof Swal !== 'undefined') {
    console.log('✅ SweetAlert (Swal) - CARREGADO');
  } else {
    console.error('❌ SweetAlert (Swal) - NÃO CARREGADO');
  }
}

// Executar
verificarIntegracaoCarregada();


// ============================================
// 3️⃣ TESTAR FLUXO DE PAGAMENTO COMPLETO
// ============================================

async function testarFluxoPagamento() {
  console.log('\n🚀 Testando fluxo de pagamento completo...\n');
  
  if (typeof finalizar !== 'function') {
    console.error('❌ Função finalizar() não está disponível');
    return;
  }
  
  console.log('💡 Chamando finalizar() - 💬 Um modal deve aparecer na tela');
  console.log('📝 Preencha com dados de teste e clique em "Gerar PIX"');
  
  try {
    await finalizar();
  } catch (error) {
    console.error('❌ Erro ao chamar finalizar():', error);
  }
}

// Para executar: descomente a linha abaixo
// testarFluxoPagamento();


// ============================================
// 4️⃣ VERIFICAR VARIÁVEIS DE SESSÃO
// ============================================

function verificarVariaveisSessao() {
  console.log('\n🔍 Verificando variáveis de sessão...\n');
  
  const utm = sessionStorage.getItem('utm_parameters');
  if (utm) {
    console.log('✅ Parâmetros UTM armazenados:', JSON.parse(utm));
  } else {
    console.log('ℹ️ Nenhum parâmetro UTM armazenado');
  }
}

// Executar
verificarVariaveisSessao();


// ============================================
// 5️⃣ CONSOLE DE AJUDA
// ============================================

console.log(`
╔════════════════════════════════════════════════════════╗
║         🧪 MENU DE TESTES - PayEvo Integration         ║
╚════════════════════════════════════════════════════════╝

Comandos disponíveis:

1️⃣ testarCredenciaisPayEvo()
   → Testa se as credenciais PayEvo estão configuradas no Netlify
   → Mostra se o QR Code foi gerado com sucesso
   
2️⃣ verificarIntegracaoCarregada()
   → Verifica se a integração está carregada na página
   → Mostra quais funções estão disponíveis
   
3️⃣ testarFluxoPagamento()
   → Abre o formulário completo de pagamento
   → Simula um pedido real
   
4️⃣ verificarVariaveisSessao()
   → Mostra variáveis de rastreamento (UTM)

🔗 Para copiar e colar qualquer comando, basta digitá-lo e pressionar Enter!

💡 Dica: Confira os logs depois de executar cada teste!
`);

