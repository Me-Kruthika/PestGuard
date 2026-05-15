export interface Pest {
  id: string;
  name: string;
  scientificName: string;
  category: "insect" | "fungus" | "bacteria" | "virus" | "mite" | "nematode";
  severity: "low" | "medium" | "high" | "critical";
  affectedCrops: string[];
  description: string;
  symptoms: string[];
  lifecycle: string;
  preventionTips: string[];
  organicTreatments: Treatment[];
  chemicalTreatments: Treatment[];
  imageUrl: string;
  seasonalRisk: {
    spring: number;
    summer: number;
    fall: number;
    winter: number;
  };
  optimalConditions: {
    temperature: { min: number; max: number };
    humidity: { min: number; max: number };
  };
}

export interface Treatment {
  name: string;
  description: string;
  effectiveness: number;
  applicationMethod: string;
  safetyRating: "safe" | "moderate" | "caution";
  costEstimate: string;
}

export interface DetectionResult {
  id: string;
  pestId: string;
  pestName: string;
  confidence: number;
  severity: Pest["severity"];
  timestamp: Date;
  imageUrl: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  treatments: Treatment[];
}

export interface CommunityReport {
  id: string;
  pestId: string;
  pestName: string;
  userId: string;
  userName: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  imageUrl: string;
  description: string;
  severity: Pest["severity"];
  timestamp: Date;
  upvotes: number;
  verified: boolean;
}

