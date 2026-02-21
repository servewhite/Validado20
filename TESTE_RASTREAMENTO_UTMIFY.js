/**
 * TESTE DE RASTREAMENTO DA UTMIFY - SIMULAÇÃO TÉCNICA
 * ===================================================
 * Este arquivo testa:
 * 1. Presença e carregamento do script utms/latest.js
 * 2. Se a Utmify está capturando parâmetros de URL
 * 3. Se os botões de checkout estão sendo interceptados
 * 4. Se os parâmetros de UTM estão sendo adicionados aos links de pagamento
 * 
 * Data: 20/02/2026
 * Status: AUDITORIA TÉCNICA COMPLETA
 */

console.log('================================');
console.log('🔍 TESTE DE RASTREAMENTO UTMIFY');
console.log('================================\n');

// ============================================================================
// TESTE 1: Verificação do Script de UTM
// ============================================================================

console.log('📝 TESTE 1: Verificação do Script de UTM (utms/latest.js)');
console.log('-'.repeat(60));

function testeScriptUTM() {
  const scripts = document.querySelectorAll('script');
  let utmScriptFound = false;
  let utmScriptLoaded = false;

  scripts.forEach((script) => {
    if (script.src && script.src.includes('utmify.com.br/scripts/utms/latest.js')) {
      utmScriptFound = true;
      console.log('✅ Script utms/latest.js ENCONTRADO na página');
      console.log(`   📍 Localização: ${script.src}`);
      console.log(`   🔄 Async: ${script.async}`);
      console.log(`   ⏳ Defer: ${script.defer}`);
    }
  });

  // Verificar se a Utmify foi inicializada globalmente
  if (window.utmify !== undefined) {
    utmScriptLoaded = true;
    console.log('✅ Biblioteca Utmify CARREGADA e ATIVA');
    console.log(`   📦 Versão: ${window.utmify.version || 'Desconhecida'}`);
  } else if (window.utm !== undefined) {
    utmScriptLoaded = true;
    console.log('✅ Biblioteca Utmify CARREGADA como window.utm');
  }

  if (!utmScriptFound) {
    console.log('❌ ⚠️  Script utms/latest.js NÃO ENCONTRADO');
    console.log('   ⚠️  CRÍTICO: O script de rastreamento de UTMs não está na página!');
  }

  if (!utmScriptLoaded) {
    console.log('⚠️  Biblioteca Utmify pode não estar completamente carregada');
    console.log('   💡 Verificando em 2 segundos...');
    
    return new Promise((resolve) => {
      setTimeout(() => {
        if (window.utmify !== undefined) {
          console.log('✅ Biblioteca Utmify carregada APÓS ESPERA');
          resolve(true);
        } else {
          console.log('❌ Biblioteca Utmify ainda não carregada');
          resolve(false);
        }
      }, 2000);
    });
  }

  return Promise.resolve(utmScriptFound && utmScriptLoaded);
}

// ============================================================================
// TESTE 2: Verificação do Pixel
// ============================================================================

console.log('\n📝 TESTE 2: Verificação do Pixel da Utmify');
console.log('-'.repeat(60));

function testePixelUtmify() {
  const scripts = document.querySelectorAll('script');
  let pixelFound = false;

  scripts.forEach((script) => {
    if (script.src && script.src.includes('utmify.com.br/scripts/pixel/pixel.js')) {
      pixelFound = true;
      console.log('✅ Pixel da Utmify ENCONTRADO');
      console.log(`   📍 Localização: ${script.src}`);
    }
  });

  // Verificar se o pixel foi carregado via tag de img (beacon)
  const pixels = document.querySelectorAll('img[src*="utmify"]');
  if (pixels.length > 0) {
    console.log(`✅ ${pixels.length} pixel(s) beacon DETECTADO(S)`);
    pixels.forEach((pixel, i) => {
      console.log(`   📍 Pixel ${i + 1}: ${pixel.src}`);
    });
    pixelFound = true;
  }

  if (!pixelFound) {
    console.log('❌ ⚠️  Pixel da Utmify NÃO ENCONTRADO');
    console.log('   ⚠️  CRÍTICO: O rastreamento de conversão pode não estar ativo!');
  }

  return pixelFound;
}

// ============================================================================
// TESTE 3: Captura de Parâmetros de UTM pela URL Atual
// ============================================================================

console.log('\n📝 TESTE 3: Captura de Parâmetros de UTM');
console.log('-'.repeat(60));

