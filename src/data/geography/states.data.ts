import { StateRecord, ZoneRecord } from "@/types/geography.types";

export const geopoliticalZones: ZoneRecord[] = [
  {
    id: "north-central",
    name: "North-Central",
    shortName: "North-Central",
    states: ["NG-BE", "NG-KO", "NG-KW", "NG-NA", "NG-NI", "NG-PL", "NG-FC"],
    color: "#2563EB", // Blue
    description: "Agricultural heartland, hydroelectric energy production, and federal capital seat.",
    keyHighlight: "700MW Zungeru Hydroelectric Power Operation & Lokoja River Trade Corridor"
  },
  {
    id: "north-east",
    name: "North-East",
    shortName: "North-East",
    states: ["NG-AD", "NG-BA", "NG-BO", "NG-GO", "NG-TA", "NG-YO"],
    color: "#7C3AED", // Purple
    description: "Security stabilization, IDP resettlement, and agrarian recovery zone.",
    keyHighlight: "Counter-insurgency stabilization & Lake Chad basin rehabilitation"
  },
  {
    id: "north-west",
    name: "North-West",
    shortName: "North-West",
    states: ["NG-JI", "NG-KD", "NG-KN", "NG-KT", "NG-KB", "NG-SO", "NG-ZA"],
    color: "#059669", // Emerald
    description: "Dry-season wheat initiatives, industrial manufacturing, and regional highway corridors.",
    keyHighlight: "Abuja-Kaduna-Kano Dual Carriageway & Dry-Season Wheat Cultivation"
  },
  {
    id: "south-east",
    name: "South-East",
    shortName: "South-East",
    states: ["NG-AB", "NG-AN", "NG-EB", "NG-EN", "NG-IM"],
    color: "#D97706", // Amber
    description: "Commercial trade hubs, Second Niger Bridge connectivity, and manufacturing clusters.",
    keyHighlight: "Second Niger Bridge Access Roads & Enugu-Port Harcourt Expressway"
  },
  {
    id: "south-south",
    name: "South-South",
    shortName: "South-South",
    states: ["NG-AK", "NG-BY", "NG-CR", "NG-DE", "NG-ED", "NG-RI"],
    color: "#DC2626", // Red
    description: "Maritime ports, coastal highway corridor, energy resources, and blue economy.",
    keyHighlight: "700km Lagos-Calabar Coastal Highway Corridor & Deep Sea Port Access"
  },
  {
    id: "south-west",
    name: "South-West",
    shortName: "South-West",
    states: ["NG-EK", "NG-LA", "NG-OG", "NG-ON", "NG-OS", "NG-OY"],
    color: "#0284C7", // Sky
    description: "Financial hub, technological innovation, industrial corridors, and rail logistics.",
    keyHighlight: "Lagos-Ibadan Standard Gauge Railway & FX Market Unification Impact"
  }
];