export const pests: Pest[] = [
  {
    id: "aphid",
    name: "Aphids",
    scientificName: "Aphidoidea",
    category: "insect",
    severity: "medium",
    affectedCrops: ["Tomatoes", "Peppers", "Lettuce", "Roses", "Beans", "Cabbage"],
    description: "Small, soft-bodied insects that cluster on new growth and undersides of leaves. They reproduce rapidly and can transmit plant viruses.",
    symptoms: [
      "Curled, yellowing leaves",
      "Sticky honeydew residue on leaves",
      "Black sooty mold growth",
      "Stunted plant growth",
      "Distorted flowers and fruit"
    ],
    lifecycle: "Aphids can complete their lifecycle in as little as one week. Females can produce 50-100 offspring without mating. Multiple generations occur per season.",
    preventionTips: [
      "Introduce beneficial insects like ladybugs",
      "Use reflective mulches to deter aphids",
      "Avoid over-fertilizing with nitrogen",
      "Remove weeds that harbor aphids",
      "Inspect new plants before introducing to garden"
    ],
    organicTreatments: [
      {
        name: "Neem Oil Spray",
        description: "Natural insecticide that disrupts aphid feeding and reproduction",
        effectiveness: 85,
        applicationMethod: "Spray on affected areas every 7-14 days",
        safetyRating: "safe",
        costEstimate: "$8-15"
      },
      {
        name: "Insecticidal Soap",
        description: "Kills aphids on contact by disrupting cell membranes",
        effectiveness: 80,
        applicationMethod: "Spray directly on aphids, repeat every 3-5 days",
        safetyRating: "safe",
        costEstimate: "$6-12"
      },
      {
        name: "Ladybug Release",
        description: "Natural predators that consume large numbers of aphids",
        effectiveness: 75,
        applicationMethod: "Release 1,500 ladybugs per 1,000 sq ft",
        safetyRating: "safe",
        costEstimate: "$15-25"
      }
    ],
    chemicalTreatments: [
      {
        name: "Imidacloprid",
        description: "Systemic insecticide absorbed by plants",
        effectiveness: 95,
        applicationMethod: "Apply as soil drench or foliar spray",
        safetyRating: "caution",
        costEstimate: "$15-30"
      }
    ],
    imageUrl: "/pests/aphid.jpg",
    seasonalRisk: { spring: 80, summer: 90, fall: 60, winter: 20 },
    optimalConditions: { temperature: { min: 15, max: 25 }, humidity: { min: 50, max: 80 } }
  },
  {
    id: "tomato-hornworm",
    name: "Tomato Hornworm",
    scientificName: "Manduca quinquemaculata",
    category: "insect",
    severity: "high",
    affectedCrops: ["Tomatoes", "Peppers", "Eggplant", "Potatoes"],
    description: "Large green caterpillars with white V-shaped markings. Can defoliate plants quickly and damage fruit.",
    symptoms: [
      "Large holes in leaves",
      "Stripped stems",
      "Dark green droppings on leaves",
      "Missing fruit",
      "Defoliated upper plant sections"
    ],
    lifecycle: "Moths lay eggs on plant undersides. Larvae feed for 3-4 weeks before burrowing into soil to pupate. Two generations per year in most regions.",
    preventionTips: [
      "Till soil in fall to destroy pupae",
      "Rotate crops annually",
      "Interplant with basil or marigolds",
      "Use black plastic mulch",
      "Monitor plants regularly during summer"
    ],
    organicTreatments: [
      {
        name: "Bacillus thuringiensis (Bt)",
        description: "Natural bacteria that kills caterpillars when ingested",
        effectiveness: 90,
        applicationMethod: "Spray on foliage every 5-7 days",
        safetyRating: "safe",
        costEstimate: "$10-20"
      },
      {
        name: "Hand Picking",
        description: "Manual removal of caterpillars from plants",
        effectiveness: 95,
        applicationMethod: "Check plants daily, remove and destroy",
        safetyRating: "safe",
        costEstimate: "Free"
      },
      {
        name: "Parasitic Wasps",
        description: "Braconid wasps lay eggs in hornworms",
        effectiveness: 70,
        applicationMethod: "Attract by planting dill, fennel, and parsley",
        safetyRating: "safe",
        costEstimate: "$15-25"
      }
    ],
    chemicalTreatments: [
      {
        name: "Carbaryl (Sevin)",
        description: "Broad-spectrum insecticide effective against caterpillars",
        effectiveness: 95,
        applicationMethod: "Dust or spray on plants",
        safetyRating: "caution",
        costEstimate: "$12-25"
      }
    ],
    imageUrl: "/pests/hornworm.jpg",
    seasonalRisk: { spring: 30, summer: 95, fall: 50, winter: 0 },
    optimalConditions: { temperature: { min: 20, max: 30 }, humidity: { min: 40, max: 70 } }
  },
  {
    id: "powdery-mildew",
    name: "Powdery Mildew",
    scientificName: "Erysiphales",
    category: "fungus",
    severity: "medium",
    affectedCrops: ["Squash", "Cucumbers", "Melons", "Grapes", "Roses", "Peas"],
    description: "Fungal disease appearing as white powdery spots on leaves and stems. Thrives in warm, dry conditions with cool nights.",
    symptoms: [
      "White powdery coating on leaves",
      "Yellow or brown leaf discoloration",
      "Distorted new growth",
      "Premature leaf drop",
      "Reduced fruit quality"
    ],
    lifecycle: "Spores spread by wind, germinate on leaf surfaces in 3-7 days. Can complete multiple cycles per season. Overwinters in plant debris.",
    preventionTips: [
      "Ensure adequate plant spacing for airflow",
      "Water at soil level, avoid wetting foliage",
      "Plant resistant varieties",
      "Remove infected plant debris",
      "Apply preventive fungicides"
    ],
    organicTreatments: [
      {
        name: "Baking Soda Spray",
        description: "Creates alkaline surface hostile to fungus",
        effectiveness: 70,
        applicationMethod: "Mix 1 tbsp per gallon water, spray weekly",
        safetyRating: "safe",
        costEstimate: "$2-5"
      },
      {
        name: "Milk Spray",
        description: "Proteins create antiseptic effect when exposed to sunlight",
        effectiveness: 75,
        applicationMethod: "Mix 40% milk with 60% water, spray biweekly",
        safetyRating: "safe",
        costEstimate: "$3-8"
      },
      {
        name: "Sulfur Dust",
        description: "Prevents spore germination on plant surfaces",
        effectiveness: 85,
        applicationMethod: "Dust on dry foliage, avoid temps over 85°F",
        safetyRating: "moderate",
        costEstimate: "$8-15"
      }
    ],
    chemicalTreatments: [
      {
        name: "Myclobutanil",
        description: "Systemic fungicide for treatment and prevention",
        effectiveness: 95,
        applicationMethod: "Apply every 14 days as needed",
        safetyRating: "moderate",
        costEstimate: "$15-30"
      }
    ],
    imageUrl: "/pests/powdery-mildew.jpg",
    seasonalRisk: { spring: 60, summer: 85, fall: 70, winter: 10 },
    optimalConditions: { temperature: { min: 15, max: 27 }, humidity: { min: 40, max: 70 } }
  },
  {
    id: "japanese-beetle",
    name: "Japanese Beetle",
    scientificName: "Popillia japonica",
    category: "insect",
    severity: "high",
    affectedCrops: ["Roses", "Grapes", "Beans", "Raspberries", "Corn", "Fruit Trees"],
    description: "Metallic green and copper-colored beetles that skeletonize leaves. Larvae (grubs) damage grass roots.",
    symptoms: [
      "Skeletonized leaves (veins remain)",
      "Brown patches in lawn (grub damage)",
      "Damaged flowers and fruit",
      "Clusters of beetles on plants",
      "Wilting plants despite adequate water"
    ],
    lifecycle: "One generation per year. Adults emerge in early summer, feed and lay eggs in soil. Grubs feed on roots through fall, overwinter deep in soil.",
    preventionTips: [
      "Apply milky spore disease to lawn",
      "Use row covers during beetle season",
      "Plant less-preferred species",
      "Maintain healthy turf to resist grubs",
      "Avoid beetle traps near gardens"
    ],
    organicTreatments: [
      {
        name: "Milky Spore",
        description: "Bacterial disease that kills grubs in soil",
        effectiveness: 80,
        applicationMethod: "Apply to lawn in fall, takes 2-3 years for full effect",
        safetyRating: "safe",
        costEstimate: "$25-50"
      },
      {
        name: "Neem Oil",
        description: "Deters feeding and disrupts lifecycle",
        effectiveness: 70,
        applicationMethod: "Spray every 7 days during beetle season",
        safetyRating: "safe",
        costEstimate: "$10-20"
      },
      {
        name: "Hand Picking",
        description: "Remove beetles into soapy water",
        effectiveness: 85,
        applicationMethod: "Check plants morning and evening daily",
        safetyRating: "safe",
        costEstimate: "Free"
      }
    ],
    chemicalTreatments: [
      {
        name: "Carbaryl",
        description: "Contact insecticide effective against adults",
        effectiveness: 90,
        applicationMethod: "Apply when beetles first appear",
        safetyRating: "caution",
        costEstimate: "$12-25"
      }
    ],
    imageUrl: "/pests/japanese-beetle.jpg",
    seasonalRisk: { spring: 20, summer: 95, fall: 30, winter: 0 },
    optimalConditions: { temperature: { min: 21, max: 35 }, humidity: { min: 40, max: 80 } }
  },
  {
    id: "spider-mites",
    name: "Spider Mites",
    scientificName: "Tetranychidae",
    category: "mite",
    severity: "high",
    affectedCrops: ["Tomatoes", "Beans", "Strawberries", "Melons", "Houseplants", "Fruit Trees"],
    description: "Tiny eight-legged pests that suck plant juices. Often appear during hot, dry conditions. Create fine webbing on plants.",
    symptoms: [
      "Stippled, yellowing leaves",
      "Fine webbing on undersides of leaves",
      "Bronzed or dusty appearance",
      "Leaf drop",
      "Tiny moving dots visible with magnification"
    ],
    lifecycle: "Complete lifecycle in 5-20 days depending on temperature. Females lay up to 200 eggs. Multiple generations per season.",
    preventionTips: [
      "Maintain adequate humidity",
      "Avoid dusty conditions",
      "Regularly spray plants with water",
      "Avoid water stress",
      "Introduce predatory mites preventively"
    ],
    organicTreatments: [
      {
        name: "Predatory Mites",
        description: "Phytoseiulus persimilis consumes spider mites",
        effectiveness: 90,
        applicationMethod: "Release early when populations are low",
        safetyRating: "safe",
        costEstimate: "$25-40"
      },
      {
        name: "Insecticidal Soap",
        description: "Suffocates mites on contact",
        effectiveness: 75,
        applicationMethod: "Spray undersides of leaves every 3-5 days",
        safetyRating: "safe",
        costEstimate: "$8-15"
      },
      {
        name: "Water Spray",
        description: "Dislodges mites and disrupts webbing",
        effectiveness: 60,
        applicationMethod: "Strong spray on undersides of leaves daily",
        safetyRating: "safe",
        costEstimate: "Free"
      }
    ],
    chemicalTreatments: [
      {
        name: "Abamectin",
        description: "Miticide derived from soil bacteria",
        effectiveness: 95,
        applicationMethod: "Apply when mites first appear",
        safetyRating: "moderate",
        costEstimate: "$20-35"
      }
    ],
    imageUrl: "/pests/spider-mites.jpg",
    seasonalRisk: { spring: 50, summer: 95, fall: 60, winter: 30 },
    optimalConditions: { temperature: { min: 25, max: 35 }, humidity: { min: 20, max: 50 } }
  },
  {
    id: "colorado-potato-beetle",
    name: "Colorado Potato Beetle",
    scientificName: "Leptinotarsa decemlineata",
    category: "insect",
    severity: "critical",
    affectedCrops: ["Potatoes", "Tomatoes", "Eggplant", "Peppers"],
    description: "Yellow-orange beetles with black stripes. Both adults and larvae are voracious feeders that can completely defoliate plants.",
    symptoms: [
      "Defoliated plants",
      "Orange egg clusters on leaf undersides",
      "Red-orange larvae with black spots",
      "Reduced tuber production",
      "Plant death in severe cases"
    ],
    lifecycle: "Adults emerge in spring, lay 300-800 eggs. Larvae feed for 2-3 weeks, pupate in soil. 1-3 generations per year.",
    preventionTips: [
      "Rotate crops every year",
      "Use straw mulch to impede beetle movement",
      "Plant early to avoid peak populations",
      "Grow resistant varieties",
      "Destroy plant debris after harvest"
    ],
    organicTreatments: [
      {
        name: "Spinosad",
        description: "Natural insecticide from soil bacteria",
        effectiveness: 90,
        applicationMethod: "Spray when larvae are small",
        safetyRating: "safe",
        costEstimate: "$15-25"
      },
      {
        name: "Bacillus thuringiensis (Bt)",
        description: "Effective against larvae only",
        effectiveness: 85,
        applicationMethod: "Apply to small larvae every 5-7 days",
        safetyRating: "safe",
        costEstimate: "$10-20"
      },
      {
        name: "Hand Picking",
        description: "Manual removal of all life stages",
        effectiveness: 80,
        applicationMethod: "Daily inspection and removal",
        safetyRating: "safe",
        costEstimate: "Free"
      }
    ],
    chemicalTreatments: [
      {
        name: "Pyrethrin",
        description: "Contact insecticide from chrysanthemums",
        effectiveness: 85,
        applicationMethod: "Spray on contact, repeat as needed",
        safetyRating: "moderate",
        costEstimate: "$15-25"
      }
    ],
    imageUrl: "/pests/colorado-beetle.jpg",
    seasonalRisk: { spring: 70, summer: 90, fall: 40, winter: 0 },
    optimalConditions: { temperature: { min: 18, max: 28 }, humidity: { min: 40, max: 70 } }
  },
  {
    id: "whitefly",
    name: "Whiteflies",
    scientificName: "Aleyrodidae",
    category: "insect",
    severity: "medium",
    affectedCrops: ["Tomatoes", "Peppers", "Cucumbers", "Poinsettias", "Citrus", "Hibiscus"],
    description: "Small white flying insects that congregate on leaf undersides. Excrete honeydew and can transmit plant viruses.",
    symptoms: [
      "White flies when plants are disturbed",
      "Sticky honeydew on leaves",
      "Black sooty mold growth",
      "Yellowing leaves",
      "Stunted growth"
    ],
    lifecycle: "Eggs hatch in 5-10 days. Nymphs go through 4 stages over 2-4 weeks. Adults live 1-2 months. Multiple generations per year.",
    preventionTips: [
      "Use yellow sticky traps",
      "Inspect new plants carefully",
      "Maintain good air circulation",
      "Remove heavily infested leaves",
      "Avoid excessive nitrogen fertilization"
    ],
    organicTreatments: [
      {
        name: "Yellow Sticky Traps",
        description: "Monitors and reduces adult populations",
        effectiveness: 60,
        applicationMethod: "Place at plant height, replace when full",
        safetyRating: "safe",
        costEstimate: "$5-15"
      },
      {
        name: "Insecticidal Soap",
        description: "Kills nymphs and adults on contact",
        effectiveness: 80,
        applicationMethod: "Spray undersides of leaves every 3-5 days",
        safetyRating: "safe",
        costEstimate: "$8-15"
      },
      {
        name: "Encarsia Wasps",
        description: "Parasitic wasps that attack whitefly nymphs",
        effectiveness: 85,
        applicationMethod: "Release in greenhouse or garden",
        safetyRating: "safe",
        costEstimate: "$20-35"
      }
    ],
    chemicalTreatments: [
      {
        name: "Imidacloprid",
        description: "Systemic insecticide absorbed by plants",
        effectiveness: 95,
        applicationMethod: "Apply as soil drench",
        safetyRating: "caution",
        costEstimate: "$15-30"
      }
    ],
    imageUrl: "/pests/whitefly.jpg",
    seasonalRisk: { spring: 60, summer: 90, fall: 70, winter: 40 },
    optimalConditions: { temperature: { min: 20, max: 30 }, humidity: { min: 50, max: 80 } }
  },
  {
    id: "late-blight",
    name: "Late Blight",
    scientificName: "Phytophthora infestans",
    category: "fungus",
    severity: "critical",
    affectedCrops: ["Tomatoes", "Potatoes"],
    description: "Devastating fungal disease that caused the Irish Potato Famine. Spreads rapidly in cool, wet conditions and can destroy entire crops.",
    symptoms: [
      "Water-soaked lesions on leaves",
      "White fuzzy growth on leaf undersides",
      "Brown to black stem lesions",
      "Rapid plant collapse",
      "Rotting tubers with granular texture"
    ],
    lifecycle: "Spores spread by wind and rain. Can infect and produce new spores in 3-5 days. Survives in infected plant material and volunteer plants.",
    preventionTips: [
      "Use certified disease-free seed",
      "Destroy volunteer plants",
      "Improve air circulation",
      "Apply preventive fungicides",
      "Remove and destroy infected plants immediately"
    ],
    organicTreatments: [
      {
        name: "Copper Fungicide",
        description: "Prevents spore germination",
        effectiveness: 75,
        applicationMethod: "Apply before disease appears, every 7-10 days",
        safetyRating: "moderate",
        costEstimate: "$12-25"
      },
      {
        name: "Removal and Destruction",
        description: "Immediate removal of infected plants",
        effectiveness: 90,
        applicationMethod: "Bag and dispose of infected material (do not compost)",
        safetyRating: "safe",
        costEstimate: "Free"
      }
    ],
    chemicalTreatments: [
      {
        name: "Chlorothalonil",
        description: "Broad-spectrum protectant fungicide",
        effectiveness: 85,
        applicationMethod: "Apply every 7-10 days in wet conditions",
        safetyRating: "caution",
        costEstimate: "$15-30"
      },
      {
        name: "Mancozeb",
        description: "Contact fungicide for prevention",
        effectiveness: 80,
        applicationMethod: "Apply before symptoms appear",
        safetyRating: "moderate",
        costEstimate: "$12-25"
      }
    ],
    imageUrl: "/pests/late-blight.jpg",
    seasonalRisk: { spring: 40, summer: 70, fall: 80, winter: 10 },
    optimalConditions: { temperature: { min: 10, max: 20 }, humidity: { min: 80, max: 100 } }
  },
  {
    id: "cabbage-looper",
    name: "Cabbage Looper",
    scientificName: "Trichoplusia ni",
    category: "insect",
    severity: "medium",
    affectedCrops: ["Cabbage", "Broccoli", "Cauliflower", "Kale", "Lettuce", "Tomatoes"],
    description: "Green caterpillar that moves in a looping motion. Common pest of brassicas and many garden vegetables.",
    symptoms: [
      "Irregular holes in leaves",
      "Feeding damage between leaf veins",
      "Green frass (droppings) on leaves",
      "Damaged heads of cabbage/broccoli",
      "Caterpillars visible on undersides of leaves"
    ],
    lifecycle: "Moths lay dome-shaped eggs on leaves. Larvae feed for 2-4 weeks. Pupate in silken cocoons on plants. 3-5 generations per year.",
    preventionTips: [
      "Use floating row covers",
      "Encourage parasitic wasps",
      "Interplant with strong-smelling herbs",
      "Remove plant debris after harvest",
      "Scout regularly for eggs and larvae"
    ],
    organicTreatments: [
      {
        name: "Bacillus thuringiensis (Bt)",
        description: "Most effective organic control for caterpillars",
        effectiveness: 95,
        applicationMethod: "Spray when larvae are small, every 5-7 days",
        safetyRating: "safe",
        costEstimate: "$10-20"
      },
      {
        name: "Row Covers",
        description: "Physical barrier prevents moth egg-laying",
        effectiveness: 99,
        applicationMethod: "Install at planting, secure edges",
        safetyRating: "safe",
        costEstimate: "$20-40"
      },
      {
        name: "Hand Picking",
        description: "Manual removal of caterpillars",
        effectiveness: 80,
        applicationMethod: "Check undersides of leaves daily",
        safetyRating: "safe",
        costEstimate: "Free"
      }
    ],
    chemicalTreatments: [
      {
        name: "Spinosad",
        description: "Natural insecticide effective against caterpillars",
        effectiveness: 95,
        applicationMethod: "Apply when larvae are present",
        safetyRating: "safe",
        costEstimate: "$15-25"
      }
    ],
    imageUrl: "/pests/cabbage-looper.jpg",
    seasonalRisk: { spring: 60, summer: 90, fall: 70, winter: 10 },
    optimalConditions: { temperature: { min: 15, max: 30 }, humidity: { min: 40, max: 80 } }
  },
  {
    id: "thrips",
    name: "Thrips",
    scientificName: "Thysanoptera",
    category: "insect",
    severity: "medium",
    affectedCrops: ["Onions", "Peppers", "Tomatoes", "Beans", "Roses", "Gladiolus"],
    description: "Tiny slender insects that rasp plant tissue and suck fluids. Can transmit tospoviruses including tomato spotted wilt virus.",
    symptoms: [
      "Silvery or bronzed leaf surfaces",
      "Distorted or scarred fruit",
      "Black fecal spots on leaves",
      "Stunted growth",
      "Flower damage and drop"
    ],
    lifecycle: "Eggs inserted into plant tissue. Larvae feed for 1-2 weeks, pupate in soil or leaf litter. Adults live 2-4 weeks. Many generations per year.",
    preventionTips: [
      "Use blue sticky traps for monitoring",
      "Remove weeds that harbor thrips",
      "Avoid planting near onion or grain fields",
      "Use reflective mulches",
      "Maintain good plant hygiene"
    ],
    organicTreatments: [
      {
        name: "Spinosad",
        description: "Highly effective against thrips",
        effectiveness: 90,
        applicationMethod: "Apply in evening when thrips are active",
        safetyRating: "safe",
        costEstimate: "$15-25"
      },
      {
        name: "Predatory Mites",
        description: "Amblyseius cucumeris feeds on thrips larvae",
        effectiveness: 75,
        applicationMethod: "Release preventively, repeat monthly",
        safetyRating: "safe",
        costEstimate: "$25-40"
      },
      {
        name: "Neem Oil",
        description: "Repels and disrupts thrips lifecycle",
        effectiveness: 70,
        applicationMethod: "Spray every 7-14 days",
        safetyRating: "safe",
        costEstimate: "$10-20"
      }
    ],
    chemicalTreatments: [
      {
        name: "Imidacloprid",
        description: "Systemic insecticide for heavy infestations",
        effectiveness: 90,
        applicationMethod: "Soil drench application",
        safetyRating: "caution",
        costEstimate: "$15-30"
      }
    ],
    imageUrl: "/pests/thrips.jpg",
    seasonalRisk: { spring: 70, summer: 95, fall: 60, winter: 20 },
    optimalConditions: { temperature: { min: 20, max: 30 }, humidity: { min: 40, max: 70 } }
  },
  {
    id: "root-knot-nematode",
    name: "Root Knot Nematode",
    scientificName: "Meloidogyne spp.",
    category: "nematode",
    severity: "high",
    affectedCrops: ["Tomatoes", "Peppers", "Carrots", "Lettuce", "Beans", "Okra"],
    description: "Microscopic roundworms that infect plant roots, causing characteristic galls. Reduce nutrient uptake and increase susceptibility to other diseases.",
    symptoms: [
      "Swollen, knotted roots",
      "Stunted plant growth",
      "Wilting despite adequate water",
      "Yellowing leaves",
      "Poor fruit production"
    ],
    lifecycle: "Eggs hatch in soil, juveniles enter roots. Females swell and produce 200-500 eggs. Complete lifecycle in 3-6 weeks. Multiple generations per year.",
    preventionTips: [
      "Rotate with non-host crops like corn or grains",
      "Solarize soil before planting",
      "Plant resistant varieties when available",
      "Add organic matter to soil",
      "Remove and destroy infected root systems"
    ],
    organicTreatments: [
      {
        name: "Soil Solarization",
        description: "Uses sun heat to kill nematodes in top soil layers",
        effectiveness: 85,
        applicationMethod: "Cover moist soil with clear plastic for 4-6 weeks in summer",
        safetyRating: "safe",
        costEstimate: "$10-30"
      },
      {
        name: "Marigold Cover Crop",
        description: "Releases compounds toxic to nematodes",
        effectiveness: 70,
        applicationMethod: "Plant French marigolds and incorporate into soil",
        safetyRating: "safe",
        costEstimate: "$5-15"
      },
      {
        name: "Chitin Amendments",
        description: "Stimulates organisms that prey on nematodes",
        effectiveness: 65,
        applicationMethod: "Work into soil before planting",
        safetyRating: "safe",
        costEstimate: "$20-40"
      }
    ],
    chemicalTreatments: [
      {
        name: "Fluopyram",
        description: "Nematicide that inhibits nematode development",
        effectiveness: 85,
        applicationMethod: "Apply at planting as soil treatment",
        safetyRating: "caution",
        costEstimate: "$30-60"
      }
    ],
    imageUrl: "/pests/nematode.jpg",
    seasonalRisk: { spring: 60, summer: 90, fall: 70, winter: 30 },
    optimalConditions: { temperature: { min: 20, max: 30 }, humidity: { min: 60, max: 90 } }
  },
  {
    id: "squash-vine-borer",
    name: "Squash Vine Borer",
    scientificName: "Melittia cucurbitae",
    category: "insect",
    severity: "critical",
    affectedCrops: ["Squash", "Pumpkins", "Zucchini", "Gourds"],
    description: "Larvae bore into squash stems, causing sudden plant collapse. Adults are day-flying moths with orange and black coloring.",
    symptoms: [
      "Sudden wilting of vines",
      "Sawdust-like frass at stem base",
      "Entry holes in stems",
      "Hollow, rotting stems",
      "Plant death"
    ],
    lifecycle: "Adults emerge in early summer, lay eggs at stem bases. Larvae tunnel through stems for 4-6 weeks, then pupate in soil. One generation in north, two in south.",
    preventionTips: [
      "Use row covers until flowering",
      "Plant later to avoid egg-laying period",
      "Grow resistant varieties like butternut",
      "Hill soil over vines to encourage rooting",
      "Destroy vines after harvest"
    ],
    organicTreatments: [
      {
        name: "Surgical Removal",
        description: "Cut stem and remove larvae manually",
        effectiveness: 85,
        applicationMethod: "Slit stem, remove larva, cover wound with soil",
        safetyRating: "safe",
        costEstimate: "Free"
      },
      {
        name: "Bt Injections",
        description: "Inject Bt directly into stems",
        effectiveness: 75,
        applicationMethod: "Inject weekly at multiple points along vine",
        safetyRating: "safe",
        costEstimate: "$10-20"
      },
      {
        name: "Row Covers",
        description: "Prevent moth egg-laying",
        effectiveness: 99,
        applicationMethod: "Cover plants until flowering, then remove for pollination",
        safetyRating: "safe",
        costEstimate: "$20-40"
      }
    ],
    chemicalTreatments: [
      {
        name: "Carbaryl",
        description: "Apply to stem bases to kill young larvae",
        effectiveness: 80,
        applicationMethod: "Spray stems weekly when moths are active",
        safetyRating: "caution",
        costEstimate: "$12-25"
      }
    ],
    imageUrl: "/pests/vine-borer.jpg",
    seasonalRisk: { spring: 20, summer: 95, fall: 40, winter: 0 },
    optimalConditions: { temperature: { min: 20, max: 32 }, humidity: { min: 40, max: 70 } }
  }
];