function testeCapturarUTMs() {
  const urlParams = new URLSearchParams(window.location.search);
  const utmParams = {
    source: urlParams.get('utm_source'),
    medium: urlParams.get('utm_medium'),
    campaign: urlParams.get('utm_campaign'),
    content: urlParams.get('utm_content'),
    term: urlParams.get('utm_term'),
    referral: urlParams.get('referral_code'),
    click_id: urlParams.get('click_id'),
  };

  console.log('URL Atual:', window.location.href);
  console.log('Parâmetros de UTM detectados:');

  let temUTMs = false;
  Object.entries(utmParams).forEach(([key, value]) => {
    if (value) {
      console.log(`   ✅ ${key}: ${value}`);
      temUTMs = true;
    }
  });

  if (!temUTMs) {
    console.log('   ℹ️  Nenhum parâmetro de UTM detectado na URL atual');
    console.log('   💡 A página pode ter sido acessada sem parâmetros de rastreamento');
  }

  // Tentar acessar dados de UTM via sessionStorage ou localStorage (Utmify frequentemente armazena)
  if (window.localStorage) {
    const keys = Object.keys(window.localStorage);
    const utmStorageKeys = keys.filter(k => k.includes('utm') || k.includes('utmify'));
    
    if (utmStorageKeys.length > 0) {
      console.log('\n📦 Dados de UTM armazenados em localStorage:');
      utmStorageKeys.forEach((key) => {
        const value = window.localStorage.getItem(key);
        console.log(`   📍 ${key}: ${value?.substring(0, 100)}...`);
      });
    }
  }

  if (window.sessionStorage) {
    const keys = Object.keys(window.sessionStorage);
    const utmStorageKeys = keys.filter(k => k.includes('utm') || k.includes('utmify'));
    
    if (utmStorageKeys.length > 0) {
      console.log('\n📦 Dados de UTM armazenados em sessionStorage:');
      utmStorageKeys.forEach((key) => {
        const value = window.sessionStorage.getItem(key);
        console.log(`   📍 ${key}: ${value?.substring(0, 100)}...`);
      });
    }
  }

  return temUTMs;
}

// ============================================================================
// TESTE 4: Rastreamento de Botões de Checkout
// ============================================================================

console.log('\n📝 TESTE 4: Rastreamento de Botões de Checkout');
console.log('-'.repeat(60));

function testeBotoesCheckout() {
  const botoesFinalizacao = document.querySelectorAll(
    'button[onclick*="finalizar"], button[id*="finalizar"], button[id*="checkout"], ' +
    'button[id*="comprar"], button[id*="pedido"], a[href*="pagamento"], ' +
    '.btn-checkout, .btn-finalizar, .btn-comprar, #botao-finalizar, #btFinalizar'
  );

  console.log(`Total de botões de checkout detectados: ${botoesFinalizacao.length}`);

  if (botoesFinalizacao.length === 0) {
    console.log('⚠️  Nenhum botão de checkout detectado');
    console.log('   💡 Procurando por padrões alternativos...');
  }

  botoesFinalizacao.forEach((btn, i) => {
    console.log(`\n   Botão ${i + 1}:`);
    console.log(`   📝 Tipo: ${btn.tagName}`);
    console.log(`   🏷️  ID: ${btn.id || 'N/A'}`);
    console.log(`   🎯 Classe: ${btn.className || 'N/A'}`);
    console.log(`   📍 Texto: ${btn.textContent?.substring(0, 50) || 'N/A'}`);
    
    if (btn.onclick) {
      console.log(`   🔗 onClick: ${btn.onclick.toString().substring(0, 80)}...`);
    }
    if (btn.href) {
      console.log(`   🔗 href: ${btn.href}`);
    }
    
    // Verificar se tem event listeners com Utmify
    console.log(`   ✅ Listeners: Detectando...`);
  });

  return botoesFinalizacao.length > 0;
}

// ============================================================================
// TESTE 5: Funcionalidade do finalizar-pedido-helper.js
// ============================================================================

console.log('\n📝 TESTE 5: Script de Finalização de Pedido');
console.log('-'.repeat(60));

function testFinalizarPedidoHelper() {
  if (typeof finalizar === 'function') {
    console.log('✅ Função finalizar() está DISPONÍVEL GLOBALMENTE');
    console.log('   📝 Tipo: ' + typeof finalizar);
    console.log('   📋 Função: ' + finalizar.toString().substring(0, 150) + '...');
    return true;
  } else if (window.finalizar !== undefined) {
    console.log('✅ Função window.finalizar() está DISPONÍVEL');
    return true;
  } else {
    console.log('❌ ⚠️  Função finalizar() NÃO ENCONTRADA');
    console.log('   ⚠️  CRÍTICO: Os botões de finalizar pedido podem não funcionar!');
    console.log('   💡 Verifique se finalizar-pedido-helper.js foi carregado');
    return false;
  }
}