export const statesData: StateRecord[] = [
  {
    code: "NG-AB",
    slug: "abia",
    name: "Abia State",
    shortName: "Abia",
    capital: "Umuahia",
    zone: "South-East",
    officialPortal: "https://abiastate.gov.ng",
    description: "Commercial and manufacturing center in South-Eastern Nigeria known for footwear and garment hubs.",
    geoCenter: [7.5248, 5.532]
  },
  {
    code: "NG-AD",
    slug: "adamawa",
    name: "Adamawa State",
    shortName: "Adamawa",
    capital: "Yola",
    zone: "North-East",
    officialPortal: "https://adamawastate.gov.ng",
    description: "Agrarian state in North-Eastern Nigeria sharing international boundaries with Cameroon.",
    geoCenter: [12.401, 9.3265]
  },
  {
    code: "NG-AK",
    slug: "akwa-ibom",
    name: "Akwa Ibom State",
    shortName: "Akwa Ibom",
    capital: "Uyo",
    zone: "South-South",
    officialPortal: "https://akwaibomstate.gov.ng",
    description: "Maritime coastal state connected along the 700km Lagos-Calabar Coastal Highway corridor.",
    geoCenter: [7.8537, 5.0389]
  },
  {
    code: "NG-AN",
    slug: "anambra",
    name: "Anambra State",
    shortName: "Anambra",
    capital: "Awka",
    zone: "South-East",
    officialPortal: "https://anambrastate.gov.ng",
    description: "Major industrial and commercial trade hub along the River Niger and Second Niger Bridge corridor.",
    geoCenter: [7.0699, 6.2209]
  },
  {
    code: "NG-BA",
    slug: "bauchi",
    name: "Bauchi State",
    shortName: "Bauchi",
    capital: "Bauchi",
    zone: "North-East",
    officialPortal: "https://bauchistate.gov.ng",
    description: "North-Eastern state featuring Yankari National Park and agricultural livestock production.",
    geoCenter: [9.8442, 10.3158]
  },
  {
    code: "NG-BY",
    slug: "bayelsa",
    name: "Bayelsa State",
    shortName: "Bayelsa",
    capital: "Yenagoa",
    zone: "South-South",
    officialPortal: "https://bayelsastate.gov.ng",
    description: "Core Niger Delta maritime state with extensive wetland ecosystems and coastal transport routes.",
    geoCenter: [6.0369, 4.7719]
  },
  {
    code: "NG-BE",
    slug: "benue",
    name: "Benue State",
    shortName: "Benue",
    capital: "Makurdi",
    zone: "North-Central",
    officialPortal: "https://benuestate.gov.ng",
    description: "Major agricultural grain and tuber producing state in the fertile Benue river basin.",
    geoCenter: [8.5304, 7.3369]
  },
  {
    code: "NG-BO",
    slug: "borno",
    name: "Borno State",
    shortName: "Borno",
    capital: "Maiduguri",
    zone: "North-East",
    officialPortal: "https://bornostate.gov.ng",
    description: "North-Eastern state benefiting from federal security stabilization, IDP resettlement, and border trade.",
    geoCenter: [13.151, 11.8333]
  },
  {
    code: "NG-CR",
    slug: "cross-river",
    name: "Cross River State",
    shortName: "Cross River",
    capital: "Calabar",
    zone: "South-South",
    officialPortal: "https://crossriverstate.gov.ng",
    description: "Eastern terminus of the 700km Lagos-Calabar Coastal Highway and major ecotourism destination.",
    geoCenter: [8.3307, 5.9631]
  },
  {
    code: "NG-DE",
    slug: "delta",
    name: "Delta State",
    shortName: "Delta",
    capital: "Asaba",
    zone: "South-South",
    officialPortal: "https://deltastate.gov.ng",
    description: "Coastal oil and gas producing state benefiting from maritime port revitalization and highway upgrades.",
    geoCenter: [6.1994, 5.704]
  },
  {
    code: "NG-EB",
    slug: "ebonyi",
    name: "Ebonyi State",
    shortName: "Ebonyi",
    capital: "Abakaliki",
    zone: "South-East",
    officialPortal: "https://ebonyistate.gov.ng",
    description: "Agricultural rice production and mineral mining center in the South-East region.",
    geoCenter: [8.0137, 6.2649]
  },
  {
    code: "NG-ED",
    slug: "edo",
    name: "Edo State",
    shortName: "Edo",
    capital: "Benin City",
    zone: "South-South",
    officialPortal: "https://edostate.gov.ng",
    description: "Historic cultural center and transport gateway linking South-Western and South-Eastern Nigeria.",
    geoCenter: [5.6234, 6.6342]
  },
  {
    code: "NG-EK",
    slug: "ekiti",
    name: "Ekiti State",
    shortName: "Ekiti",
    capital: "Ado-Ekiti",
    zone: "South-West",
    officialPortal: "https://ekitistate.gov.ng",
    description: "Inland South-Western state focused on education, agrarian development, and knowledge economy.",
    geoCenter: [5.2215, 7.6303]
  },
  {
    code: "NG-EN",
    slug: "enugu",
    name: "Enugu State",
    shortName: "Enugu",
    capital: "Enugu",
    zone: "South-East",
    officialPortal: "https://enugustate.gov.ng",
    description: "Regional administrative and commercial hub in South-Eastern Nigeria connected via major expressways.",
    geoCenter: [7.5086, 6.4584]
  },
  {
    code: "NG-FC",
    slug: "fct-abuja",
    name: "Federal Capital Territory (Abuja)",
    shortName: "FCT - Abuja",
    capital: "Abuja",
    zone: "North-Central",
    officialPortal: "https://fct.gov.ng",
    description: "Federal Capital Territory of Nigeria, seat of the Presidency, Federal Executive Council, and NELFUND headquarters.",
    geoCenter: [7.4951, 9.0579]
  },
  {
    code: "NG-GO",
    slug: "gombe",
    name: "Gombe State",
    shortName: "Gombe",
    capital: "Gombe",
    zone: "North-East",
    officialPortal: "https://gombestate.gov.ng",
    description: "Commercial crossroads of North-Eastern Nigeria with expanding agricultural processing capacity.",
    geoCenter: [11.1673, 10.2897]
  },
  {
    code: "NG-IM",
    slug: "imo",
    name: "Imo State",
    shortName: "Imo",
    capital: "Owerri",
    zone: "South-East",
    officialPortal: "https://imostate.gov.ng",
    description: "South-Eastern state with dense population centers, educational institutions, and oil and gas deposits.",
    geoCenter: [7.026, 5.4832]
  },
  {
    code: "NG-JI",
    slug: "jigawa",
    name: "Jigawa State",
    shortName: "Jigawa",
    capital: "Dutse",
    zone: "North-West",
    officialPortal: "https://jigawastate.gov.ng",
    description: "Key participant in the federal dry-season wheat farming program yielding record agricultural harvests.",
    geoCenter: [9.5616, 12.228]
  },
  {
    code: "NG-KD",
    slug: "kaduna",
    name: "Kaduna State",
    shortName: "Kaduna",
    capital: "Kaduna",
    zone: "North-West",
    officialPortal: "https://kadunastate.gov.ng",
    description: "Major industrial, educational, and transportation hub connecting Northern Nigeria to Abuja.",
    geoCenter: [7.4383, 10.5105]
  },
  {
    code: "NG-KN",
    slug: "kano",
    name: "Kano State",
    shortName: "Kano",
    capital: "Kano",
    zone: "North-West",
    officialPortal: "https://kanostate.gov.ng",
    description: "Largest commercial and industrial center in Northern Nigeria benefiting from transport and irrigation initiatives.",
    geoCenter: [8.5167, 12.0022]
  },
  {
    code: "NG-KT",
    slug: "katsina",
    name: "Katsina State",
    shortName: "Katsina",
    capital: "Katsina",
    zone: "North-West",
    officialPortal: "https://katsinastate.gov.ng",
    description: "Northern border state with extensive agricultural trade corridors and livestock markets.",
    geoCenter: [7.6008, 12.9855]
  },
  {
    code: "NG-KB",
    slug: "kebbi",
    name: "Kebbi State",
    shortName: "Kebbi",
    capital: "Birnin Kebbi",
    zone: "North-West",
    officialPortal: "https://kebbistate.gov.ng",
    description: "Major rice-producing state along the Niger River basin contributing to national food security.",
    geoCenter: [4.1975, 12.4539]
  },
  {
    code: "NG-KO",
    slug: "kogi",
    name: "Kogi State",
    shortName: "Kogi",
    capital: "Lokoja",
    zone: "North-Central",
    officialPortal: "https://kogistate.gov.ng",
    description: "Confluence state where the Niger and Benue Rivers meet, serving as a strategic transit bridge.",
    geoCenter: [6.7333, 7.8]
  },
  {
    code: "NG-KW",
    slug: "kwara",
    name: "Kwara State",
    shortName: "Kwara",
    capital: "Ilorin",
    zone: "North-Central",
    officialPortal: "https://kwarastate.gov.ng",
    description: "Gateway state bridging North-Central and South-Western Nigeria with expanding agro-allied industries.",
    geoCenter: [4.5418, 8.4966]
  },
  {
    code: "NG-LA",
    slug: "lagos",
    name: "Lagos State",
    shortName: "Lagos",
    capital: "Ikeja",
    zone: "South-West",
    officialPortal: "https://lagosstate.gov.ng",
    description: "Commercial capital of Nigeria, Western origin of the 700km Lagos-Calabar Highway, and principal financial hub.",
    geoCenter: [3.3792, 6.5244]
  },
  {
    code: "NG-NA",
    slug: "nasarawa",
    name: "Nasarawa State",
    shortName: "Nasarawa",
    capital: "Lafia",
    zone: "North-Central",
    officialPortal: "https://nasarawastate.gov.ng",
    description: "Mineral-rich state bordering the Federal Capital Territory with high agricultural and solid mineral output.",
    geoCenter: [8.5167, 8.4833]
  },
  {
    code: "NG-NI",
    slug: "niger",
    name: "Niger State",
    shortName: "Niger",
    capital: "Minna",
    zone: "North-Central",
    officialPortal: "https://nigerstate.gov.ng",
    description: "Largest state by land mass, home to the 700MW Zungeru Hydroelectric Power Plant and Shiroro dam.",
    geoCenter: [6.5414, 9.9309]
  },
  {
    code: "NG-OG",
    slug: "ogun",
    name: "Ogun State",
    shortName: "Ogun",
    capital: "Abeokuta",
    zone: "South-West",
    officialPortal: "https://ogunstate.gov.ng",
    description: "Leading industrial manufacturing corridor in South-Western Nigeria bordering Lagos and Republic of Benin.",
    geoCenter: [3.35, 7.1608]
  },
  {
    code: "NG-ON",
    slug: "ondo",
    name: "Ondo State",
    shortName: "Ondo",
    capital: "Akure",
    zone: "South-West",
    officialPortal: "https://ondostate.gov.ng",
    description: "Coastal state with cocoa agriculture, deep sea port potential, and mineral resources.",
    geoCenter: [5.1979, 7.25]
  },
  {
    code: "NG-OS",
    slug: "osun",
    name: "Osun State",
    shortName: "Osun",
    capital: "Osogbo",
    zone: "South-West",
    officialPortal: "https://osunstate.gov.ng",
    description: "Inland South-Western state rich in cultural heritage, agriculture, and mining reserves.",
    geoCenter: [4.5624, 7.5629]
  },
  {
    code: "NG-OY",
    slug: "oyo",
    name: "Oyo State",
    shortName: "Oyo",
    capital: "Ibadan",
    zone: "South-West",
    officialPortal: "https://oyostate.gov.ng",
    description: "Historic educational and agricultural center in South-Western Nigeria connected via the Lagos-Ibadan rail.",
    geoCenter: [3.9368, 7.843]
  },
  {
    code: "NG-PL",
    slug: "plateau",
    name: "Plateau State",
    shortName: "Plateau",
    capital: "Jos",
    zone: "North-Central",
    officialPortal: "https://plateaustate.gov.ng",
    description: "Highland agricultural state known for temperate crop farming, tourism, and mineral deposits.",
    geoCenter: [8.8921, 9.2182]
  },
  {
    code: "NG-RI",
    slug: "rivers",
    name: "Rivers State",
    shortName: "Rivers",
    capital: "Port Harcourt",
    zone: "South-South",
    officialPortal: "https://riversstate.gov.ng",
    description: "Major industrial oil hub and maritime seaport in the Niger Delta region.",
    geoCenter: [7.0086, 4.8396]
  },
  {
    code: "NG-SO",
    slug: "sokoto",
    name: "Sokoto State",
    shortName: "Sokoto",
    capital: "Sokoto",
    zone: "North-West",
    officialPortal: "https://sokotostate.gov.ng",
    description: "Historic cultural seat in North-Western Nigeria with expanding cement production and agriculture.",
    geoCenter: [5.2476, 13.0627]
  },
  {
    code: "NG-TA",
    slug: "taraba",
    name: "Taraba State",
    shortName: "Taraba",
    capital: "Jalingo",
    zone: "North-East",
    officialPortal: "https://tarabastate.gov.ng",
    description: "Agrarian state in North-Eastern Nigeria featuring the Mambilla plateau and timber forestry.",
    geoCenter: [11.3697, 7.8702]
  },
  {
    code: "NG-YO",
    slug: "yobe",
    name: "Yobe State",
    shortName: "Yobe",
    capital: "Damaturu",
    zone: "North-East",
    officialPortal: "https://yobestate.gov.ng",
    description: "North-Eastern border state engaged in federal security stabilization and livestock agriculture.",
    geoCenter: [11.966, 12.2939]
  },
  {
    code: "NG-ZA",
    slug: "zamfara",
    name: "Zamfara State",
    shortName: "Zamfara",
    capital: "Gusau",
    zone: "North-West",
    officialPortal: "https://zamfarastate.gov.ng",
    description: "North-Western agricultural and mineral state benefiting from joint tactical security operations.",
    geoCenter: [6.6636, 12.1702]
  }
];
