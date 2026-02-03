import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context, type } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    
    if (type === "chat_response") {
      systemPrompt = `Você é a assistente virtual da academia HimeFit. Seu nome é Hime.
Você ajuda com:
- Informações sobre modalidades (Musculação, CrossFit, Yoga, Spinning, Funcional, Natação)
- Planos e preços (Mensal R$99, Trimestral R$249, Semestral R$449, Anual R$799)
- Agendamento de aulas experimentais
- Horários de funcionamento (6h às 23h de segunda a sexta, 8h às 18h sábados)
- Dúvidas gerais sobre a academia

Seja sempre simpática, use emojis e mantenha respostas curtas e objetivas.
Se não souber responder algo específico, sugira que o aluno fale com a recepção.`;
    } else if (type === "sentiment_analysis") {
      systemPrompt = `Analise o sentimento da mensagem e responda APENAS com uma palavra: positive, neutral ou negative.`;
    } else if (type === "generate_announcement") {
      systemPrompt = `Você cria anúncios promocionais curtos e atrativos para a rádio interna da academia HimeFit.
Os anúncios devem ser:
- Máximo 2 frases
- Animados e motivacionais
- Focados em benefícios
- Incluir call-to-action quando apropriado

Contexto da academia: Academia moderna com Musculação, CrossFit, Yoga, Spinning, Funcional e Natação.`;
    } else {
      systemPrompt = "Você é um assistente útil.";
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: context ? `${context}\n\nMensagem: ${message}` : message },
        ],
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add funds to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "Desculpe, não consegui processar sua mensagem.";

    return new Response(
      JSON.stringify({ response: content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in whatsapp-ai:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