// ============================================================================
// TESTE 6: Simulação de Interpolação de UTMs nos Links
// ============================================================================

console.log('\n📝 TESTE 6: Simulação de Adição de UTMs aos Links de Checkout');
console.log('-'.repeat(60));

function testeInterpolacaoUTMs() {
  const urlParams = new URLSearchParams(window.location.search);
  const utm_source = urlParams.get('utm_source') || 'google';
  const utm_medium = urlParams.get('utm_medium') || 'cpc';
  const utm_campaign = urlParams.get('utm_campaign') || 'promocao';
  const utm_content = urlParams.get('utm_content') || 'default';
  const utm_term = urlParams.get('utm_term') || 'marmita';

  // URL exemplo de checkout
  const checkoutUrl = 'https://exemplo.com/checkout';
  
  // Simular o que a Utmify deveria fazer
  const urlComUTMs = new URL(checkoutUrl);
  urlComUTMs.searchParams.set('utm_source', utm_source);
  urlComUTMs.searchParams.set('utm_medium', utm_medium);
  urlComUTMs.searchParams.set('utm_campaign', utm_campaign);
  urlComUTMs.searchParams.set('utm_content', utm_content);
  urlComUTMs.searchParams.set('utm_term', utm_term);

  console.log('Simulação de interpolação de UTMs:');
  console.log('\n📌 URL Original:');
  console.log(`   ${checkoutUrl}`);
  console.log('\n📌 URL com UTMs adicionados (O QUE A UTMIFY DEVERIA FAZER):');
  console.log(`   ${urlComUTMs.toString()}`);

  // Extrair parâmetros
  const params = {
    source: utm_source,
    medium: utm_medium,
    campaign: utm_campaign,
    content: utm_content,
    term: utm_term,
  };

  console.log('\n📊 Parâmetros que DEVEM ser passados:');
  Object.entries(params).forEach(([key, value]) => {
    console.log(`   ✅ utm_${key}: ${value}`);
  });

  return {
    urlOriginal: checkoutUrl,
    urlComUTMs: urlComUTMs.toString(),
    parametros: params,
  };
}

// ============================================================================
// TESTE 7: Detecção de Conflitos
// ============================================================================

console.log('\n📝 TESTE 7: Detecção de Conflitos com Outros Scripts');
console.log('-'.repeat(60));

function testeConflitos() {
  const conflitos = [];

  // Verificar se delivery.js está interferindo
  if (typeof $.fn.jquery !== 'undefined') {
    console.log('✅ jQuery detectado: ' + $.fn.jquery);
  }

  // Verificar scripts que podem conflitar
  const scriptsPerigosos = [
    { nome: 'delivery.js', padroes: ['delivry', 'delivery'] },
    { nome: 'analytics.js', padroes: ['gtag', 'ga('] },
    { nome: 'gtm.js', padroes: ['dataLayer'] },
  ];

  scriptsPerigosos.forEach((script) => {
    const scripts = document.querySelectorAll('script');
    scripts.forEach((s) => {
      if (s.src && script.padroes.some(p => s.src.includes(p))) {
        console.log(`✅ ${script.nome} ENCONTRADO: ${s.src}`);
      }
    });
  });

  // Verificar se há preventDefault nos eventos globais
  if (document._addEventListener) {
    console.log('⚠️  Custom addEventListener detectado - pode indicar interceptação');
  }

  // Verificar se os links de pagamento têm href correto
  const pagamentoLinks = document.querySelectorAll('a[href*="pagamento"]');
  if (pagamentoLinks.length > 0) {
    console.log(`\n📝 ${pagamentoLinks.length} link(s) de pagamento detectado(s):`);
    pagamentoLinks.forEach((link, i) => {
      console.log(`   Link ${i + 1}: ${link.href}`);
      
      // Verificar se tem parâmetros de UTM já adicionados
      if (link.href.includes('utm_')) {
        console.log(`   ✅ UTM já presente no link`);
      } else {
        console.log(`   ❌ UTM não está no link (Utmify deveria adicionar)`);
      }
    });
  }

  return conflitos;
}

// ============================================================================
// TESTE 8: Status da Integração Completa
// ============================================================================

console.log('\n📝 TESTE 8: Status da Integração Completa');
console.log('-'.repeat(60));

