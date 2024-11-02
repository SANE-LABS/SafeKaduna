import React, { useState, useEffect } from "react";
import { StyleSheet, View, Alert } from "react-native";
import MapView, { Polygon, Region } from "react-native-maps";
import * as Location from "expo-location";

type SafetyStatus =
  | "very_safe"
  | "safe"
  | "moderate"
  | "caution"
  | "unsafe"
  | "high_risk"
  | "critical"
  | "unknown";

interface CrimeData {
  recentIncidents?: Array<{
    type: string;
    frequency: number;
    timePattern?: string;
  }>;
  historicalLevel: "low" | "moderate" | "high" | "severe";
  patrolInfo?: string;
  emergencyServices?: string;
}

interface SafetyDetails {
  status: SafetyStatus;
  description: string;
  lastUpdated: string;
  timeSpecificWarning?: string;
  crimeData: CrimeData;
}

interface SubRegion {
  id: number;
  coordinates: Array<{
    latitude: number;
    longitude: number;
  }>;
  safety: SafetyDetails;
  name: string;
  type:
    | "street"
    | "intersection"
    | "area"
    | "landmark"
    | "residential"
    | "commercial";
}

const safetyRegions: SubRegion[] = [
  {
    id: 1,
    name: "Kaduna Central Market",
    type: "commercial",
    coordinates: [
      { latitude: 10.5162, longitude: 7.4386 },
      { latitude: 10.5165, longitude: 7.439 },
      { latitude: 10.516, longitude: 7.4395 },
      { latitude: 10.5157, longitude: 7.439 },
    ],
    safety: {
      status: "caution",
      description: "Busy market area with reported pickpocketing",
      lastUpdated: "2024-11-02",
      timeSpecificWarning: "High risk during market hours (8:00-18:00)",
      crimeData: {
        recentIncidents: [
          { type: "pickpocketing", frequency: 15, timePattern: "Market hours" },
          { type: "scams", frequency: 5, timePattern: "Daily" },
        ],
        historicalLevel: "high",
        patrolInfo: "Plainclothes officers present during peak hours",
        emergencyServices: "Mobile police unit stationed during market hours",
      },
    },
  },
  {
    id: 2,
    name: "City Center",
    type: "area",
    coordinates: [
      { latitude: 10.5175, longitude: 7.446 },
      { latitude: 10.517, longitude: 7.4465 },
      { latitude: 10.5165, longitude: 7.446 },
      { latitude: 10.517, longitude: 7.4455 },
    ],
    safety: {
      status: "moderate",
      description: "Commercial district with moderate foot traffic",
      lastUpdated: "2024-11-02",
      timeSpecificWarning: "Be cautious during late-night hours",
      crimeData: {
        recentIncidents: [
          { type: "theft", frequency: 8, timePattern: "Evening" },
          { type: "harassment", frequency: 4, timePattern: "Night" },
        ],
        historicalLevel: "moderate",
        patrolInfo: "Regular police patrols",
        emergencyServices: "Police station nearby",
      },
    },
  },
  {
    id: 3,
    name: "Gwari Avenue",
    type: "street",
    coordinates: [
      { latitude: 10.518, longitude: 7.439 },
      { latitude: 10.5183, longitude: 7.4393 },
      { latitude: 10.5181, longitude: 7.4395 },
      { latitude: 10.5178, longitude: 7.4392 },
    ],
    safety: {
      status: "safe",
      description: "Well-lit street with good security presence",
      lastUpdated: "2024-11-02",
      crimeData: {
        recentIncidents: [
          { type: "minor theft", frequency: 2, timePattern: "Late night" },
        ],
        historicalLevel: "low",
        patrolInfo: "Regular patrols by neighborhood watch",
        emergencyServices: "Emergency response available nearby",
      },
    },
  },
  {
    id: 4,
    name: "Kawo Community",
    type: "residential",
    coordinates: [
      { latitude: 10.5222, longitude: 7.426 },
      { latitude: 10.5225, longitude: 7.4265 },
      { latitude: 10.522, longitude: 7.427 },
      { latitude: 10.5215, longitude: 7.4265 },
    ],
    safety: {
      status: "safe",
      description: "Residential area with low crime rates",
      lastUpdated: "2024-11-02",
      crimeData: {
        recentIncidents: [],
        historicalLevel: "low",
        patrolInfo: "Community patrols during evenings",
        emergencyServices: "Local security present",
      },
    },
  },
  {
    id: 5,
    name: "Barnawa",
    type: "residential",
    coordinates: [
      { latitude: 10.5145, longitude: 7.4397 },
      { latitude: 10.5148, longitude: 7.44 },
      { latitude: 10.5143, longitude: 7.4405 },
      { latitude: 10.5138, longitude: 7.4402 },
    ],
    safety: {
      status: "moderate",
      description: "A mixed residential area with some crime reports",
      lastUpdated: "2024-11-02",
      timeSpecificWarning: "Be cautious during late hours",
      crimeData: {
        recentIncidents: [
          { type: "burglary", frequency: 5, timePattern: "Night" },
        ],
        historicalLevel: "moderate",
        patrolInfo: "Infrequent police presence",
        emergencyServices: "Emergency services are a bit far",
      },
    },
  },
  {
    id: 6,
    name: "Kaduna Polytechnic",
    type: "residential",
    coordinates: [
      { latitude: 10.5228, longitude: 7.4391 },
      { latitude: 10.5231, longitude: 7.4393 },
      { latitude: 10.5225, longitude: 7.4395 },
      { latitude: 10.5222, longitude: 7.4393 },
    ],
    safety: {
      status: "safe",
      description: "Campus area with a strong security presence",
      lastUpdated: "2024-11-02",
      crimeData: {
        recentIncidents: [
          { type: "minor theft", frequency: 1, timePattern: "Late night" },
        ],
        historicalLevel: "low",
        patrolInfo: "24/7 security patrols",
        emergencyServices: "Security office on campus",
      },
    },
  },
  {
    id: 7,
    name: "Nigerian Railway",
    type: "landmark",
    coordinates: [
      { latitude: 10.5112, longitude: 7.4401 },
      { latitude: 10.5115, longitude: 7.4403 },
      { latitude: 10.511, longitude: 7.4405 },
      { latitude: 10.5107, longitude: 7.4402 },
    ],
    safety: {
      status: "caution",
      description: "Area around the railway station",
      lastUpdated: "2024-11-02",
      timeSpecificWarning: "Be careful during peak travel hours",
      crimeData: {
        recentIncidents: [
          { type: "theft", frequency: 6, timePattern: "Travel hours" },
        ],
        historicalLevel: "moderate",
        patrolInfo: "Railway police present during peak hours",
        emergencyServices: "Emergency contacts available at the station",
      },
    },
  },
  {
    id: 8,
    name: "Sabon Tasha",
    type: "commercial",
    coordinates: [
      { latitude: 10.5178, longitude: 7.4394 },
      { latitude: 10.5181, longitude: 7.4396 },
      { latitude: 10.5176, longitude: 7.4398 },
      { latitude: 10.5173, longitude: 7.4395 },
    ],
    safety: {
      status: "moderate",
      description: "Busy commercial area with moderate crime",
      lastUpdated: "2024-11-02",
      timeSpecificWarning: "Higher risk during market days",
      crimeData: {
        recentIncidents: [
          { type: "snatch theft", frequency: 3, timePattern: "Market days" },
        ],
        historicalLevel: "high",
        patrolInfo: "Security personnel during busy hours",
        emergencyServices: "Emergency services available",
      },
    },
  },
  {
    id: 9,
    name: "New Busa",
    type: "residential",
    coordinates: [
      { latitude: 10.5193, longitude: 7.4371 },
      { latitude: 10.5195, longitude: 7.4373 },
      { latitude: 10.519, longitude: 7.4375 },
      { latitude: 10.5188, longitude: 7.4372 },
    ],
    safety: {
      status: "safe",
      description: "Quiet neighborhood with low crime rates",
      lastUpdated: "2024-11-02",
      crimeData: {
        recentIncidents: [],
        historicalLevel: "low",
        patrolInfo: "Community watch in the area",
        emergencyServices: "Local clinic available",
      },
    },
  },
  {
    id: 10,
    name: "Angwan Rimi",
    type: "residential",
    coordinates: [
      { latitude: 10.521, longitude: 7.431 },
      { latitude: 10.5215, longitude: 7.4312 },
      { latitude: 10.5212, longitude: 7.4314 },
      { latitude: 10.5208, longitude: 7.4311 },
    ],
    safety: {
      status: "safe",
      description: "Family-friendly area with active community",
      lastUpdated: "2024-11-02",
      crimeData: {
        recentIncidents: [],
        historicalLevel: "low",
        patrolInfo: "Regular neighborhood patrols",
        emergencyServices: "Local police responsive to calls",
      },
    },
  },
  {
    id: 11,
    name: "GRA Area",
    type: "residential",
    coordinates: [
      { latitude: 10.525, longitude: 7.427 },
      { latitude: 10.5253, longitude: 7.4272 },
      { latitude: 10.5251, longitude: 7.4275 },
      { latitude: 10.5248, longitude: 7.4273 },
    ],
    safety: {
      status: "very_safe",
      description: "High-end residential area with low crime",
      lastUpdated: "2024-11-02",
      crimeData: {
        recentIncidents: [],
        historicalLevel: "low",
        patrolInfo: "Private security and regular patrols",
        emergencyServices: "Ambulance services nearby",
      },
    },
  },
  {
    id: 12,
    name: "Kagoro",
    type: "residential",
    coordinates: [
      { latitude: 10.5182, longitude: 7.4335 },
      { latitude: 10.5185, longitude: 7.4338 },
      { latitude: 10.518, longitude: 7.434 },
      { latitude: 10.5177, longitude: 7.4337 },
    ],
    safety: {
      status: "safe",
      description: "Residential area with good community engagement",
      lastUpdated: "2024-11-02",
      crimeData: {
        recentIncidents: [],
        historicalLevel: "low",
        patrolInfo: "Community patrols in the evenings",
        emergencyServices: "Health center available",
      },
    },
  },
  {
    id: 13,
    name: "Malali",
    type: "residential",
    coordinates: [
      { latitude: 10.5111, longitude: 7.4239 },
      { latitude: 10.5114, longitude: 7.4241 },
      { latitude: 10.511, longitude: 7.4243 },
      { latitude: 10.5107, longitude: 7.424 },
    ],
    safety: {
      status: "safe",
      description: "Peaceful area with a friendly community",
      lastUpdated: "2024-11-02",
      crimeData: {
        recentIncidents: [],
        historicalLevel: "low",
        patrolInfo: "Community watch in operation",
        emergencyServices: "Local clinic nearby",
      },
    },
  },
  {
    id: 14,
    name: "Rido",
    type: "residential",
    coordinates: [
      { latitude: 10.5063, longitude: 7.4255 },
      { latitude: 10.5066, longitude: 7.4257 },
      { latitude: 10.5061, longitude: 7.4259 },
      { latitude: 10.5058, longitude: 7.4256 },
    ],
    safety: {
      status: "moderate",
      description: "Increasing crime reports, particularly petty theft",
      lastUpdated: "2024-11-02",
      timeSpecificWarning: "Stay alert in evenings",
      crimeData: {
        recentIncidents: [
          { type: "theft", frequency: 4, timePattern: "Night" },
        ],
        historicalLevel: "moderate",
        patrolInfo: "Infrequent police presence",
        emergencyServices: "Emergency services can take time",
      },
    },
  },
  {
    id: 15,
    name: "Gwari",
    type: "residential",
    coordinates: [
      { latitude: 10.5256, longitude: 7.4385 },
      { latitude: 10.5259, longitude: 7.4387 },
      { latitude: 10.5254, longitude: 7.4389 },
      { latitude: 10.5251, longitude: 7.4386 },
    ],
    safety: {
      status: "moderate",
      description: "Regularly reported minor thefts",
      lastUpdated: "2024-11-02",
      timeSpecificWarning: "Be cautious during night",
      crimeData: {
        recentIncidents: [
          { type: "theft", frequency: 3, timePattern: "Night" },
        ],
        historicalLevel: "moderate",
        patrolInfo: "Occasional police patrols",
        emergencyServices: "Nearby police station",
      },
    },
  },
  {
    id: 16,
    name: "Tudun Wada",
    type: "residential",
    coordinates: [
      { latitude: 10.5132, longitude: 7.4368 },
      { latitude: 10.5135, longitude: 7.437 },
      { latitude: 10.513, longitude: 7.4372 },
      { latitude: 10.5127, longitude: 7.4369 },
    ],
    safety: {
      status: "safe",
      description: "Well-known for community engagement",
      lastUpdated: "2024-11-02",
      crimeData: {
        recentIncidents: [],
        historicalLevel: "low",
        patrolInfo: "Regular neighborhood patrols",
        emergencyServices: "Local clinic nearby",
      },
    },
  },
  {
    id: 17,
    name: "Sabo",
    type: "commercial",
    coordinates: [
      { latitude: 10.5092, longitude: 7.431 },
      { latitude: 10.5095, longitude: 7.4313 },
      { latitude: 10.509, longitude: 7.4315 },
      { latitude: 10.5087, longitude: 7.4312 },
    ],
    safety: {
      status: "moderate",
      description: "Mixed-use area with frequent pedestrian traffic",
      lastUpdated: "2024-11-02",
      timeSpecificWarning: "Be cautious in crowds",
      crimeData: {
        recentIncidents: [
          { type: "pickpocketing", frequency: 4, timePattern: "Busy hours" },
        ],
        historicalLevel: "moderate",
        patrolInfo: "Occasional security presence",
        emergencyServices: "Emergency contacts available",
      },
    },
  },
  {
    id: 18,
    name: "Kaduna South",
    type: "residential",
    coordinates: [
      { latitude: 10.5034, longitude: 7.4298 },
      { latitude: 10.5037, longitude: 7.43 },
      { latitude: 10.5032, longitude: 7.4302 },
      { latitude: 10.5029, longitude: 7.4299 },
    ],
    safety: {
      status: "moderate",
      description: "Moderate crime rates with occasional disturbances",
      lastUpdated: "2024-11-02",
      timeSpecificWarning: "Avoid deserted areas at night",
      crimeData: {
        recentIncidents: [
          { type: "burglary", frequency: 3, timePattern: "Night" },
        ],
        historicalLevel: "moderate",
        patrolInfo: "Infrequent police presence",
        emergencyServices: "Emergency services can take time",
      },
    },
  },
  {
    id: 19,
    name: "Doka",
    type: "residential",
    coordinates: [
      { latitude: 10.5074, longitude: 7.426 },
      { latitude: 10.5077, longitude: 7.4262 },
      { latitude: 10.5072, longitude: 7.4264 },
      { latitude: 10.5069, longitude: 7.4261 },
    ],
    safety: {
      status: "moderate",
      description: "Busy area with regular crime reports",
      lastUpdated: "2024-11-02",
      timeSpecificWarning: "Stay aware of surroundings",
      crimeData: {
        recentIncidents: [
          { type: "theft", frequency: 2, timePattern: "Evening" },
        ],
        historicalLevel: "moderate",
        patrolInfo: "Occasional police presence",
        emergencyServices: "Emergency services can take time",
      },
    },
  },
  {
    id: 20,
    name: "Panteka",
    type: "commercial",
    coordinates: [
      { latitude: 10.5163, longitude: 7.4265 },
      { latitude: 10.5166, longitude: 7.4267 },
      { latitude: 10.5161, longitude: 7.4269 },
      { latitude: 10.5158, longitude: 7.4266 },
    ],
    safety: {
      status: "moderate",
      description: "Commercial area with mixed activities",
      lastUpdated: "2024-11-02",
      timeSpecificWarning: "Be cautious in busy periods",
      crimeData: {
        recentIncidents: [
          { type: "theft", frequency: 3, timePattern: "Busy hours" },
        ],
        historicalLevel: "moderate",
        patrolInfo: "Infrequent security presence",
        emergencyServices: "Emergency contacts available",
      },
    },
  },
  {
    id: 21,
    name: "Samaru",
    type: "commercial",
    coordinates: [
      { latitude: 10.5039, longitude: 7.4286 },
      { latitude: 10.5042, longitude: 7.4288 },
      { latitude: 10.5037, longitude: 7.429 },
      { latitude: 10.5034, longitude: 7.4287 },
    ],
    safety: {
      status: "moderate",
      description: "Busy commercial area with high foot traffic",
      lastUpdated: "2024-11-02",
      timeSpecificWarning: "Be cautious in crowds",
      crimeData: {
        recentIncidents: [
          { type: "pickpocketing", frequency: 5, timePattern: "Busy hours" },
        ],
        historicalLevel: "moderate",
        patrolInfo: "Security personnel present during busy times",
        emergencyServices: "Emergency contacts available",
      },
    },
  },
  {
    id: 22,
    name: "Gidan Dabo",
    type: "commercial",
    coordinates: [
      { latitude: 10.505, longitude: 7.4245 },
      { latitude: 10.5053, longitude: 7.4247 },
      { latitude: 10.5048, longitude: 7.4249 },
      { latitude: 10.5045, longitude: 7.4246 },
    ],
    safety: {
      status: "moderate",
      description: "Commercial area with occasional disturbances",
      lastUpdated: "2024-11-02",
      timeSpecificWarning: "Avoid isolated areas at night",
      crimeData: {
        recentIncidents: [
          { type: "theft", frequency: 3, timePattern: "Night" },
        ],
        historicalLevel: "moderate",
        patrolInfo: "Infrequent police presence",
        emergencyServices: "Emergency services can take time",
      },
    },
  },
  {
    id: 23,
    name: "Gwari Market",
    type: "commercial",
    coordinates: [
      { latitude: 10.5098, longitude: 7.4322 },
      { latitude: 10.5101, longitude: 7.4324 },
      { latitude: 10.5096, longitude: 7.4326 },
      { latitude: 10.5093, longitude: 7.4323 },
    ],
    safety: {
      status: "moderate",
      description: "Busy market area with high foot traffic",
      lastUpdated: "2024-11-02",
      timeSpecificWarning: "Be cautious in crowds",
      crimeData: {
        recentIncidents: [
          { type: "pickpocketing", frequency: 6, timePattern: "Market hours" },
        ],
        historicalLevel: "moderate",
        patrolInfo: "Security presence during peak hours",
        emergencyServices: "Emergency contacts available",
      },
    },
  },
  {
    id: 24,
    name: "Kawo",
    type: "commercial",
    coordinates: [
      { latitude: 10.5148, longitude: 7.427 },
      { latitude: 10.5151, longitude: 7.4272 },
      { latitude: 10.5146, longitude: 7.4274 },
      { latitude: 10.5143, longitude: 7.4271 },
    ],
    safety: {
      status: "moderate",
      description: "Commercial area with active business operations",
      lastUpdated: "2024-11-02",
      timeSpecificWarning: "Stay alert during busy hours",
      crimeData: {
        recentIncidents: [
          { type: "theft", frequency: 2, timePattern: "Evening" },
        ],
        historicalLevel: "moderate",
        patrolInfo: "Security personnel present at peak times",
        emergencyServices: "Emergency contacts available",
      },
    },
  },
  {
    id: 25,
    name: "Barnawa",
    type: "residential",
    coordinates: [
      { latitude: 10.5055, longitude: 7.4332 },
      { latitude: 10.5058, longitude: 7.4334 },
      { latitude: 10.5053, longitude: 7.4336 },
      { latitude: 10.505, longitude: 7.4333 },
    ],
    safety: {
      status: "safe",
      description: "Quiet and peaceful area with good community",
      lastUpdated: "2024-11-02",
      crimeData: {
        recentIncidents: [],
        historicalLevel: "low",
        patrolInfo: "Community patrols in place",
        emergencyServices: "Local clinic available",
      },
    },
  },
  {
    id: 26,
    name: "Dandume",
    type: "residential",
    coordinates: [
      { latitude: 10.514, longitude: 7.4245 },
      { latitude: 10.5143, longitude: 7.4247 },
      { latitude: 10.5138, longitude: 7.4249 },
      { latitude: 10.5135, longitude: 7.4246 },
    ],
    safety: {
      status: "safe",
      description: "Residential area with low crime rate",
      lastUpdated: "2024-11-02",
      crimeData: {
        recentIncidents: [],
        historicalLevel: "low",
        patrolInfo: "Regular community watch",
        emergencyServices: "Health center available",
      },
    },
  },
  {
    id: 27,
    name: "Rigachikun",
    type: "residential",
    coordinates: [
      { latitude: 10.525, longitude: 7.442 },
      { latitude: 10.5253, longitude: 7.4422 },
      { latitude: 10.5248, longitude: 7.4424 },
      { latitude: 10.5245, longitude: 7.4421 },
    ],
    safety: {
      status: "safe",
      description: "Family-oriented neighborhood with community support",
      lastUpdated: "2024-11-02",
      crimeData: {
        recentIncidents: [],
        historicalLevel: "low",
        patrolInfo: "Community patrols during evenings",
        emergencyServices: "Local police responsive to calls",
      },
    },
  },
  {
    id: 28,
    name: "Sabon Tasha",
    type: "residential",
    coordinates: [
      { latitude: 10.516, longitude: 7.429 },
      { latitude: 10.5163, longitude: 7.4292 },
      { latitude: 10.5158, longitude: 7.4294 },
      { latitude: 10.5155, longitude: 7.4291 },
    ],
    safety: {
      status: "safe",
      description: "Quiet residential area with good amenities",
      lastUpdated: "2024-11-02",
      crimeData: {
        recentIncidents: [],
        historicalLevel: "low",
        patrolInfo: "Regular neighborhood patrols",
        emergencyServices: "Local clinic nearby",
      },
    },
  },
  {
    id: 29,
    name: "Kaduna North",
    type: "residential",
    coordinates: [
      { latitude: 10.5215, longitude: 7.4265 },
      { latitude: 10.5218, longitude: 7.4267 },
      { latitude: 10.5213, longitude: 7.4269 },
      { latitude: 10.521, longitude: 7.4266 },
    ],
    safety: {
      status: "safe",
      description: "Residential area with good security measures",
      lastUpdated: "2024-11-02",
      crimeData: {
        recentIncidents: [],
        historicalLevel: "low",
        patrolInfo: "Regular police patrols",
        emergencyServices: "Nearby health services available",
      },
    },
  },
  {
    id: 30,
    name: "Chikun",
    type: "residential",
    coordinates: [
      { latitude: 10.513, longitude: 7.43 },
      { latitude: 10.5133, longitude: 7.4302 },
      { latitude: 10.5128, longitude: 7.4304 },
      { latitude: 10.5125, longitude: 7.4301 },
    ],
    safety: {
      status: "safe",
      description: "Community-driven neighborhood with strong ties",
      lastUpdated: "2024-11-02",
      crimeData: {
        recentIncidents: [],
        historicalLevel: "low",
        patrolInfo: "Community watch groups active",
        emergencyServices: "Health center accessible",
      },
    },
  },
];

