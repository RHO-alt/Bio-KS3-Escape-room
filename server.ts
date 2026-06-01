import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize the Express application
const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini API client if API key is present
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Local evaluation fallback and guidelines helper
function localEvaluate(checkpointId: string, lockId: string, answer: string): { isCorrect: boolean; feedback: string } {
  const norm = answer.toLowerCase().trim();

  if (checkpointId === "alpha") {
    if (lockId === "core") {
      // Microscope zoom features: Eyepiece / Objective magnify, Coarse / Fine Focus adjusts clarity
      const hasEyepiece = norm.includes("eyepiece");
      const hasObjective = norm.includes("objective");
      const hasFocus = norm.includes("focus") || norm.includes("knob") || norm.includes("fine") || norm.includes("coarse");
      
      if ((hasEyepiece || hasObjective) && hasFocus) {
        return {
          isCorrect: true,
          feedback: "DECRYPTION SUCCESSFUL: Standard biological lens systems parsed. Objectives identify magnification and Focus Knobs resolve sharp visual boundaries."
        };
      } else {
        return {
          isCorrect: false,
          feedback: "DECRYPTION FAILED: Incomplete microscope calibration terms. State the lenses that multiply scale, and the element adjusting specimen clarity."
        };
      }
    }
  }

  if (checkpointId === "bravo") {
    if (lockId === "mastery") {
      const hasProtein = norm.includes("protein");
      const hasSynthesis = norm.includes("synthesis") || norm.includes("build") || norm.includes("maker") || norm.includes("make") || norm.includes("create");
      const hasRibosome = norm.includes("ribosome");
      const hasenergyOrSurvival = norm.includes("survive") || norm.includes("die") || norm.includes("function") || norm.includes("live") || norm.includes("enzyme");

      if (hasProtein && (hasSynthesis || norm.includes("translation"))) {
        return {
          isCorrect: true,
          feedback: "DECRYPTION SUCCESSFUL: Ribosomal destruction halts translation. Without protein synthesis, cellular enzymes and structure dissolve."
        };
      } else {
        return {
          isCorrect: false,
          feedback: "DECRYPTION FAILED: Cellular scan shows lack of precision. Ribosomes read mRNA to construct what critical biological molecule?"
        };
      }
    }
  }

  if (checkpointId === "charlie") {
    if (lockId === "core") {
      const hasMovement = norm.includes("move") || norm.includes("diff") || norm.includes("travel") || norm.includes("pass") || norm.includes("random");
      const hasConcentration = norm.includes("concentrat") || norm.includes("high") || norm.includes("low");
      const hasFactors = norm.includes("temp") || norm.includes("surface") || norm.includes("area") || norm.includes("gradient") || norm.includes("dilat");

      if (hasConcentration || (hasMovement && hasFactors)) {
        return {
          isCorrect: true,
          feedback: "DECRYPTION SUCCESSFUL: Diffusion kinetics approved. Solute drift from High Concentration to Low Concentration is highly responsive to Temperature and Surface Area parameters."
        };
      } else {
        return {
          isCorrect: false,
          feedback: "DECRYPTION FAILED: Standard physics definitions not satisfied. Remember to cite concentration gradient boundaries (from high to low) and secondary speed stimuli."
        };
      }
    }

    if (lockId === "tactical") {
      const hasTemp = norm.includes("temp") || norm.includes("warm") || norm.includes("hot") || norm.includes("summer");
      const hasEnergy = norm.includes("energy") || norm.includes("kinetic") || norm.includes("speed") || norm.includes("fast") || norm.includes("move");

      if (hasTemp && hasEnergy) {
        return {
          isCorrect: true,
          feedback: "DECRYPTION SUCCESSFUL: Kinetic energy thresholds verified. Ambient heat in summer escalates molecule velocity, driving massive net oxygen flow."
        };
      } else {
        return {
          isCorrect: false,
          feedback: "DECRYPTION FAILED: Thermal dynamics not linked. Relate high seasonal temperatures to the kinetic state of the oxygen molecules."
        };
      }
    }

    if (lockId === "mastery") {
      const hasChloroplast = norm.includes("chloroplast") || norm.includes("chloro") || norm.includes("plast");
      const hasPhotosynthesis = norm.includes("photosynthe") || norm.includes("sunlight") || norm.includes("light") || norm.includes("food") || norm.includes("sugar") || norm.includes("glucose");

      if (hasChloroplast && (hasPhotosynthesis || norm.includes("autotroph"))) {
        return {
          isCorrect: true,
          feedback: "DECRYPTION SUCCESSFUL: Yeast cell wall homology is a false analogy. Yeast has no chloroplasts, meaning it depends on heterotrophic sugars rather than photosynthesis."
        };
      } else {
        return {
          isCorrect: false,
          feedback: "DECRYPTION FAILED: Cell categorization error. Identify the specific green plant exclusive organelle missing in yeast, and the chemical food cycle it halts."
        };
      }
    }
  }

  if (checkpointId === "delta") {
    if (lockId === "core") {
      const hasOxygen = norm.includes("oxygen") || norm.includes("o2") || norm.includes("gas");
      const hasCarry = norm.includes("carry") || norm.includes("transport") || norm.includes("deliver") || norm.includes("move") || norm.includes("hemoglobin");
      const hasSpace = norm.includes("space") || norm.includes("more") || norm.includes("room") || norm.includes("volume") || norm.includes("fit");

      if (hasOxygen && (hasCarry || hasSpace)) {
        return {
          isCorrect: true,
          feedback: "DECRYPTION SUCCESSFUL: Special Forces Roster updated: Operative 01 (Red Blood Cell). Biconcave shape and nuclear absence combine to pack maximum hemoglobin payloads."
        };
      } else {
        return {
          isCorrect: false,
          feedback: "DECRYPTION FAILED: Adaptations not reconciled. Explain what cargo the red cell moves, and what spatial advantage arises from expelling its nucleus."
        };
      }
    }

    if (lockId === "tactical") {
      const hasSurfaceArea = norm.includes("surface") || norm.includes("area") || norm.includes("sa");
      const hasHair = norm.includes("hair") || norm.includes("projection") || norm.includes("extension") || norm.includes("long") || norm.includes("outgrowth");

      if (hasSurfaceArea && (hasHair || norm.includes("absorb") || norm.includes("contact"))) {
        return {
          isCorrect: true,
          feedback: "DECRYPTION SUCCESSFUL: Operative 03 (Root Hair Cell) parameters loaded. Massive geometric surface expansion guarantees rapid soil water flow."
        };
      } else {
        return {
          isCorrect: false,
          feedback: "DECRYPTION FAILED: Geometric optimization not cited. How does the root cell's finger-like protrusion affect contact area and absorption rates?"
        };
      }
    }

    if (lockId === "mastery") {
      const hasMuscle = norm.includes("muscle");
      const hasMito = norm.includes("mitochondria") || norm.includes("energy");
      const hasRespiration = norm.includes("respir") || norm.includes("contract") || norm.includes("atp") || norm.includes("work") || norm.includes("move");

      if (hasMuscle && (hasMito || hasRespiration)) {
        return {
          isCorrect: true,
          feedback: "DECRYPTION SUCCESSFUL: Operative 02 (Muscle Cell) biomechanics confirmed. Constant visual contractions dictate extreme ATP burn rates, requiring mitochondrial overload."
        };
      } else {
        return {
          isCorrect: false,
          feedback: "DECRYPTION FAILED: Cellular energy budget mismatch. Contrast the work output of static skin vs actively contracting fibers to justify power needs."
        };
      }
    }
  }

  // default text verification for everything else
  if (norm.length > 5) {
    return {
      isCorrect: true,
      feedback: "LOCAL SYSTEM BYPASS GRANTED: Bio-intel decrypted under basic automated validation. Cellular compliance accepted."
    };
  }

  return {
    isCorrect: false,
    feedback: "DECRYPTION FAILED: Input too brief. Please supply complete bio-tactical justifications."
  };
}

