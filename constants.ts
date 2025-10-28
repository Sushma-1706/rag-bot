
import { MedicalContext } from './types';

export const SYSTEM_PROMPT = `You are a Medical Q&A Chatbot built using Retrieval-Augmented Generation (RAG).
Your job is to answer **only** using the information found in the retrieved medical dataset contexts.
Do **not** use outside knowledge. Do **not** guess. If the answer is not supported by the context, say so.

----------------------
🎯 OBJECTIVE
Provide medically accurate, concise, safe answers citing trusted medical sources.
Your responses must be based entirely on the retrieved context snippets provided to you.

----------------------
📚 RAG ANSWERING RULES
1. You must use ONLY the content provided in the retrieved contexts.
2. If the retrieved context does not contain enough information, respond with:
   **"I do not have sufficient medical evidence in the provided sources to answer this reliably."**
3. Do **not** hallucinate, fabricate, infer missing info, or use general medical knowledge outside the text.
4. Every answer must be *grounded* in the included \`contexts\`.

----------------------
📝 RESPONSE FORMAT (REQUIRED JSON)
Your final output must ALWAYS be returned in the following exact JSON format. Do not include markdown like \`\`\`json.

{
  "answer": "<your concise answer here>",
  "contexts": [
     "<relevant supporting text snippet 1>",
     "<relevant supporting text snippet 2>"
  ]
}

- \`answer\` must be **1–4 sentences**, medically correct, and directly answering the query.
- \`contexts\` must include the exact text snippets that support the answer.
- Do NOT include explanations, commentary, or markdown formatting outside this JSON.

----------------------
🔍 CONTEXT SELECTION RULES
- Select only the most relevant context snippets to answer the query.
- If \`top_k\` is given, return **only that many** snippets.
- Remove duplicate or irrelevant sentences.

----------------------
⚠️ ETHICAL & SAFETY REQUIREMENTS
- Never provide diagnosis, prescriptions, or treatment instructions beyond what the context explicitly states.
- If a query requests medication dosage, treatment instructions, or clinical advice **not supported** by the dataset, respond with the fallback answer.
- Avoid absolute certainty; use medically responsible language when context indicates uncertainty.`;

export const MEDICAL_CONTEXTS: MedicalContext[] = [
  {
    id: 'CONTEXT 1',
    topic: 'Tetanus, Diphtheria, and Pertussis (Tdap) Vaccination',
    source: 'CDC Immunization Schedules',
    content: "All adults should receive a Tdap booster shot every 10 years to maintain protection against tetanus, diphtheria, and pertussis (whooping cough). A single dose of Tdap is also recommended during each pregnancy, preferably between 27 and 36 weeks, to protect the newborn from pertussis. For individuals with a severe or dirty wound, a Td booster may be recommended if it has been more than 5 years since their last dose."
  },
  {
    id: 'CONTEXT 2',
    topic: 'Concussion Recognition and Management',
    source: 'American Academy of Neurology',
    content: "A concussion is a mild traumatic brain injury caused by a bump, blow, or jolt to the head. Key symptoms include headache, confusion, dizziness, nausea, and sensitivity to light or noise. Anyone suspected of having a concussion should cease athletic activity immediately and be evaluated by a healthcare professional. Rest, both physical and cognitive, is the primary treatment for concussion to allow the brain to heal."
  },
  {
    id: 'CONTEXT 3',
    topic: 'Influenza (Flu) vs. Common Cold',
    source: 'World Health Organization (WHO)',
    content: "Influenza and the common cold are both respiratory illnesses but are caused by different viruses. Flu symptoms are usually more severe and sudden in onset, including high fever, body aches, extreme tiredness, and a dry cough. Cold symptoms are generally milder and may include a runny or stuffy nose and sore throat. While a cold is typically benign, the flu can lead to serious complications such as pneumonia."
  },
  {
    id: 'CONTEXT 4',
    topic: 'First Aid for Minor Burns',
    source: 'American Red Cross',
    content: "For first-degree or minor second-degree burns, immediately cool the burn with cool (not cold) running water for at least 10 minutes. After cooling, cover the burn with a sterile, non-adhesive bandage or clean cloth. Do not apply ice, butter, or ointments to the burn, as this can trap heat and cause more damage. Over-the-counter pain relievers can be used to manage pain. Seek medical attention for burns that are large, deep, or on the hands, feet, face, or genitals."
  },
  {
    id: 'CONTEXT 5',
    topic: 'Allergic Reactions (Anaphylaxis)',
    source: 'National Institute of Allergy and Infectious Diseases',
    content: "Anaphylaxis is a severe, potentially life-threatening allergic reaction that can occur within seconds or minutes of exposure to an allergen. Symptoms include hives, swelling of the lips, tongue or throat, difficulty breathing, and a rapid, weak pulse. It requires immediate medical treatment, including an injection of epinephrine. If you suspect someone is having an anaphylactic reaction, call emergency services immediately."
  }
];
