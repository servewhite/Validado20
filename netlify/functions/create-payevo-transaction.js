/**
 * Netlify Function: Gerar PIX via PayEvo
 * Endpoint: /.netlify/functions/create-payevo-transaction
 * Método: POST
 */

const https = require('https');

/**
 * Realiza uma requisição HTTPS
 */
function makeHttpsRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: responseData,
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

/**
 * Função principal do Netlify
 */
exports.handler = async (event) => {
  console.log('📞 [NETLIFY] Função create-payevo-transaction chamada');
  console.log('   Método:', event.httpMethod);
  console.log('   Path:', event.path);

  // Apenas aceitar POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método não permitido. Use POST.' }),
    };
  }

  try {
    // Parse do body
    let payload;
    try {
      payload = JSON.parse(event.body);
      console.log('✅ Payload recebido e parseado');
    } catch (parseError) {
      console.error('❌ Erro ao fazer parse do JSON:', parseError.message);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'JSON inválido no body' }),
      };
    }

    // Validar dados obrigatórios
    if (!payload.amount || !payload.customer || !payload.customer.name || !payload.customer.cpf) {
      console.error('❌ Dados obrigatórios faltando');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Dados obrigatórios faltando: amount, customer.name, customer.cpf' }),
      };
    }

    console.log('📦 Dados validados:');
    console.log('   Valor:', payload.amount);
    console.log('   Cliente:', payload.customer.name);
    console.log('   CPF:', payload.customer.cpf);

    // Verificar se as credenciais PayEvo estão configuradas
    const payevoApiKey = process.env.PAYEVO_API_KEY;
    const payevoMerchantId = process.env.PAYEVO_MERCHANT_ID;

    if (!payevoApiKey || !payevoMerchantId) {
      console.error('⚠️ Variáveis de ambiente não configuradas');
      console.error('   PAYEVO_API_KEY:', payevoApiKey ? 'OK' : 'FALTANDO');
      console.error('   PAYEVO_MERCHANT_ID:', payevoMerchantId ? 'OK' : 'FALTANDO');

      // Modo DEMO: Retornar QR code simulado para testes
      const demoQrCode = {
        id: `order-${Date.now()}`,
        qrCode: '00020126580014br.gov.bcb.pix0136xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx5204000053039865406339.905802BR5913Delivery App6009SAO PAULO62070503***63041D6D',
        pixKey: 'demo@delivery.com.br',
        amount: payload.amount,
        customer: payload.customer,
        createdAt: new Date().toISOString(),
      };

      console.log('🎭 MODO DEMO ativado - Usando QR code simulado');
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: true,
          message: '⚠️ MODO DEMO - Use credenciais reais em produção',
          data: demoQrCode,
        }),
      };
    }

    console.log('✅ Credenciais PayEvo encontradas, preparando requisição para API...');

    // Preparar dados para PayEvo
    const payevoPayload = {
      merchant: payevoMerchantId,
      amount: payload.amount,
      customer: {
        name: payload.customer.name,
        email: payload.customer.email || `${payload.customer.cpf.replace(/\D/g, '')}@cliente.com`,
        phone: payload.customer.phone || '',
        cpf: payload.customer.cpf.replace(/\D/g, ''),
        address: payload.customer.address || '',
        city: payload.customer.cidade || '',
        state: payload.customer.estado || '',
        zipCode: payload.customer.cep || '',
      },
      description: payload.description || 'Pedido via delivery',
      items: payload.items || [],
      metadata: {
        trackingParameters: payload.trackingParameters || {},
        sessionId: event.headers['user-agent'],
      },
    };

    console.log('📤 [PayEvo] Enviando requisição...');

    // Chamar API PayEvo
    const payevoOptions = {
      hostname: 'api.payevo.com.br', // URL da API PayEvo (adapte conforme necessário)
      path: '/pix/generate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${payevoApiKey}`,
        'X-Merchant-ID': payevoMerchantId,
      },
    };

    const payevoResponse = await makeHttpsRequest(payevoOptions, payevoPayload);

    if (payevoResponse.statusCode !== 200 && payevoResponse.statusCode !== 201) {
      console.error('❌ Erro da API PayEvo:', payevoResponse.statusCode);
      console.error('   Resposta:', payevoResponse.body);
      return {
        statusCode: 502,
        body: JSON.stringify({
          error: 'Erro ao gerar PIX na API PayEvo',
          details: payevoResponse.body,
        }),
      };
    }

    const payevoData = JSON.parse(payevoResponse.body);
    console.log('✅ [PayEvo] PIX gerado com sucesso');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        data: {
          id: payevoData.id,
          qrCode: payevoData.qrCode,
          pixKey: payevoData.pixKey,
          amount: payload.amount,
          customer: payload.customer,
          transactionId: payevoData.transactionId,
          expiresAt: payevoData.expiresAt,
          createdAt: new Date().toISOString(),
        },
      }),
    };
  } catch (error) {
    console.error('❌ ERRO CRÍTICO:', error.message);
    console.error('   Stack:', error.stack);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Erro interno do servidor',
        message: error.message,
      }),
    };
  }
};