// API endpoint for evaluating biology response
app.post("/api/evaluate-answer", async (req, res) => {
  try {
    const { checkpointId, lockId, question, userAnswer } = req.body;

    if (!checkpointId || !lockId || !userAnswer) {
      return res.status(400).json({ error: "Missing required parameters: checkpointId, lockId, and userAnswer." });
    }

    // Rely on local evaluation directly to be snappy first
    const fallback = localEvaluate(checkpointId, lockId, userAnswer);

    // If Gemini client is activated, let it review open-ended answers for high-quality grading!
    if (ai) {
      try {
        const p = `
You are the Tactical HUD Command Core of "OPERATION MICRO-HUD: BIOLOGY TACTICAL BOOTCAMP".
Your duty is to evaluate whether an operative's answer correctly satisfies the biology checkpoint instruction.

Checkpoint: ${checkpointId.toUpperCase()}
Lock: ${lockId.toUpperCase()}
Biology Question Context: "${question}"
Operative's Input Answer: "${userAnswer}"

Criteria:
- Evaluate the answer based on fundamental High School and GCSE Biology concepts.
- Give the player passing credit (isCorrect = true) if they understand the core concept, even if there are small typos.
- The tone must be a realistic sci-fi cybernetic militaristic HUD assistant. Style the "feedback" with capital keywords or tactical status terms (e.g. "CRITICAL ENZYMATIC PROCESS NOT FOUND", "SECTOR DECRYPTED").
- Keep the feedback concise: exactly 2 sentences maximum.

Respond STRICTLY with a valid JSON document resembling this structure. No markdown wrappers except perhaps standard raw string, but ideal is raw JSON output.
{
  "isCorrect": boolean,
  "feedback": "Your high-tech tactical HUD assessment feedback string."
}
        `;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: p,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                isCorrect: { type: Type.BOOLEAN, description: "Whether the answer is biologically correct." },
                feedback: { type: Type.STRING, description: "Sci-fi tactical evaluation of the answer." }
              },
              required: ["isCorrect", "feedback"]
            }
          }
        });

        if (response.text) {
          try {
            const result = JSON.parse(response.text.trim());
            return res.json(result);
          } catch (e) {
            console.error("Failed to parse Gemini JSON, falling back to local evaluation", e);
          }
        }
      } catch (geminiError) {
        console.error("Gemini invocation failed, using local evaluator fallback", geminiError);
      }
    }

    // fallback standard behavior
    return res.json(fallback);
  } catch (err: any) {
    console.error("Server API Error:", err);
    res.status(500).json({ error: "Failed to evaluate answer. Tactical system offline." });
  }
});

// Setup Vite development backend or production static file serving
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[MICRO-HUD LOGS] Combat Server listening on port ${PORT}`);
  });
}

setupServer();