// Add 15 more regions here with similar detailed crime data...

interface UserLocation {
  latitude: number;
  longitude: number;
}

export default function App() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    })();
  }, []);

const initialRegion: Region = {
  latitude: 10.5222, 
  longitude: 7.4383, 
  latitudeDelta: 0.05, 
  longitudeDelta: 0.05, 
};

  const getPolygonFillColor = (status: SafetyStatus) => {
    switch (status) {
      case "very_safe":
        return "rgba(0, 255, 0, 0.3)";
      case "safe":
        return "rgba(144, 238, 144, 0.3)";
      case "moderate":
        return "rgba(255, 255, 0, 0.3)";
      case "caution":
        return "rgba(255, 165, 0, 0.3)";
      case "unsafe":
        return "rgba(255, 69, 0, 0.3)";
      case "high_risk":
        return "rgba(255, 0, 0, 0.3)";
      case "critical":
        return "rgba(139, 0, 0, 0.4)";
      case "unknown":
      default:
        return "rgba(128, 128, 128, 0.3)";
    }
  };

  const getPolygonStrokeColor = (status: SafetyStatus) => {
    switch (status) {
      case "very_safe":
        return "#006400";
      case "safe":
        return "#228B22";
      case "moderate":
        return "#DAA520";
      case "caution":
        return "#FF8C00";
      case "unsafe":
        return "#FF4500";
      case "high_risk":
        return "#8B0000";
      case "critical":
        return "#4B0082";
      case "unknown":
      default:
        return "#404040";
    }
  };

  const formatCrimeData = (crimeData: CrimeData): string => {
    let message = "\nRecent Incidents:\n";
    crimeData.recentIncidents?.forEach((incident) => {
      message += `- ${incident.type}: ${incident.frequency} cases`;
      if (incident.timePattern) {
        message += ` (${incident.timePattern})`;
      }
      message += "\n";
    });
    message += `\nHistorical Crime Level: ${crimeData.historicalLevel}`;
    if (crimeData.patrolInfo) {
      message += `\nPatrol Info: ${crimeData.patrolInfo}`;
    }
    if (crimeData.emergencyServices) {
      message += `\nEmergency Services: ${crimeData.emergencyServices}`;
    }
    return message;
  };

  const handleRegionPress = (region: SubRegion) => {
    const message =
      `Status: ${region.safety.status.replace("_", " ")}\n` +
      `${region.safety.description}\n` +
      (region.safety.timeSpecificWarning
        ? `\nWarning: ${region.safety.timeSpecificWarning}\n`
        : "") +
      formatCrimeData(region.safety.crimeData);

    Alert.alert(`${region.name} (${region.type})`, message, [{ text: "OK" }]);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        mapType="standard"
        showsBuildings={true}
        showsTraffic={true}
      >
        {safetyRegions.map((region) => (
          <Polygon
            key={region.id}
            coordinates={region.coordinates}
            fillColor={getPolygonFillColor(region.safety.status)}
            strokeColor={getPolygonStrokeColor(region.safety.status)}
            strokeWidth={2}
            tappable={true}
            onPress={() => handleRegionPress(region)}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