export const mockCommunityReports: CommunityReport[] = [
  {
    id: "report-1",
    pestId: "aphid",
    pestName: "Aphids",
    userId: "user-1",
    userName: "Sarah M.",
    location: { lat: 40.7128, lng: -74.0060, address: "Brooklyn, NY" },
    imageUrl: "/pests/aphid.jpg",
    description: "Found heavy aphid infestation on my tomato plants. Using ladybugs to control.",
    severity: "medium",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    upvotes: 24,
    verified: true
  },
  {
    id: "report-2",
    pestId: "tomato-hornworm",
    pestName: "Tomato Hornworm",
    userId: "user-2",
    userName: "Mike R.",
    location: { lat: 34.0522, lng: -118.2437, address: "Los Angeles, CA" },
    imageUrl: "/pests/hornworm.jpg",
    description: "Spotted 3 hornworms on my pepper plants. Hand picked and destroyed.",
    severity: "high",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    upvotes: 18,
    verified: true
  },
  {
    id: "report-3",
    pestId: "powdery-mildew",
    pestName: "Powdery Mildew",
    userId: "user-3",
    userName: "Jennifer L.",
    location: { lat: 41.8781, lng: -87.6298, address: "Chicago, IL" },
    imageUrl: "/pests/powdery-mildew.jpg",
    description: "Powdery mildew appearing on squash leaves. Started milk spray treatment.",
    severity: "medium",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    upvotes: 31,
    verified: false
  },
  {
    id: "report-4",
    pestId: "japanese-beetle",
    pestName: "Japanese Beetle",
    userId: "user-4",
    userName: "David K.",
    location: { lat: 39.9526, lng: -75.1652, address: "Philadelphia, PA" },
    imageUrl: "/pests/japanese-beetle.jpg",
    description: "Japanese beetles destroying my rose bushes. Peak season here!",
    severity: "high",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    upvotes: 45,
    verified: true
  },
  {
    id: "report-5",
    pestId: "spider-mites",
    pestName: "Spider Mites",
    userId: "user-5",
    userName: "Emily W.",
    location: { lat: 33.4484, lng: -112.0740, address: "Phoenix, AZ" },
    imageUrl: "/pests/spider-mites.jpg",
    description: "Spider mites thriving in our dry heat. Webbing all over my beans.",
    severity: "high",
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    upvotes: 22,
    verified: true
  },
  {
    id: "report-6",
    pestId: "late-blight",
    pestName: "Late Blight",
    userId: "user-6",
    userName: "Tom H.",
    location: { lat: 47.6062, lng: -122.3321, address: "Seattle, WA" },
    imageUrl: "/pests/late-blight.jpg",
    description: "URGENT: Late blight confirmed on potatoes. Destroying all infected plants.",
    severity: "critical",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    upvotes: 89,
    verified: true
  },
  {
    id: "report-7",
    pestId: "whitefly",
    pestName: "Whiteflies",
    userId: "user-7",
    userName: "Maria G.",
    location: { lat: 25.7617, lng: -80.1918, address: "Miami, FL" },
    imageUrl: "/pests/whitefly.jpg",
    description: "Whitefly clouds on my hibiscus. Using yellow sticky traps.",
    severity: "medium",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    upvotes: 16,
    verified: false
  },
  {
    id: "report-8",
    pestId: "colorado-potato-beetle",
    pestName: "Colorado Potato Beetle",
    userId: "user-8",
    userName: "James P.",
    location: { lat: 42.3601, lng: -71.0589, address: "Boston, MA" },
    imageUrl: "/pests/colorado-beetle.jpg",
    description: "First sighting of Colorado beetles this season. Starting Bt treatment.",
    severity: "critical",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    upvotes: 37,
    verified: true
  }
];

