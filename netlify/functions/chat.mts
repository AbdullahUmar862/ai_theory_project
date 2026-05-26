import type { Config } from '@netlify/functions'

// ---------------------------------------------------------------------------
// Farming knowledge base (ported from app.py)
// ---------------------------------------------------------------------------
const FARMING_KNOWLEDGE: Record<string, { keywords: string[]; response: string }> = {
  greetings: {
    keywords: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'howdy', 'sup'],
    response:
      "Hello! I'm your AgriShield AI Advisor - a virtual agronomist here to help you with crop diseases, soil health, irrigation, pest control, and farming tips. Ask me anything about agriculture!",
  },
  thanks: {
    keywords: ['thank', 'thanks', 'thank you', 'appreciate', 'helpful'],
    response:
      "You're welcome! I'm always here to help with your farming questions. Don't hesitate to ask anything else about crop health, diseases, or farming practices!",
  },
  soil_health: {
    keywords: ['soil', 'soil health', 'soil test', 'ph', 'soil preparation', 'compost', 'organic matter', 'fertilizer', 'nutrient'],
    response:
      '**Soil Health Tips:**\n\n- **Test your soil** every season for pH, nitrogen, phosphorus, and potassium levels\n- **Ideal pH range**: 6.0-7.0 for most vegetables\n- **Add organic compost** (2-3 inches) to improve soil structure and nutrients\n- **Use cover crops** like clover or rye during off-season to prevent erosion\n- **Avoid over-tilling** which destroys beneficial soil organisms\n- **Rotate crops** annually to prevent nutrient depletion\n- **Mulch** with straw or leaves to retain moisture and suppress weeds\n\n**Organic Fertilizers:**\n- Vermicompost - excellent all-purpose\n- Bone meal - high in phosphorus\n- Blood meal - high in nitrogen\n- Wood ash - adds potassium and raises pH',
  },
  irrigation: {
    keywords: ['water', 'irrigation', 'watering', 'drip', 'sprinkler', 'moisture', 'drought', 'overwater'],
    response:
      '**Irrigation Best Practices:**\n\n- **Drip irrigation** is most efficient (90-95% water efficiency)\n- **Water early morning** (6-10 AM) to reduce evaporation and disease\n- **Avoid overhead watering** in evening - promotes fungal diseases\n- **Check soil moisture** 2-3 inches deep before watering\n- **Mulch around plants** to retain 25-50% more moisture\n\n**Crop Water Needs:**\n- Tomato: 1-2 inches/week\n- Potato: 1-2 inches/week\n- Corn: 1.5-2 inches/week\n- Pepper: 1-1.5 inches/week\n\n**Signs of Overwatering:** Yellow leaves, wilting despite wet soil, root rot\n**Signs of Underwatering:** Crispy leaf edges, drooping, slow growth',
  },
  pest_control: {
    keywords: ['pest', 'insect', 'bug', 'aphid', 'whitefly', 'caterpillar', 'beetle', 'worm', 'mite', 'pesticide'],
    response:
      '**Integrated Pest Management (IPM):**\n\n**Biological Controls:**\n- Ladybugs eat aphids (1 ladybug = 50 aphids/day)\n- Lacewings control whiteflies and mealybugs\n- Neem oil spray (5 ml/L) - effective organic pesticide\n- Bacillus thuringiensis (Bt) for caterpillars\n\n**Cultural Controls:**\n- Rotate crops to break pest cycles\n- Use yellow sticky traps for whiteflies\n- Plant marigolds as companion plants to repel pests\n- Remove weeds that harbor insects\n- Encourage beneficial insects with diverse plantings\n\n**Organic Sprays:**\n- Neem oil: 5 ml/L for most pests\n- Garlic + chili spray: Natural repellent\n- Insecticidal soap: 20 ml/L for soft-bodied insects\n- Diatomaceous earth: For crawling insects',
  },
  crop_rotation: {
    keywords: ['rotation', 'crop rotation', 'rotate', 'succession', 'planting plan'],
    response:
      '**Crop Rotation Guide:**\n\n**4-Year Rotation Plan:**\n- Year 1: Legumes (beans, peas) - fix nitrogen\n- Year 2: Leafy greens (spinach, lettuce) - use nitrogen\n- Year 3: Fruiting crops (tomato, pepper) - heavy feeders\n- Year 4: Root crops (potato, carrot) - break disease cycles\n\n**Rules:**\n- Never plant the same family in the same spot 2 years in a row\n- Solanaceae family (tomato, potato, pepper, eggplant) - rotate together\n- Follow heavy feeders with light feeders\n- Plant legumes before nitrogen-hungry crops\n\n**Benefits:**\n- Reduces soil-borne diseases by 60-80%\n- Improves soil fertility naturally\n- Breaks pest reproduction cycles\n- Increases yield by 10-25%',
  },
  tomato: {
    keywords: ['tomato', 'tomatoes'],
    response:
      '**Tomato Growing Guide:**\n\n**Common Diseases:**\n- Early Blight: Dark concentric rings on leaves. Treat with Mancozeb 2.5g/L\n- Late Blight: Water-soaked patches, white mold. Use Ridomil Gold MZ 2.5g/L\n- Bacterial Spot: Dark spots with yellow halos. Apply copper hydroxide\n- Leaf Mold: Yellow spots, olive mold underneath. Improve ventilation\n- Septoria Leaf Spot: Small circular spots. Use Chlorothalonil spray\n\n**Growing Tips:**\n- Plant in full sun (6-8 hours daily)\n- Space plants 18-24 inches apart\n- Stake or cage for support\n- Water at base, not leaves\n- Prune suckers for better airflow\n- Harvest when fully colored\n\nUpload a leaf image to the Disease Scanner for AI-powered diagnosis!',
  },
  potato: {
    keywords: ['potato', 'potatoes'],
    response:
      '**Potato Growing Guide:**\n\n**Common Diseases:**\n- Early Blight: Bull\'s-eye pattern on leaves. Treat with Mancozeb 2.5g/L\n- Late Blight: Rapid browning, white mold. Use Ridomil Gold MZ 2.5g/L\n\n**Growing Tips:**\n- Plant seed potatoes 4 inches deep, 12 inches apart\n- Hill soil around stems as plants grow (every 2-3 weeks)\n- Water consistently - 1-2 inches per week\n- Harvest 2-3 weeks after foliage dies back\n- Cure in dark, cool place for 1-2 weeks\n\n**Prevention:**\n- Use certified disease-free seed potatoes\n- Don\'t plant where tomatoes/peppers grew last year\n- Destroy any volunteer potato plants\n\nUpload a leaf image to the Disease Scanner for AI-powered diagnosis!',
  },
  corn: {
    keywords: ['corn', 'maize'],
    response:
      '**Corn/Maize Growing Guide:**\n\n**Common Diseases:**\n- Gray Leaf Spot: Rectangular gray lesions. Treat with Azoxystrobin 0.75ml/L\n- Common Rust: Reddish-brown pustules. Apply Propiconazole 1ml/L\n- Northern Leaf Blight: Cigar-shaped lesions. Use Mancozeb 2.5g/L\n\n**Growing Tips:**\n- Plant in blocks (not single rows) for better pollination\n- Space 8-12 inches apart in rows 30-36 inches apart\n- Needs lots of nitrogen - side-dress with fertilizer at knee height\n- Water 1.5-2 inches per week, especially during tasseling\n- Harvest when silks turn brown and kernels are milky\n\nUpload a leaf image to the Disease Scanner for AI-powered diagnosis!',
  },
  apple: {
    keywords: ['apple', 'apples'],
    response:
      '**Apple Tree Care Guide:**\n\n**Common Diseases:**\n- Apple Scab: Olive-green velvety spots. Treat with Captan 2.5g/L\n- Black Rot: Dark rotting fruit, cankers. Apply Thiophanate-methyl 1g/L\n- Cedar Apple Rust: Bright orange spots. Use Myclobutanil 0.5ml/L\n\n**Care Tips:**\n- Prune annually in late winter for airflow\n- Thin fruit to 1 apple per cluster for larger fruit\n- Apply dormant spray before bud break\n- Rake fallen leaves in autumn to prevent scab\n- Water deeply but infrequently\n\nUpload a leaf image to the Disease Scanner for AI-powered diagnosis!',
  },
  grape: {
    keywords: ['grape', 'grapes', 'vineyard', 'vine'],
    response:
      '**Grape Growing Guide:**\n\n**Common Diseases:**\n- Black Rot: Brown lesions, shriveled fruit. Treat with Myclobutanil 0.5ml/L\n- Esca (Black Measles): Tiger-stripe leaves. No cure - remove infected vines\n- Leaf Blight: Brown spots, leaf drop. Use Mancozeb 2.5g/L\n\n**Care Tips:**\n- Train on trellis system for airflow\n- Prune heavily in dormant season (90% of previous growth)\n- Manage canopy to reduce humidity\n- Remove mummified fruit promptly\n- Water at base, avoid wetting foliage\n\nUpload a leaf image to the Disease Scanner for AI-powered diagnosis!',
  },
  pepper: {
    keywords: ['pepper', 'bell pepper', 'chili', 'capsicum'],
    response:
      '**Bell Pepper Growing Guide:**\n\n**Common Diseases:**\n- Bacterial Spot: Dark water-soaked lesions. Treat with Copper hydroxide 2g/L\n\n**Growing Tips:**\n- Start indoors 8-10 weeks before last frost\n- Transplant when soil is warm (65F+)\n- Space 18-24 inches apart\n- Mulch to maintain soil moisture and temperature\n- Harvest when firm and full-sized (green or colored)\n\n**Nutrition:**\n- Peppers need calcium to prevent blossom end rot\n- Side-dress with compost at flowering\n- Avoid excess nitrogen (causes leafy growth, fewer fruits)\n\nUpload a leaf image to the Disease Scanner for AI-powered diagnosis!',
  },
  disease_general: {
    keywords: ['disease', 'infection', 'fungus', 'fungal', 'bacterial', 'virus', 'blight', 'rot', 'mold', 'rust', 'spot', 'wilt', 'scab', 'cure', 'treatment', 'medicine'],
    response:
      '**Common Crop Disease Management:**\n\n**Fungal Diseases (most common):**\n- Treat with Mancozeb (Dithane M-45) - 2.5 g/L spray\n- Copper oxychloride (Blitox) - 3 g/L spray\n- Azoxystrobin (Amistar) - 1 ml/L for advanced infections\n\n**Bacterial Diseases:**\n- Copper hydroxide (Kocide) - 2 g/L spray\n- Streptomycin sulfate - 200 ppm spray\n- Remove infected parts immediately\n\n**Viral Diseases:**\n- No chemical cure available\n- Control insect vectors (aphids, whiteflies)\n- Remove and destroy infected plants\n- Use resistant varieties\n\n**Prevention is Key:**\n- Practice crop rotation\n- Ensure good air circulation\n- Avoid overhead watering\n- Use certified disease-free seeds\n\nFor accurate diagnosis, upload a leaf image to the **Disease Scanner** tab!',
  },
  organic: {
    keywords: ['organic', 'natural', 'chemical free', 'bio', 'sustainable'],
    response:
      '**Organic Farming Practices:**\n\n**Pest Control:**\n- Neem oil: Universal organic pesticide (5 ml/L)\n- Garlic-chili extract: Natural insect repellent\n- Diatomaceous earth: For crawling pests\n- Companion planting: Marigolds, basil, nasturtiums\n\n**Disease Control:**\n- Copper-based sprays (approved organic fungicide)\n- Sulfur dust: For powdery mildew\n- Baking soda spray: 1 tbsp/gallon for mild fungal issues\n- Trichoderma bio-fungicide\n\n**Soil Building:**\n- Compost: Foundation of organic farming\n- Vermicompost: Nutrient-rich worm castings\n- Green manure: Cover crops turned into soil\n- Bone meal and blood meal for nutrients\n\n**Certification:** Contact your local agricultural office for organic certification guidelines.',
  },
  weather: {
    keywords: ['weather', 'rain', 'monsoon', 'season', 'climate', 'frost', 'heat', 'cold', 'temperature', 'humidity'],
    response:
      '**Weather & Crop Management:**\n\n**Hot Weather (>35C/95F):**\n- Increase watering frequency\n- Use shade cloth (30-50% shade)\n- Mulch heavily to keep roots cool\n- Harvest early morning when cool\n\n**Rainy/Monsoon Season:**\n- Ensure good drainage\n- Apply preventive fungicide before rains\n- Stake plants to prevent lodging\n- Monitor for increased disease pressure\n\n**Cold/Frost:**\n- Cover plants with row covers or plastic\n- Water soil before frost (retains heat)\n- Harvest frost-sensitive crops before first frost\n- Use cold frames for extending season\n\n**High Humidity:**\n- Space plants wider for airflow\n- Prune lower leaves\n- Apply preventive fungicide\n- Use drip irrigation (not overhead)',
  },
  harvest: {
    keywords: ['harvest', 'pick', 'ripe', 'yield', 'produce', 'storage', 'store'],
    response:
      '**Harvesting & Storage Tips:**\n\n**When to Harvest:**\n- Tomatoes: Firm, fully colored, slight give when squeezed\n- Potatoes: 2-3 weeks after foliage dies back\n- Corn: Silks brown, kernels milky when pierced\n- Peppers: Firm, full-sized, desired color reached\n- Apples: Twist gently - ripe fruit detaches easily\n\n**Storage:**\n- Tomatoes: Room temperature (never refrigerate unripe ones)\n- Potatoes: Cool, dark place (45-50F), cure first for 1-2 weeks\n- Corn: Refrigerate immediately, use within 2-3 days\n- Apples: Cold storage (32-35F), check for rot regularly\n\n**Post-Harvest:**\n- Remove crop debris to reduce disease carryover\n- Add compost to replenish soil\n- Plant cover crops for winter',
  },
  plant_nutrition: {
    keywords: ['npk', 'nitrogen', 'phosphorus', 'potassium', 'deficiency', 'yellow leaves', 'calcium', 'magnesium', 'nutrition'],
    response:
      '**Plant Nutrition Guide (NPK):**\n\n**Nitrogen (N) - Leaves & Stems:**\n- Good for: Leafy greens, early growth stages\n- Deficiency: Older leaves turn pale yellow\n- Sources: Blood meal, fish emulsion, compost, manure\n\n**Phosphorus (P) - Roots & Blooms:**\n- Good for: Root development, flower/fruit production\n- Deficiency: Stunted growth, dark green/purplish leaves\n- Sources: Bone meal, rock phosphate\n\n**Potassium (K) - Overall Health:**\n- Good for: Disease resistance, water regulation, fruit quality\n- Deficiency: Brown scorching on leaf edges\n- Sources: Wood ash, kelp meal, greensand\n\n**Micronutrients:**\n- Calcium deficiency causes Blossom End Rot in tomatoes/peppers. Fix with crushed eggshells or garden lime.',
  },
  composting: {
    keywords: ['compost', 'composting', 'bin', 'pile', 'mulch', 'vermicompost', 'worms'],
    response:
      "**Composting Best Practices:**\n\n**The Recipe (Carbon to Nitrogen ratio):**\nAim for 2 parts 'Browns' (Carbon) to 1 part 'Greens' (Nitrogen).\n\n**Browns (Carbon):**\n- Dry leaves, straw, hay, paper, cardboard, sawdust\n\n**Greens (Nitrogen):**\n- Grass clippings, vegetable scraps, coffee grounds, manure (herbivore)\n\n**Do NOT Compost:**\n- Meat, dairy, oils/grease, pet waste, diseased plants, invasive weeds with seeds\n\n**Maintenance:**\n- Turn the pile every 1-2 weeks to aerate\n- Keep it as moist as a wrung-out sponge\n- Should be ready in 3-6 months\n- Vermicomposting (using red wiggler worms) is faster and produces nutrient-dense castings.",
  },
  weed_management: {
    keywords: ['weed', 'weeds', 'weeding', 'herbicide', 'mulching', 'bindweed', 'crabgrass'],
    response:
      '**Organic Weed Management:**\n\n**Cultural Control:**\n- **Mulching:** Apply 2-3 inches of organic mulch (straw, wood chips) to block light and prevent weed seed germination.\n- **Cover Crops:** Plant dense cover crops like clover or buckwheat to outcompete weeds.\n- **Spacing:** Plant crops closer together to shade the soil canopy.\n\n**Mechanical Control:**\n- Hoeing and hand-pulling when weeds are young (easier when soil is moist).\n- Solarization: Cover moist soil with clear plastic for 4-6 weeks in summer to kill weed seeds using sun\'s heat.\n\n**Natural Herbicides (Use with Caution!):**\n- Horticultural vinegar (20% acetic acid) mixed with a little dish soap. Spray directly on young weed leaves on a sunny day. *Note: This is non-selective and will harm any plant it touches.*',
  },
  beneficial_insects: {
    keywords: ['beneficial', 'good bugs', 'ladybug', 'lacewing', 'bee', 'pollinator', 'wasp', 'predator'],
    response:
      '**Beneficial Insects & Pollinators:**\n\n**Predators (Eat Pests):**\n- **Ladybugs:** Voracious aphid eaters.\n- **Green Lacewings:** Larvae consume aphids, mealybugs, and caterpillars.\n- **Praying Mantis:** Ambush predators (but they eat good and bad bugs).\n- **Hoverflies:** Larvae eat aphids; adults pollinate.\n- **Parasitic Wasps:** Lay eggs inside caterpillars and aphids (e.g., tomato hornworm).\n\n**Pollinators (Help Plants Fruit):**\n- Honeybees, Bumblebees, Mason Bees, Butterflies.\n\n**How to Attract Them:**\n- Plant diverse, nectar-rich flowers (marigolds, dill, fennel, yarrow, sunflowers).\n- Provide shallow water sources.\n- Minimize broad-spectrum pesticide use, even organic ones!',
  },
  about: {
    keywords: ['who are you', 'what are you', 'what can you do', 'help', 'capabilities', 'features'],
    response:
      "**I'm AgriShield AI Advisor!**\n\nI can help you with:\n\n- **Crop Diseases** - Ask about diseases in tomato, potato, corn, apple, grape, pepper\n- **Medicine & Treatment** - Get specific fungicide/pesticide recommendations\n- **Soil Health** - pH management, composting, fertilization\n- **Irrigation** - Watering schedules, drip systems\n- **Pest Control** - IPM, organic solutions\n- **Crop Rotation** - Planning and scheduling\n- **Organic Farming** - Chemical-free methods\n- **Weather Management** - Season-specific advice\n- **Harvesting** - When and how to harvest\n\n**For disease diagnosis**, switch to the **Disease Scanner** tab and upload a leaf image!\n\nTry asking: 'How to treat tomato blight?' or 'What's a good crop rotation plan?'",
  },
}

