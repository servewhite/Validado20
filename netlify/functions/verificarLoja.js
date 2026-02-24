/**
 * Netlify Function: Verificar se a loja está aberta
 * Endpoint: /.netlify/functions/verificarLoja
 * Método: GET
 */

exports.handler = async (event) => {
  console.log('📞 [NETLIFY] Função verificarLoja chamada');
  console.log('   Método:', event.httpMethod);

  // Apenas aceitar GET
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método não permitido. Use GET.' }),
    };
  }

  try {
    // Obter horário atual
    const now = new Date();
    const diadasemana = now.getDay(); // 0 = domingo, 1 = segunda, etc
    const hora = now.getHours();
    const minutos = now.getMinutes();
    const minutosDoDia = hora * 60 + minutos;

    console.log(`⏰ Verificando horário: ${hora}:${minutos.toString().padStart(2, '0')} (${diadasemana})`);

    // Configurar horários de funcionamento (ADAPTE CONFORME SUA LOJA)
    const horariosFuncionamento = {
      0: null, // Domingo - FECHADO
      1: { abre: 10 * 60, fecha: 22 * 60 }, // Segunda: 10:00 - 22:00
      2: { abre: 10 * 60, fecha: 22 * 60 }, // Terça
      3: { abre: 10 * 60, fecha: 22 * 60 }, // Quarta
      4: { abre: 10 * 60, fecha: 22 * 60 }, // Quinta
      5: { abre: 10 * 60, fecha: 23 * 60 }, // Sexta: 10:00 - 23:00
      6: { abre: 11 * 60, fecha: 23 * 60 }, // Sábado: 11:00 - 23:00
    };

    const horarioHoje = horariosFuncionamento[diadasemana];

    // Verificar se está aberto
    let estaAberto = false;
    let proximaAbertura = null;
    let proximoFechamento = null;

    if (horarioHoje && minutosDoDia >= horarioHoje.abre && minutosDoDia < horarioHoje.fecha) {
      estaAberto = true;
      proximoFechamento = `${Math.floor(horarioHoje.fecha / 60)}:${(horarioHoje.fecha % 60).toString().padStart(2, '0')}`;
      console.log('✅ Loja ABERTA');
    } else {
      console.log('🔴 Loja FECHADA');
      
      // Calcular próxima abertura
      for (let i = 1; i <= 7; i++) {
        const proxDia = (diadasemana + i) % 7;
        const horarioProxDia = horariosFuncionamento[proxDia];
        
        if (horarioProxDia) {
          const nomeDia = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][proxDia];
          proximaAbertura = `${nomeDia} às ${Math.floor(horarioProxDia.abre / 60)}:${(horarioProxDia.abre % 60).toString().padStart(2, '0')}`;
          break;
        }
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        estaAberto: estaAberto,
        horaAtual: `${hora}:${minutos.toString().padStart(2, '0')}`,
        diaSemana: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][diadasemana],
        horariofuncionamento: horarioHoje ? {
          abre: `${Math.floor(horarioHoje.abre / 60)}:${(horarioHoje.abre % 60).toString().padStart(2, '0')}`,
          fecha: `${Math.floor(horarioHoje.fecha / 60)}:${(horarioHoje.fecha % 60).toString().padStart(2, '0')}`,
        } : null,
        proximoFechamento: proximoFechamento,
        proximaAbertura: proximaAbertura,
        mensagem: estaAberto 
          ? '🟢 Loja aberta. Você pode fazer seu pedido!' 
          : `🔴 Loja fechada. Reabre ${proximaAbertura}`,
      }),
    };
  } catch (error) {
    console.error('❌ ERRO ao verificar loja:', error.message);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Erro ao verificar horário de funcionamento',
        message: error.message,
      }),
    };
  }
};