export function getPestById(id: string): Pest | undefined {
  return pests.find(pest => pest.id === id);
}

export function getPestsByCategory(category: Pest["category"]): Pest[] {
  return pests.filter(pest => pest.category === category);
}

export function getPestsBySeverity(severity: Pest["severity"]): Pest[] {
  return pests.filter(pest => pest.severity === severity);
}

export function searchPests(query: string): Pest[] {
  const lowerQuery = query.toLowerCase();
  return pests.filter(pest => 
    pest.name.toLowerCase().includes(lowerQuery) ||
    pest.scientificName.toLowerCase().includes(lowerQuery) ||
    pest.affectedCrops.some(crop => crop.toLowerCase().includes(lowerQuery)) ||
    pest.category.toLowerCase().includes(lowerQuery)
  );
}

export function calculatePestRisk(
  pest: Pest,
  temperature: number,
  humidity: number,
  season: "spring" | "summer" | "fall" | "winter"
): number {
  const seasonRisk = pest.seasonalRisk[season];
  
  const tempOptimal = pest.optimalConditions.temperature;
  const tempScore = temperature >= tempOptimal.min && temperature <= tempOptimal.max
    ? 100
    : Math.max(0, 100 - Math.abs(temperature - (tempOptimal.min + tempOptimal.max) / 2) * 5);
  
  const humidOptimal = pest.optimalConditions.humidity;
  const humidScore = humidity >= humidOptimal.min && humidity <= humidOptimal.max
    ? 100
    : Math.max(0, 100 - Math.abs(humidity - (humidOptimal.min + humidOptimal.max) / 2) * 2);
  
  return Math.round((seasonRisk * 0.4 + tempScore * 0.3 + humidScore * 0.3));
}