// ---------------------------------------------------------------------------
// Key disease entries (subset of Python DISEASE_KNOWLEDGE)
// ---------------------------------------------------------------------------
interface DiseaseInfo {
  plant_type: string
  health_status: string
  diagnosis: string
  symptoms: string[]
  medicine: string[]
  management: string[]
}

const DISEASE_KNOWLEDGE: Record<string, DiseaseInfo> = {
  'Tomato___Bacterial_spot': {
    plant_type: 'Tomato', health_status: 'Diseased', diagnosis: 'Bacterial Spot',
    symptoms: ['Small, dark, water-soaked spots on leaves', 'Spots may have yellow halos', 'Lesions on fruit appear as raised, scabby areas'],
    medicine: ['Copper hydroxide (Kocide 3000) - Apply every 7-10 days', 'Streptomycin sulfate (Agri-Mycin 17) - 200 ppm foliar spray'],
    management: ['Remove and destroy infected plant debris', 'Use disease-free certified seeds', 'Practice crop rotation for 2-3 years'],
  },
  'Tomato___Early_blight': {
    plant_type: 'Tomato', health_status: 'Diseased', diagnosis: 'Early Blight',
    symptoms: ['Dark brown to black concentric rings on older leaves (target-like spots)', 'Yellowing around the lesions', 'Lower leaves affected first'],
    medicine: ['Chlorothalonil (Bravo/Daconil) - Apply every 7-14 days', 'Mancozeb (Dithane M-45) - 2-3 g/L foliar spray', 'Azoxystrobin (Amistar) - 1 ml/L at early symptoms'],
    management: ['Remove infected lower leaves promptly', 'Apply organic mulch to prevent soil splash', 'Practice 3-year crop rotation'],
  },
  'Tomato___Late_blight': {
    plant_type: 'Tomato', health_status: 'Diseased', diagnosis: 'Late Blight',
    symptoms: ['Large, irregular, water-soaked grayish-green patches on leaves', 'White fuzzy mold growth on leaf undersides in humid conditions', 'Dark brown firm lesions on stems'],
    medicine: ['Metalaxyl + Mancozeb (Ridomil Gold MZ) - 2.5 g/L spray', 'Cymoxanil + Mancozeb (Curzate M8) - 3 g/L spray'],
    management: ['Remove and destroy all infected plants immediately', 'Do not compost infected material', 'Avoid overhead watering'],
  },
  'Potato___Early_blight': {
    plant_type: 'Potato', health_status: 'Diseased', diagnosis: 'Early Blight',
    symptoms: ['Dark brown concentric rings on older leaves (bull\'s-eye pattern)', 'Yellowing around the spots', 'Lower leaves affected first'],
    medicine: ['Mancozeb (Dithane M-45) - 2.5 g/L spray every 7-10 days', 'Chlorothalonil (Kavach) - 2 g/L spray'],
    management: ['Remove and destroy infected foliage promptly', 'Practice crop rotation for 3 years', 'Use certified disease-free seed potatoes'],
  },
  'Potato___Late_blight': {
    plant_type: 'Potato', health_status: 'Diseased', diagnosis: 'Late Blight',
    symptoms: ['Large irregular water-soaked patches on leaves', 'White mold growth on leaf undersides', 'Dark brown spots spreading rapidly'],
    medicine: ['Metalaxyl + Mancozeb (Ridomil Gold MZ) - 2.5 g/L spray', 'Copper hydroxide (Kocide) - 2.5 g/L spray'],
    management: ['Remove and destroy all infected plants immediately', 'Harvest tubers promptly before infection spreads', 'Plant resistant potato varieties'],
  },
  'Apple___Apple_scab': {
    plant_type: 'Apple', health_status: 'Diseased', diagnosis: 'Apple Scab',
    symptoms: ['Olive-green to dark brown velvety spots on leaves', 'Scabby rough-textured lesions on fruit surface', 'Premature leaf drop in severe cases'],
    medicine: ['Captan (50WP) - 2.5 g/L spray during spring', 'Myclobutanil (Rally) - 0.5 ml/L spray'],
    management: ['Rake and remove fallen leaves in autumn', 'Prune trees to improve air circulation', 'Plant scab-resistant apple varieties'],
  },
  'Apple___Black_rot': {
    plant_type: 'Apple', health_status: 'Diseased', diagnosis: 'Black Rot',
    symptoms: ['Purplish-brown spots on leaves (frogeye leaf spot)', 'Dark rotting areas on fruit starting from the blossom end', 'Cankers on branches'],
    medicine: ['Captan (50WP) - 2.5 g/L spray at petal fall', 'Thiophanate-methyl (Topsin-M) - 1 g/L spray'],
    management: ['Prune and destroy dead or infected branches', 'Remove mummified fruit from trees and ground'],
  },
  'Corn_(maize)___Common_rust_': {
    plant_type: 'Corn (Maize)', health_status: 'Diseased', diagnosis: 'Common Rust',
    symptoms: ['Small reddish-brown to cinnamon-brown raised pustules on both leaf surfaces', 'Pustules scattered across the leaf blade'],
    medicine: ['Propiconazole (Tilt 25EC) - 1 ml/L foliar spray', 'Azoxystrobin (Amistar) - 1 ml/L spray'],
    management: ['Plant rust-resistant corn hybrids', 'Ensure timely planting to avoid peak rust season'],
  },
  'Corn_(maize)___Northern_Leaf_Blight': {
    plant_type: 'Corn (Maize)', health_status: 'Diseased', diagnosis: 'Northern Leaf Blight',
    symptoms: ['Long, elliptical grayish-green to tan cigar-shaped lesions on leaves', 'Lesions may reach 2-6 inches in length'],
    medicine: ['Propiconazole (Tilt) - 1 ml/L spray at early infection', 'Azoxystrobin + Propiconazole (Quilt Xcel) - 1 ml/L'],
    management: ['Use resistant corn hybrids with Ht genes', 'Practice crop rotation away from corn for 1-2 years'],
  },
  'Grape___Black_rot': {
    plant_type: 'Grape', health_status: 'Diseased', diagnosis: 'Black Rot',
    symptoms: ['Brown circular lesions with dark borders on leaves', 'Fruit turns brown, shrivels, and becomes hard black mummies'],
    medicine: ['Myclobutanil (Rally) - 0.5 ml/L spray at shoot growth', 'Mancozeb (Dithane) - 2.5 g/L preventive spray'],
    management: ['Remove mummified fruit and infected debris from vineyard', 'Prune for open canopy to improve air circulation'],
  },
  'Grape___Esca_(Black_Measles)': {
    plant_type: 'Grape', health_status: 'Diseased', diagnosis: 'Esca (Black Measles)',
    symptoms: ['Interveinal striping - tiger-stripe pattern on leaves', 'Dark spots and streaks on berries', 'Sudden vine wilting in severe cases'],
    medicine: ['No effective chemical cure currently available', 'Trichoderma-based biocontrol agents on pruning wounds'],
    management: ['Remove and destroy severely infected vines', 'Protect pruning wounds with wound sealant'],
  },
  'Pepper,_bell___Bacterial_spot': {
    plant_type: 'Bell Pepper', health_status: 'Diseased', diagnosis: 'Bacterial Spot',
    symptoms: ['Small, dark, water-soaked lesions on leaves', 'Raised, scab-like lesions on fruit', 'Defoliation and reduced fruit quality'],
    medicine: ['Copper hydroxide (Kocide 3000) - 2 g/L spray every 7-10 days', 'Streptomycin sulfate - 200 ppm spray (where permitted)'],
    management: ['Use disease-free certified seeds and transplants', 'Practice crop rotation for 2-3 years', 'Avoid overhead irrigation'],
  },
}

