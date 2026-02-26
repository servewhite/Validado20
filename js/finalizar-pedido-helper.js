/**
 * Helper para Finalização de Pedido
 * Compatível com integração PayEvo
 * 
 * Este arquivo fornece a função finalizar() que é chamada pelos botões
 * "FINALIZAR PEDIDO" nas páginas de produtos
 */

console.log('✅ Finalizar Pedido Helper carregado');

/**
 * Função principal chamada pelo botão "FINALIZAR PEDIDO"
 * Abre modal SweetAlert para coletar dados do cliente
 */
async function finalizar() {
  console.log('🚀 Função finalizar() chamada');
  
  // Verificar se SweetAlert está disponível
  if (typeof Swal === 'undefined') {
    alert('Erro: SweetAlert não está carregado. Por favor, recarregue a página.');
    console.error('❌ SweetAlert não encontrado');
    return;
  }

  // Verificar se a integração PayEvo está disponível
  if (!window.payevoIntegration && !window.pixIntegration) {
    alert('Erro: Integração de pagamento não está carregada. Por favor, recarregue a página.');
    console.error('❌ PayEvo Integration não encontrada');
    return;
  }

  try {
    // PASSO 1: Escolher tipo de entrega
    const entregaResult = await Swal.fire({
      title: '🚚 Entrega',
      html: `
        <div style="text-align: left; max-width: 450px; margin: 0 auto;">
          <label style="font-weight: bold; margin-bottom: 15px; display: block;">Selecione o tipo de entrega:</label>
          
          <div style="margin-bottom: 15px; padding: 12px; border: 2px solid #ddd; border-radius: 8px; cursor: pointer; background: white;" id="entrega-rapida-box">
            <input type="radio" id="entrega-tipo-rapida" name="entrega-tipo" value="rapida"> 
            <label for="entrega-tipo-rapida" style="cursor: pointer; margin-left: 8px; font-weight: bold;">🏃 ENTREGA RÁPIDA</label>
            <div style="color: #077c22; font-weight: bold; font-size: 16px; margin-top: 5px;">R$ 25,90</div>
            <div style="color: #666; font-size: 12px;">10 a 20 minutos</div>
          </div>
          
          <div style="margin-bottom: 20px; padding: 12px; border: 2px solid #ddd; border-radius: 8px; cursor: pointer; background: white;" id="entrega-normal-box">
            <input type="radio" id="entrega-tipo-normal" name="entrega-tipo" value="normal"> 
            <label for="entrega-tipo-normal" style="cursor: pointer; margin-left: 8px; font-weight: bold;">🚚 ENTREGA PADRÃO</label>
            <div style="color: #077c22; font-weight: bold; font-size: 16px; margin-top: 5px;">R$ 19,90</div>
            <div style="color: #666; font-size: 12px;">1 a 2 horas</div>
          </div>
        </div>
      `,
      confirmButtonText: 'Continuar',
      confirmButtonColor: '#077c22',
      allowOutsideClick: false,
      didOpen: () => {
        const entregaRapida = document.getElementById('entrega-tipo-rapida');
        const entregaNormal = document.getElementById('entrega-tipo-normal');
        const entregaRapidaBox = document.getElementById('entrega-rapida-box');
        const entregaNormalBox = document.getElementById('entrega-normal-box');

        if (entregaRapida && entregaNormal && entregaRapidaBox && entregaNormalBox) {
          entregaRapida.addEventListener('change', () => {
            entregaRapidaBox.style.background = '#e8f5e9';
            entregaRapidaBox.style.borderColor = '#077c22';
            entregaNormalBox.style.background = 'white';
            entregaNormalBox.style.borderColor = '#ddd';
          });
          
          entregaNormal.addEventListener('change', () => {
            entregaNormalBox.style.background = '#e8f5e9';
            entregaNormalBox.style.borderColor = '#077c22';
            entregaRapidaBox.style.background = 'white';
            entregaRapidaBox.style.borderColor = '#ddd';
          });
          
          entregaRapidaBox.addEventListener('click', () => {
            entregaRapida.checked = true;
            entregaRapidaBox.style.background = '#e8f5e9';
            entregaRapidaBox.style.borderColor = '#077c22';
            entregaNormalBox.style.background = 'white';
            entregaNormalBox.style.borderColor = '#ddd';
          });
          
          entregaNormalBox.addEventListener('click', () => {
            entregaNormal.checked = true;
            entregaNormalBox.style.background = '#e8f5e9';
            entregaNormalBox.style.borderColor = '#077c22';
            entregaRapidaBox.style.background = 'white';
            entregaRapidaBox.style.borderColor = '#ddd';
          });
        }
      },
      preConfirm: () => {
        const entregaRapida = document.getElementById('entrega-tipo-rapida');
        const entregaNormal = document.getElementById('entrega-tipo-normal');
        
        if (entregaRapida.checked) {
          return 'rapida';
        } else if (entregaNormal.checked) {
          return 'normal';
        } else {
          Swal.showValidationMessage('Por favor, selecione um tipo de entrega');
          return false;
        }
      }
    });

    // Se não confirmou entrega, cancelar
    if (!entregaResult.isConfirmed) {
      return;
    }

    const tipoEntrega = entregaResult.value;
    console.log('✅ Tipo de entrega selecionado:', tipoEntrega);

    // PASSO 2: Abrir modal para coletar dados do cliente
    const result = await Swal.fire({
      title: 'Dados para Entrega',
      html: `
        <div style="text-align: left; padding: 5px; max-height: 70vh; overflow-y: auto;">
          <div style="margin-bottom: 12px;">
            <label style="display: block; margin-bottom: 3px; font-weight: bold; font-size: 13px;">Nome Completo *</label>
            <input id="swal-nome" class="swal2-input" placeholder="Seu nome completo" style="width: 100%; margin: 0; padding: 10px; font-size: 14px; box-sizing: border-box;">
          </div>
          
          <div style="margin-bottom: 12px;">
            <label style="display: block; margin-bottom: 3px; font-weight: bold; font-size: 13px;">CPF *</label>
            <input id="swal-cpf" class="swal2-input" placeholder="000.000.000-00" maxlength="14" style="width: 100%; margin: 0; padding: 10px; font-size: 14px; box-sizing: border-box;">
          </div>
          
          <div style="margin-bottom: 12px;">
            <label style="display: block; margin-bottom: 3px; font-weight: bold; font-size: 13px;">Telefone/WhatsApp *</label>
            <input id="swal-telefone" class="swal2-input" placeholder="(00) 00000-0000" maxlength="15" style="width: 100%; margin: 0; padding: 10px; font-size: 14px; box-sizing: border-box;">
          </div>
          
          <div style="margin-bottom: 12px;">
            <label style="display: block; margin-bottom: 3px; font-weight: bold; font-size: 13px;">CEP *</label>
            <input id="swal-cep" class="swal2-input" placeholder="00000-000" maxlength="9" style="width: 100%; margin: 0; padding: 10px; font-size: 14px; box-sizing: border-box;">
          </div>
          
          <div style="margin-bottom: 12px;">
            <label style="display: block; margin-bottom: 3px; font-weight: bold; font-size: 13px;">Endereço *</label>
            <input id="swal-endereco" class="swal2-input" placeholder="Rua, Avenida, etc." style="width: 100%; margin: 0; padding: 10px; font-size: 14px; box-sizing: border-box;">
          </div>
          
          <div style="margin-bottom: 12px;">
            <label style="display: block; margin-bottom: 3px; font-weight: bold; font-size: 13px;">Número *</label>
            <input id="swal-numero" class="swal2-input" placeholder="Número" style="width: 100%; margin: 0; padding: 10px; font-size: 14px; box-sizing: border-box;">
          </div>
          
          <div style="margin-bottom: 12px;">
            <label style="display: block; margin-bottom: 3px; font-weight: bold; font-size: 13px;">Complemento</label>
            <input id="swal-complemento" class="swal2-input" placeholder="Apto, Bloco, etc. (opcional)" style="width: 100%; margin: 0; padding: 10px; font-size: 14px; box-sizing: border-box;">
          </div>
          
          <div style="margin-bottom: 12px;">
            <label style="display: block; margin-bottom: 3px; font-weight: bold; font-size: 13px;">E-mail</label>
            <input id="swal-email" class="swal2-input" type="email" placeholder="seu@email.com (opcional)" style="width: 100%; margin: 0; padding: 10px; font-size: 14px; box-sizing: border-box;">
          </div>
          
          <p style="font-size: 11px; color: #666; margin-top: 10px; margin-bottom: 0;">* Campos obrigatórios</p>
        </div>
      `,
      confirmButtonText: 'Gerar PIX',
      confirmButtonColor: '#0066cc',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#999',
      width: window.innerWidth < 768 ? '95%' : '600px',
      padding: window.innerWidth < 768 ? '15px' : '20px',
      allowOutsideClick: false,
      customClass: {
        container: 'swal-mobile-container',
        popup: 'swal-mobile-popup',
        title: 'swal-mobile-title',
        htmlContainer: 'swal-mobile-html',
        confirmButton: 'swal-mobile-confirm',
        cancelButton: 'swal-mobile-cancel'
      },
      didOpen: () => {
        // Aplicar máscaras aos campos
        const cpfInput = document.getElementById('swal-cpf');
        const telefoneInput = document.getElementById('swal-telefone');
        const cepInput = document.getElementById('swal-cep');

        // Máscara CPF: 000.000.000-00
        cpfInput.addEventListener('input', (e) => {
          let value = e.target.value.replace(/\D/g, '');
          if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value;
          }
        });

        // Máscara Telefone: (00) 00000-0000
        telefoneInput.addEventListener('input', (e) => {
          let value = e.target.value.replace(/\D/g, '');
          if (value.length <= 11) {
            value = value.replace(/(\d{2})(\d)/, '($1) $2');
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
            e.target.value = value;
          }
        });

        // Máscara CEP: 00000-000
        cepInput.addEventListener('input', (e) => {
          let value = e.target.value.replace(/\D/g, '');
          if (value.length <= 8) {
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
            e.target.value = value;
          }
        });
      },
      preConfirm: () => {
        const nome = document.getElementById('swal-nome').value.trim();
        const cpf = document.getElementById('swal-cpf').value.trim();
        const telefone = document.getElementById('swal-telefone').value.trim();
        const cep = document.getElementById('swal-cep').value.trim();
        const endereco = document.getElementById('swal-endereco').value.trim();
        const numero = document.getElementById('swal-numero').value.trim();
        const complemento = document.getElementById('swal-complemento').value.trim();
        const email = document.getElementById('swal-email').value.trim();

        // Validações
        if (!nome) {
          Swal.showValidationMessage('Por favor, informe seu nome completo');
          return false;
        }
        if (!cpf || cpf.replace(/\D/g, '').length !== 11) {
          Swal.showValidationMessage('Por favor, informe um CPF válido');
          return false;
        }
        if (!telefone || telefone.replace(/\D/g, '').length < 10) {
          Swal.showValidationMessage('Por favor, informe um telefone válido');
          return false;
        }
        if (!cep || cep.replace(/\D/g, '').length !== 8) {
          Swal.showValidationMessage('Por favor, informe um CEP válido');
          return false;
        }
        if (!endereco) {
          Swal.showValidationMessage('Por favor, informe o endereço');
          return false;
        }
        if (!numero) {
          Swal.showValidationMessage('Por favor, informe o número');
          return false;
        }

        return {
          nome,
          cpf,
          telefone,
          cep,
          endereco,
          numero,
          complemento,
          email
        };
      }
    });

    // Se o usuário confirmou
    if (result.isConfirmed && result.value) {
      console.log('✅ Dados coletados:', result.value);

      // Preparar dados do cliente
      const clientData = {
        name: result.value.nome,
        cpf: result.value.cpf,
        phone: result.value.telefone,
        cep: result.value.cep,
        address: result.value.endereco,
        numero: result.value.numero,
        complemento: result.value.complemento || '',
        email: result.value.email || `${result.value.cpf.replace(/\D/g, '')}@cliente.com`,
        tipoEntrega: tipoEntrega,
        valorEntrega: tipoEntrega === 'rapida' ? 25.90 : 19.90
      };

      // Obter dados do carrinho usando a integração
      const integration = window.payevoIntegration || window.pixIntegration;
      
      // Converter valorEntrega para centavos e passar para getCartData
      const freteEmCentavos = Math.round(clientData.valorEntrega * 100);
      const cartData = integration.getCartData(freteEmCentavos);

      console.log('📦 Dados do carrinho:', cartData);
      console.log(`💰 Valor do frete: R$ ${clientData.valorEntrega.toFixed(2)} (${freteEmCentavos} centavos)`);

      // Chamar a integração PayEvo para gerar o PIX
      if (cartData) {
        await integration.generatePixForOrder(clientData, cartData);
      } else {
        console.error('❌ Não foi possível obter dados do carrinho');
        await Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Não foi possível obter os dados do pedido. Por favor, tente novamente.',
          confirmButtonColor: '#0066cc'
        });
      }
    } else {
      console.log('❌ Usuário cancelou');
    }
  } catch (error) {
    console.error('❌ Erro na função finalizar():', error);
    await Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: 'Ocorreu um erro ao processar seu pedido. Por favor, tente novamente.',
      confirmButtonColor: '#0066cc'
    });
  }
}

// Tornar a função disponível globalmente
window.finalizar = finalizar;

console.log('✅ Função finalizar() disponível globalmente');
