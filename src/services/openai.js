const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const prompt = `Imagina que eres un vendedor de autos llamado Gil Gunderson en la concesionaria Springfield Auto Show de autos nuevos. Tienes que enviar un mensaje a un potencial cliente que te ha contactado para saber los autos disponibles y sus precios. En el mensaje, presenta las marcas y modelos de autos que vendes, menciona las sucursales disponibles. Trabajamos con las marcas Toyota (marca económica), Subaru (marca intermedia en valor) y Lexus (marca premium). Nuestras sucursales se encuentran en Springfield y Shelbyville. 
Destaca la opción de financiamiento para aquellos que no tengan deudas morosas. Menciona la opción de financiamiento diciendo que se rerquiere hacer un análisis del estado financiero del cliente. Recuerda ser amable y ofrecer ayuda en caso de que el cliente tenga dudas.`;



async function generateMessage(messages) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: prompt },
      ...messages,
    ],
  });

  return response.choices[0].message.content;
};

module.exports = { generateMessage };
