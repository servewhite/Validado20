/**
 * Integração PayEvo com Netlify Functions
 * Este arquivo gerencia o fluxo de pagamento PIX via PayEvo
 * 
 * VERSÃO: 1.0 - Integração PayEvo
 *
 * Fluxo:
 * 1. Após o usuário confirmar os dados de entrega no pop-up SweetAlert
 * 2. A página chama generatePixForOrder(clientData, cartData)
 * 3. Chama Netlify Function em /.netlify/functions/create-payevo-transaction
 * 4. Exibe modal com QR Code e chave PIX
 */

console.log('%c🔄 PayEvo Integration v1.0 carregado', 'background: #0066cc; color: white; font-weight: bold; padding: 5px;');

(function() {
  'use strict';

class PayevoPayment {
  constructor() {
    // Detectar se está em produção (Netlify) ou desenvolvimento local
    const isProduction = window.location.hostname !== 'localhost' && 
                        window.location.hostname !== '127.0.0.1';
    
    if (isProduction) {
      this.payevoFunctionUrl = '/.netlify/functions/create-payevo-transaction';
    } else {
      // Em desenvolvimento, chamar a Netlify Function através da URL local
      this.payevoFunctionUrl = 'http://localhost:9000/.netlify/functions/create-payevo-transaction';
    }
    
    this.init();
  }

  /**
   * Inicializa a integração
   */
  init() {
    console.log('✅ PayEvo Integration iniciada');
    console.log('🔗 URL da Function:', this.payevoFunctionUrl);
    console.log('💡 Use window.payevoIntegration.generatePixForOrder(clientData, cartData)');
  }

  /**
   * Gera o PIX para o pedido a partir dos dados do cliente e do carrinho
   * @param {Object} clientData - { name, email?, phone?, cep, address, cpf, bairro?, cidade?, estado?, numero?, complemento? }
   * @param {Object} cartData - { amount, items }
   * @returns {Promise<void>}
   */
  async generatePixForOrder(clientData, cartData) {
    console.log("✅ 1. [PAYEVO] Função 'generatePixForOrder' iniciada.");
    console.log("📦 clientData recebido:", clientData);
    console.log("🛒 cartData recebido:", cartData);

    if (!clientData || !cartData) {
      console.warn('❌ Dados incompletos para gerar PIX.');
      await Swal.fire({
        icon: 'warning',
        title: 'Dados incompletos',
        text: 'Por favor, confirme os dados do pedido e do carrinho.',
        confirmButtonColor: '#0066cc',
      });
      return;
    }
    
    console.log("✅ 1.5. [PAYEVO] Dados validados, chamando processPix()...");

    try {
      await this.processPix(clientData, cartData);
    } catch (error) {
      console.error("❌ ERRO CRÍTICO no fluxo do PIX:", error);
      if (typeof Swal !== 'undefined') {
        await Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Não foi possível gerar o PIX. Por favor, tente novamente.',
          confirmButtonColor: '#0066cc',
        });
      }
    }
  }

  /**
   * Obtém dados do carrinho
   * @param {number} shippingCents - Valor do frete em centavos (ex: 1990 para R$ 19,90, 2590 para R$ 25,90)
   */
  getCartData(shippingCents = null) {
    try {
      // Se o valor do frete foi fornecido, usar apenas esse valor
      if (shippingCents !== null && shippingCents > 0) {
        console.log(`✅ Usando valor de frete fornecido: R$ ${(shippingCents / 100).toFixed(2)}`);
        const freteValue = Math.round(shippingCents);
        return {
          amount: freteValue,
          items: [{
            title: 'Frete de Entrega',
            quantity: 1,
            unitPrice: freteValue,
            externalRef: 'frete-001',
          }],
        };
      }

      // Buscar valor total do pedido
      let priceElement = document.querySelector('#precoProduto');
      
      if (!priceElement) {
        priceElement = document.querySelector('.info1 .preco');
      }
      
      if (!priceElement) {
        console.warn('Elemento de preço não encontrado e nenhum valor de frete foi fornecido. Usando valor padrão de R$ 19,90');
        return {
          amount: 1990, // R$ 19,90 em centavos (frete padrão)
          items: [{
            title: 'Frete de Entrega',
            quantity: 1,
            unitPrice: 1990,
            externalRef: 'frete-001',
          }],
        };
      }

      const priceText = priceElement.textContent;
      const amount = parseInt(priceText.replace(/\D/g, '')) || 0;

      if (amount === 0) {
        console.warn('Valor do pedido é 0. Usando valor padrão de R$ 19,90 (frete)');
        return {
          amount: 1990,
          items: [{
            title: 'Frete de Entrega',
            quantity: 1,
            unitPrice: 1990,
            externalRef: 'frete-001',
          }],
        };
      }

      // Extrair itens do carrinho
      const items = this.extractCartItems();

      return {
        amount,
        items,
      };
    } catch (error) {
      console.error('Erro ao obter dados do carrinho:', error);
      return {
        amount: 1990,
        items: [{
          title: 'Frete de Entrega',
          quantity: 1,
          unitPrice: 1990,
          externalRef: 'frete-001',
        }],
      };
    }
  }

  /**
   * Extrai itens do carrinho
   */
  extractCartItems() {
    const items = [];
    const cartElements = document.querySelectorAll('[data-cart-item], .cart-item, .item-pedido');

    if (cartElements.length === 0) {
      items.push({
        title: 'Pedido do cliente',
        quantity: 1,
        unitPrice: 1000,
        externalRef: 'item-001',
      });
      return items;
    }

    cartElements.forEach((element, index) => {
      const nameEl = element.querySelector('[data-item-name], .product-name, .nome');
      const priceEl = element.querySelector('[data-item-price], .product-price, .preco');
      const qtyEl = element.querySelector('[data-item-qty], .quantity, .qty');

      const title = nameEl?.textContent || 'Produto';
      const unitPrice = parseInt(priceEl?.textContent?.replace(/\D/g, '') || '0');
      const quantity = parseInt(qtyEl?.textContent || '1');

      items.push({
        title: title.trim(),
        quantity,
        unitPrice,
        externalRef: `item-${index + 1}`,
      });
    });

    return items;
  }

  /**
   * Processa o pagamento PIX
   */
  async processPix(clientData, cartData) {
    console.log("✅ 2. [PAYEVO] Função processPix() iniciada");
    console.log("   clientData:", clientData);
    console.log("   cartData:", cartData);
    
    try {
      console.log("✅ 2.5. [PAYEVO] Fechando modal anterior e mostrando 'Processando...'");
      
      // Fechar o modal anterior
      await Swal.close();
      
      // Aguardar um pouco para garantir que o modal anterior foi fechado
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log("✅ 2.6. [PAYEVO] Abrindo modal 'Processando...'");
      
      // Mostra "Processando..."
      Swal.fire({
        title: 'Processando...',
        html: 'Gerando QR Code PIX via PayEvo...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
          console.log("✅ 2.7. [PAYEVO] Modal 'Processando...' exibido com sucesso");
        }
      });
      
      // Aguardar um pouco para garantir que o modal foi exibido
      await new Promise(resolve => setTimeout(resolve, 200));

      console.log("✅ 3. [PAYEVO] Preparando payload");

      // Recuperar parâmetros UTM do sessionStorage
      const utmString = sessionStorage.getItem('utm_parameters');
      const trackingParameters = utmString ? JSON.parse(utmString) : {};
      console.log("📊 [PAYEVO] Parâmetros de rastreamento recuperados:", trackingParameters);

      const payload = {
        amount: cartData.amount,
        items: cartData.items,
        customer: {
          name: clientData.name,
          email: clientData.email || `${clientData.cpf.replace(/\D/g, '')}@cliente.com`,
          phone: clientData.phone || '11999999999',
          cpf: clientData.cpf,
          cep: clientData.cep,
          address: clientData.address,
          bairro: clientData.bairro || '',
          cidade: clientData.cidade || '',
          estado: clientData.estado || '',
          numero: clientData.numero || 'S/N',
          complemento: clientData.complemento || '',
        },
        description: 'Pedido via delivery',
        trackingParameters: trackingParameters, // Adicionar parâmetros UTM
      };
      
      const bodyString = JSON.stringify(payload);
      console.log("✅ 4. [PAYEVO] JSON.stringify executado. Corpo da requisição:", bodyString);

      console.log("✅ 5. [PAYEVO] PRESTES A EXECUTAR O FETCH para:", this.payevoFunctionUrl);

      // Timeout de 30s
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.error("⏱️ TIMEOUT: A requisição demorou mais de 30 segundos");
        controller.abort();
      }, 30000);

      let response;
      try {
        response = await fetch(this.payevoFunctionUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: bodyString,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        console.log("✅ 6. [PAYEVO] FETCH EXECUTADO. Status:", response.status, response.statusText);
      } catch (fetchError) {
        clearTimeout(timeoutId);
        console.error("❌ Erro no FETCH:", fetchError);
        throw fetchError;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Resposta de erro da API:", errorText);
        throw new Error(`Erro ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log("✅ 7. [PAYEVO] Resposta JSON processada:", data);

      await Swal.close();
      if (data.data) {
        await this.displayPixModal(data.data, cartData.amount);
      } else {
        throw new Error('Resposta da API sem dados do PIX');
      }
    } catch (error) {
      console.error("❌ ERRO CRÍTICO no fluxo do PIX:", error);
      console.error("Stack:", error.stack);
      
      await Swal.close();
      
      let mensagemErro = 'Erro ao processar pagamento. Tente novamente.';
      let detalhes = '';
      
      if (error.name === 'AbortError') {
        mensagemErro = 'A requisição demorou muito tempo (mais de 30 segundos).';
        detalhes = 'Possíveis causas:\n• Função Netlify não está respondendo\n• Variáveis de ambiente não configuradas\n• Problema na API PayEvo';
      } else if (error.message.includes('Failed to fetch')) {
        mensagemErro = 'Não foi possível conectar ao servidor.';
        detalhes = 'Verifique:\n• Sua conexão com a internet\n• Se a função Netlify está publicada\n• Se o site está no ar';
      } else if (error.message.includes('500')) {
        mensagemErro = 'Erro no servidor ao processar o pagamento.';
        detalhes = 'Verifique:\n• Variáveis de ambiente no Netlify\n• Credenciais da API PayEvo\n• Logs da função Netlify';
      } else {
        mensagemErro = error.message || 'Erro desconhecido ao processar pagamento.';
      }
      
      await Swal.fire({
        icon: 'error',
        title: 'Erro ao Gerar PIX',
        html: `<p style="margin-bottom: 15px;">${mensagemErro}</p>${detalhes ? `<pre style="text-align: left; font-size: 12px; background: #f5f5f5; padding: 10px; border-radius: 5px;">${detalhes}</pre>` : ''}`,
        confirmButtonColor: '#0066cc',
        footer: '<small>Verifique o console do navegador (F12) para mais detalhes</small>'
      });
    }
  }

  /**
   * Exibe modal SweetAlert com QR Code
   */
  async displayPixModal(pixData, amount) {
    const { qrcode, expirationDate } = pixData;

    if (!qrcode) {
      throw new Error('QR Code não recebido da API');
    }

    // Formatar o valor (amount está em centavos)
    const valorFormatado = amount ? `R$ ${(amount / 100).toFixed(2).replace('.', ',')}` : 'Valor não disponível';

    // Gerar URL da imagem QR Code
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrcode)}`;

    // Calcular tempo de expiração (30 minutos = 1800 segundos)
    const tempoExpiracaoSegundos = 30 * 60;
    let tempoRestante = tempoExpiracaoSegundos;
    let timerInterval = null;

    // Loop para manter modal aberto
    let keepOpen = true;
    
    while (keepOpen) {
      const result = await Swal.fire({
        title: '💳 Escanear PIX',
        html: `
          <div style="text-align: center; padding: 10px;">
            <p style="color: #666; margin-bottom: 15px; font-size: 14px;">Escaneie o QR Code abaixo com seu celular:</p>
            
            <img src="${qrImageUrl}" alt="QR Code PIX" style="width: 280px; height: 280px; border: 3px solid #0066cc; border-radius: 10px; margin: 15px 0; background: white; padding: 5px;">
            
            <div style="background: #e8f5e9; padding: 12px; border-radius: 8px; margin: 15px 0; border: 2px solid #077c22;">
              <p style="color: #077c22; font-weight: bold; font-size: 18px; margin: 0;">Valor: ${valorFormatado}</p>
            </div>
            
            <p style="color: #666; margin: 20px 0 10px 0; font-size: 14px;">Ou copie a chave PIX:</p>
            
            <div style="
              background: #f9f9f9;
              padding: 15px;
              border-radius: 8px;
              margin: 10px 0;
              border: 1px solid #ddd;
              word-break: break-all;
              font-family: 'Courier New', monospace;
              font-size: 12px;
              color: #333;
              max-height: 100px;
              overflow-y: auto;
              text-align: center;
            ">
              <strong>${qrcode}</strong>
            </div>
            
            <p style="color: #999; font-size: 11px; margin-top: 15px;">
              ⏰ Expira em: <strong id="timer-display" style="color: #ff0000; font-size: 14px;">30:00</strong>
            </p>
            
            <div id="copia-feedback" style="display: none; margin-top: 15px; padding: 10px; background-color: #d4edda; color: #155724; border-radius: 5px; border: 1px solid #c3e6cb; font-weight: bold;">
              ✓ Chave PIX copiada para a área de transferência!
            </div>
          </div>
        `,
        confirmButtonText: '📋 Copiar Chave PIX',
        confirmButtonColor: '#0066cc',
        showCancelButton: true,
        cancelButtonText: 'Fechar',
        cancelButtonColor: '#999',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          // Iniciar o cronômetro
          timerInterval = setInterval(() => {
            tempoRestante--;
            
            const minutos = Math.floor(tempoRestante / 60);
            const segundos = tempoRestante % 60;
            const tempoFormatado = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
            
            const timerDisplay = document.getElementById('timer-display');
            if (timerDisplay) {
              timerDisplay.textContent = tempoFormatado;
              
              // Mudar cor para vermelho quando faltam menos de 5 minutos
              if (tempoRestante <= 300) {
                timerDisplay.style.color = '#ff0000';
              }
              
              // Se expirou
              if (tempoRestante <= 0) {
                clearInterval(timerInterval);
                timerDisplay.textContent = '00:00';
                timerDisplay.style.color = '#ff0000';
              }
            }
          }, 1000);

          // Substituir o comportamento padrão do botão de confirmar
          const confirmBtn = document.querySelector('.swal2-confirm');
          if (confirmBtn) {
            const newBtn = confirmBtn.cloneNode(true);
            confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);
            
            document.querySelector('.swal2-confirm').addEventListener('click', async (e) => {
              e.stopPropagation();
              e.preventDefault();
              
              // Copiar chave
              await this.copyToClipboard(qrcode);
              
              // Mostrar feedback
              const feedback = document.getElementById('copia-feedback');
              if (feedback) {
                feedback.style.display = 'block';
                setTimeout(() => {
                  feedback.style.display = 'none';
                }, 3000);
              }
              
              console.log('✅ Chave PIX copiada!');
              return false;
            }, true);
          }
        },
        preConfirm: () => {
          return false;
        }
      });

      // Parar o cronômetro se o modal fechar
      if (timerInterval) {
        clearInterval(timerInterval);
      }

      // Se clicou em "Fechar", sair do loop
      if (result.dismiss === Swal.DismissReason.cancelButton) {
        keepOpen = false;
      }
    }
  }

  /**
   * Copia a chave PIX para a área de transferência
   */
  async copyToClipboard(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback para navegadores antigos
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-999999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  }
}

/**
 * Inicializar quando o DOM estiver pronto
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPayevo);
} else {
  initPayevo();
}

function initPayevo() {
  window.payevoIntegration = new PayevoPayment();
  
  // Manter compatibilidade com código antigo que usa pixIntegration
  window.pixIntegration = window.payevoIntegration;
  
  console.log('✅ PayEvo Integration disponível em window.payevoIntegration');
  console.log('✅ Alias disponível em window.pixIntegration (compatibilidade)');
}

})(); // Fim do IIFE