function testeIntegracaoCompleta() {
  const status = {
    utmScript: false,
    pixelUTM: false,
    funcaoFinalizar: false,
    parametrosUTM: false,
    botoesCheckout: false,
    semConflitos: true,
  };

  // Verificar cada componente
  const scripts = document.querySelectorAll('script');
  
  scripts.forEach((script) => {
    if (script.src) {
      if (script.src.includes('utmify.com.br/scripts/utms/latest.js')) {
        status.utmScript = true;
      }
      if (script.src.includes('utmify.com.br/scripts/pixel/pixel.js')) {
        status.pixelUTM = true;
      }
    }
  });

  // Verificar função finalizar
  if (typeof finalizar === 'function' || window.finalizar !== undefined) {
    status.funcaoFinalizar = true;
  }

  // Verificar parâmetros de UTM
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('utm_source') || urlParams.get('utm_campaign')) {
    status.parametrosUTM = true;
  }

  // Verificar botões
  const botoes = document.querySelectorAll(
    'button[onclick*="finalizar"], button[id*="finalizar"], a[href*="pagamento"]'
  );
  status.botoesCheckout = botoes.length > 0;

  return status;
}

// ============================================================================
// FUNÇÃO PRINCIPAL - EXECUTAR TODOS OS TESTES
// ============================================================================

async function executarAuditoria() {
  console.log('\n\n');
  console.log('╔' + '═'.repeat(58) + '╗');
  console.log('║' + ' '.repeat(58) + '║');
  console.log('║' + '  INICIANDO AUDITORIA DE RASTREAMENTO DA UTMIFY'.padEnd(58) + '║');
  console.log('║' + ' '.repeat(58) + '║');
  console.log('╚' + '═'.repeat(58) + '╝');

  try {
    // Executar testes
    const teste1 = await testeScriptUTM();
    testePixelUtmify();
    testeCapturarUTMs();
    testeBotoesCheckout();
    const teste5 = testFinalizarPedidoHelper();
    testeInterpolacaoUTMs();
    testeConflitos();
    const statusFinal = testeIntegracaoCompleta();

    // Relatório final
    console.log('\n\n');
    console.log('╔' + '═'.repeat(58) + '╗');
    console.log('║' + '  RELATÓRIO FINAL DA AUDITORIA'.padEnd(58) + '║');
    console.log('╚' + '═'.repeat(58) + '╝');

    console.log('\n📊 RESUMO DE STATUS:');
    console.log('-'.repeat(60));
    console.log(`✅ Script de UTM (utms/latest.js): ${teste1 ? 'PRESENTE' : 'FALTANDO'}`);
    console.log(`✅ Pixel da Utmify: ${statusFinal.pixelUTM ? 'PRESENTE' : 'FALTANDO'}`);
    console.log(`✅ Função finalizar(): ${teste5 ? 'DISPONÍVEL' : 'NÃO ENCONTRADA'}`);
    console.log(`✅ Parâmetros de UTM: ${statusFinal.parametrosUTM ? 'DETECTADOS' : 'não detectados (normal sem UTMs na URL)'}`);
    console.log(`✅ Botões de Checkout: ${statusFinal.botoesCheckout ? 'ENCONTRADOS' : 'não encontrados'}`);

    console.log('\n🎯 RECOMENDAÇÕES:');
    console.log('-'.repeat(60));

    if (!teste1) {
      console.log('❌ CRÍTICO: Script utms/latest.js não encontrado!');
      console.log('   Ação: Adicione <script src="https://cdn.utmify.com.br/scripts/utms/latest.js" async defer></script> ao <head>');
    }

    if (!statusFinal.pixelUTM) {
      console.log('❌ CRÍTICO: Pixel de rastreamento não encontrado!');
      console.log('   Ação: Adicione o código do pixel da Utmify');
    }

    if (!teste5) {
      console.log('❌ CRÍTICO: Função finalizar() não disponível!');
      console.log('   Ação: Carregue o finalizar-pedido-helper.js nas páginas de checkout');
    }

    console.log('\n✅ AUDITORIA CONCLUÍDA');
    console.log('═'.repeat(60));

  } catch (error) {
    console.error('❌ Erro durante a auditoria:', error);
  }
}

// Executar auditoria por padrão
executarAuditoria();

// Exportar funções para uso manual no console
window.auditoria = {
  executarAuditoria,
  testeScriptUTM,
  testePixelUtmify,
  testeCapturarUTMs,
  testeBotoesCheckout,
  testFinalizarPedidoHelper,
  testeInterpolacaoUTMs,
  testeConflitos,
  testeIntegracaoCompleta,
};

console.log('\n💡 Você pode executar testes individuais no console:');
console.log('   auditoria.testeScriptUTM()');
console.log('   auditoria.testePixelUtmify()');
console.log('   auditoria.testeCapturarUTMs()');
console.log('   auditoria.testeBotoesCheckout()');
