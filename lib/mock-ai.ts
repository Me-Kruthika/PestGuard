import { pests, type Pest, type DetectionResult, type Treatment } from "./pest-data";

// Simulates AI detection response for demo purposes
// In production, this would call OpenAI GPT-4o Vision API

interface MockDetectionConfig {
  simulateDelay?: boolean;
  delayMs?: number;
}

export async function mockDetectPest(
  _imageData: string | File,
  config: MockDetectionConfig = { simulateDelay: true, delayMs: 2000 }
): Promise<DetectionResult> {
  // Simulate API delay
  if (config.simulateDelay) {
    await new Promise(resolve => setTimeout(resolve, config.delayMs || 2000));
  }
  
  // Randomly select a pest for demo
  const randomPest = pests[Math.floor(Math.random() * pests.length)];
  const confidence = 0.75 + Math.random() * 0.20; // 75-95% confidence
  
  const detection: DetectionResult = {
    id: `detection-${Date.now()}`,
    pestId: randomPest.id,
    pestName: randomPest.name,
    confidence,
    severity: randomPest.severity,
    timestamp: new Date(),
    imageUrl: typeof _imageData === "string" ? _imageData : URL.createObjectURL(_imageData),
    treatments: [
      ...randomPest.organicTreatments.slice(0, 2),
      ...randomPest.chemicalTreatments.slice(0, 1)
    ]
  };
  
  return detection;
}

// Generate detailed analysis text (simulates GPT response)
export function generateAnalysisText(pest: Pest, confidence: number): string {
  const confidenceText = confidence > 0.9 
    ? "with high confidence" 
    : confidence > 0.8 
      ? "with good confidence" 
      : "with moderate confidence";
  
  return `Analysis Complete: I have identified **${pest.name}** (${pest.scientificName}) ${confidenceText} (${(confidence * 100).toFixed(1)}%).

**Severity Level:** ${pest.severity.toUpperCase()}

**About this pest:**
${pest.description}

**Visible symptoms to look for:**
${pest.symptoms.map(s => `- ${s}`).join("\n")}

**Recommended immediate actions:**
1. ${pest.organicTreatments[0]?.name || "Isolate affected plants"} - ${pest.organicTreatments[0]?.description || "Prevent spread to healthy plants"}
2. ${pest.preventionTips[0]}
3. Monitor surrounding plants for similar symptoms

**Treatment priority:** ${pest.severity === "critical" ? "Urgent - Act within 24-48 hours" : pest.severity === "high" ? "High - Begin treatment this week" : "Moderate - Plan treatment within 1-2 weeks"}`;
}

// Simulate weather-based pest risk prediction
export function predictPestRisks(
  temperature: number,
  humidity: number,
  conditions: string
): { pest: Pest; riskScore: number; reason: string }[] {
  const risks: { pest: Pest; riskScore: number; reason: string }[] = [];
  
  pests.forEach(pest => {
    let riskScore = 0;
    const reasons: string[] = [];
    
    // Temperature factor
    const { min: tempMin, max: tempMax } = pest.optimalConditions.temperature;
    if (temperature >= tempMin && temperature <= tempMax) {
      riskScore += 40;
      reasons.push(`Temperature (${temperature}°C) is optimal`);
    } else if (temperature >= tempMin - 5 && temperature <= tempMax + 5) {
      riskScore += 20;
      reasons.push(`Temperature (${temperature}°C) is near optimal`);
    }
    
    // Humidity factor
    const { min: humMin, max: humMax } = pest.optimalConditions.humidity;
    if (humidity >= humMin && humidity <= humMax) {
      riskScore += 30;
      reasons.push(`Humidity (${humidity}%) is favorable`);
    } else if (humidity >= humMin - 10 && humidity <= humMax + 10) {
      riskScore += 15;
      reasons.push(`Humidity (${humidity}%) is near favorable`);
    }
    
    // Weather conditions factor
    if (conditions.toLowerCase().includes("rain") && pest.category === "fungus") {
      riskScore += 20;
      reasons.push("Rainy conditions favor fungal growth");
    }
    if (conditions.toLowerCase().includes("dry") && pest.id === "spider-mites") {
      riskScore += 25;
      reasons.push("Dry conditions favor spider mite reproduction");
    }
    if (conditions.toLowerCase().includes("warm") || conditions.toLowerCase().includes("hot")) {
      if (pest.category === "insect") {
        riskScore += 15;
        reasons.push("Warm weather increases insect activity");
      }
    }
    
    // Season factor (approximate based on temperature)
    let season: "spring" | "summer" | "fall" | "winter";
    if (temperature > 25) season = "summer";
    else if (temperature > 15) season = temperature > 20 ? "summer" : "spring";
    else if (temperature > 5) season = "fall";
    else season = "winter";
    
    const seasonRisk = pest.seasonalRisk[season];
    riskScore += seasonRisk * 0.1;
    
    if (riskScore > 30) {
      risks.push({
        pest,
        riskScore: Math.min(100, Math.round(riskScore)),
        reason: reasons.join("; ")
      });
    }
  });
  
  return risks.sort((a, b) => b.riskScore - a.riskScore).slice(0, 5);
}

// Treatment recommendation engine
export function getRecommendedTreatments(
  pest: Pest,
  preferOrganic: boolean = true
): { primary: Treatment; alternatives: Treatment[] } {
  const allTreatments = preferOrganic
    ? [...pest.organicTreatments, ...pest.chemicalTreatments]
    : [...pest.chemicalTreatments, ...pest.organicTreatments];
  
  // Sort by effectiveness and safety
  const sorted = allTreatments.sort((a, b) => {
    const aScore = a.effectiveness + (a.safetyRating === "safe" ? 10 : a.safetyRating === "moderate" ? 5 : 0);
    const bScore = b.effectiveness + (b.safetyRating === "safe" ? 10 : b.safetyRating === "moderate" ? 5 : 0);
    return bScore - aScore;
  });
  
  return {
    primary: sorted[0],
    alternatives: sorted.slice(1, 4)
  };
}
