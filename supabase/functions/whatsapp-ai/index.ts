import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Validate authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - Missing or invalid authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with the user's auth token
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Validate the JWT and get user claims
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.error("JWT validation failed:", claimsError);
      return new Response(
        JSON.stringify({ error: "Unauthorized - Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub;
    console.log("Authenticated user:", userId);

    // Parse and validate request body
    const body = await req.json();
    const { message, context, type } = body;

    if (!message || typeof message !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid request - message is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sanitize inputs - limit message length
    const sanitizedMessage = message.slice(0, 2000);
    const sanitizedContext = context ? String(context).slice(0, 1000) : "";

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
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
          { role: "user", content: sanitizedContext ? `${sanitizedContext}\n\nMensagem: ${sanitizedMessage}` : sanitizedMessage },
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
      return new Response(
        JSON.stringify({ error: "AI service temporarily unavailable" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
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
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
