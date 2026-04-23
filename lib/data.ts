export type Project = {
  id: number;
  title: string;
  objective: string;
  components: string[];
  programs: ("15-Hour" | "30-Hour")[];
  iconType: "Cpu" | "Wifi" | "Bot" | "Eye" | "Lock" | "Lightbulb" | "Droplet" | "Activity";
};

export const projectsData: Project[] = [
  {
    id: 1,
    title: "Theft Detection System",
    objective: "Detect unauthorized access using IR sensors.",
    components: ["IR Sensor", "Arduino", "Buzzer"],
    programs: ["15-Hour", "30-Hour"],
    iconType: "Lock"
  },
  {
    id: 2,
    title: "Traffic Signal System",
    objective: "Simulate basic traffic signal using LEDs.",
    components: ["LEDs", "Arduino"],
    programs: ["15-Hour", "30-Hour"],
    iconType: "Lightbulb"
  },
  {
    id: 3,
    title: "Smart Traffic Light System",
    objective: "Automate traffic control.",
    components: ["IR sensors", "Arduino"],
    programs: ["15-Hour", "30-Hour"],
    iconType: "Activity"
  },
  {
    id: 4,
    title: "Smart Street Light System",
    objective: "Automatically control street lights.",
    components: ["LDR Sensor", "Arduino"],
    programs: ["15-Hour", "30-Hour"],
    iconType: "Lightbulb"
  },
  {
    id: 5,
    title: "Smart Car Reverse Parking",
    objective: "Assist vehicles by detecting obstacles.",
    components: ["Ultrasonic Sensor", "Buzzer"],
    programs: ["15-Hour", "30-Hour"],
    iconType: "Cpu"
  },
  {
    id: 6,
    title: "Obstacle Avoiding Robot",
    objective: "Autonomous robot that avoids obstacles.",
    components: ["Motor Driver", "DC Motors", "Ultrasonic Sensor"],
    programs: ["15-Hour", "30-Hour"],
    iconType: "Bot"
  },
  {
    id: 7,
    title: "Line Follower Robot",
    objective: "Robot that follows a predefined path.",
    components: ["IR Sensors", "Motor Driver"],
    programs: ["15-Hour", "30-Hour"],
    iconType: "Bot"
  },
  {
    id: 8,
    title: "Radar System",
    objective: "Simulate radar detection.",
    components: ["Ultrasonic Sensor", "Servo Motor"],
    programs: ["30-Hour"],
    iconType: "Activity"
  },
  {
    id: 9,
    title: "Light Follower Robot",
    objective: "Robot that follows light.",
    components: ["LDR Sensors", "Motor Driver"],
    programs: ["30-Hour"],
    iconType: "Bot"
  },
  {
    id: 10,
    title: "Smart Door Lock System",
    objective: "Automate door access.",
    components: ["RFID Sensor", "Servo Motor"],
    programs: ["30-Hour"],
    iconType: "Lock"
  },
  {
    id: 11,
    title: "Smart Dustbin",
    objective: "Automatic dustbin that opens when approached.",
    components: ["Ultrasonic Sensor", "Servo Motor"],
    programs: ["30-Hour"],
    iconType: "Cpu"
  },
  {
    id: 12,
    title: "Smart Stick for Blind People",
    objective: "Detect obstacles and avoid collisions.",
    components: ["Ultrasonic Sensor", "Buzzer"],
    programs: ["30-Hour"],
    iconType: "Eye"
  },
  {
    id: 13,
    title: "Smart Irrigation System",
    objective: "Automate watering of plants.",
    components: ["Soil Moisture Sensor", "Water Pump"],
    programs: ["30-Hour"],
    iconType: "Droplet"
  },
  {
    id: 14,
    title: "Medical Robot",
    objective: "Assist in hospitals for medicine delivery.",
    components: ["Ultrasonic Sensors", "DC Motors"],
    programs: ["30-Hour"],
    iconType: "Bot"
  },
  {
    id: 15,
    title: "IoT-Based Home Automation",
    objective: "Control appliances via internet.",
    components: ["NodeMCU", "Relays", "Blynk/MQTT"],
    programs: ["30-Hour"],
    iconType: "Wifi"
  }
];