const DEFAULT_FALLBACK = `I understand you're asking about farming. Here are some topics I can help with:\n\n- **Crop Diseases** - Ask about tomato, potato, corn, apple, grape, or pepper diseases\n- **Medicine/Treatment** - Get specific treatment recommendations\n- **Soil Health** - Composting, pH, fertilization\n- **Irrigation** - Watering tips and schedules\n- **Pest Control** - Organic and IPM methods\n- **Crop Rotation** - Planning rotations\n- **Organic Farming** - Chemical-free practices\n- **Weather** - Season-specific crop advice\n- **Harvesting** - When and how to harvest\n\nTry asking something like:\n- 'How to treat potato blight?'\n- 'Tell me about soil health'\n- 'Best pest control methods'\n\nOr use the **Disease Scanner** tab to upload a leaf image for AI diagnosis!`

function getChatbotResponse(userMessage: string): string {
  const msgLower = userMessage.toLowerCase().trim()

  let bestMatch: string | null = null
  let bestScore = 0

  for (const [topic, data] of Object.entries(FARMING_KNOWLEDGE)) {
    let score = 0
    for (const keyword of data.keywords) {
      if (msgLower.includes(keyword)) {
        score += keyword.split(' ').length
      }
    }
    if (score > bestScore) {
      bestScore = score
      bestMatch = topic
    }
  }

  let bestDiseaseMatch: DiseaseInfo | null = null
  let bestDiseaseScore = 0

  for (const info of Object.values(DISEASE_KNOWLEDGE)) {
    if (info.health_status === 'Healthy') continue

    const plant = info.plant_type.toLowerCase()
    const disease = info.diagnosis.toLowerCase()
    let score = 0

    if (disease && msgLower.includes(disease)) score += 10
    if (disease) {
      const words = disease.split(' ').filter((w) => w.length > 3)
      for (const w of words) {
        if (msgLower.includes(w)) score += 3
      }
    }
    if (plant && msgLower.includes(plant)) score += 4

    if (score > bestDiseaseScore && score >= 6) {
      bestDiseaseScore = score
      bestDiseaseMatch = info
    }
  }

  if (bestDiseaseMatch) {
    const info = bestDiseaseMatch
    const symptoms = info.symptoms.map((s) => `- ${s}`).join('\n')
    const medicines = info.medicine.map((m) => `- ${m}`).join('\n')
    const management = info.management.map((m) => `- ${m}`).join('\n')

    return (
      `**${info.plant_type} - ${info.diagnosis}**\n\n` +
      `**Status:** ${info.health_status}\n\n` +
      `**Symptoms:**\n${symptoms}\n\n` +
      `**Recommended Medicine:**\n${medicines}\n\n` +
      `**Management:**\n${management}\n\n` +
      `For visual diagnosis, upload a leaf image to the **Disease Scanner** tab!`
    )
  }

  if (bestMatch && bestScore > 0) {
    return FARMING_KNOWLEDGE[bestMatch].response
  }

  return DEFAULT_FALLBACK
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------
export default async (req: Request) => {
  const url = new URL(req.url)

  if (url.pathname.endsWith('/clear')) {
    return Response.json({ success: true, message: 'Conversation history cleared.' })
  }

  let body: { message?: string }
  try {
    body = await req.json()
  } catch {
    return Response.json({ success: false, error: 'Invalid JSON body.' }, { status: 400 })
  }

  const message = body?.message?.trim()
  if (!message) {
    return Response.json({ success: false, error: 'Please enter a message before sending.' }, { status: 400 })
  }

  const reply = getChatbotResponse(message)
  return Response.json({ success: true, reply })
}

export const config: Config = {
  path: ['/api/chat', '/api/chat/clear'],
  method: 'POST',
}
