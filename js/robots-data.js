/**
 * FUTURE ROBOTIX — Robot Data (embedded JS)
 * ─────────────────────────────────────────
 * Real, authentic specifications, capabilities and commercial configurations
 * for all 12 FUTURE ROBOTIX models.
 * 
 * Loaded directly into window.ROBOTS_DATA to eliminate file:// fetch restrictions
 * and ensure lightning-fast, zero-hanging page loads.
 */

window.ROBOTS_DATA = {
  currency: "INR",
  robots: [
    {
      id: "humanoid-essential",
      slug: "humanoid-essential",
      family: "humanoid",
      name: "Humanoid Essential",
      tagline: "Autonomous greeting and reception humanoid with 22 DOF and intelligent guidance.",
      description: "Humanoid Essential is engineered for corporate headquarters, customer experience centers, and institutional receptions across India. It navigates indoor spaces smoothly, greets visitors in multiple Indian languages, handles visitor check-in, and escorts guests directly to conference rooms.",
      specs: [
        "Dimensions: 148 cm (H) × 52 cm (W) · Weight: 38 kg",
        "Battery: 8 Hours Continuous Run · Swappable LiFePO4 · Auto-docking",
        "Kinematics: 22 Degrees of Freedom · Stereo Vision · Ultrasonic Avoidance"
      ],
      images: ["humanoid-essential.svg"],
      operations: [
        {
          id: "he-op-1",
          label: "Automated Visitor Check-In & Badge Dispensing",
          description: "Scans meeting QR codes, validates identity, and sends instant SMS/Slack alerts to hosts.",
          priceAdd: 45000,
          unit: "one-time"
        },
        {
          id: "he-op-2",
          label: "Autonomous Meeting Escort & Room Navigation",
          description: "Generates 2D/3D facility maps and safely guides guests to assigned conference suites.",
          priceAdd: 60000,
          unit: "one-time"
        },
        {
          id: "he-op-3",
          label: "Multilingual Indian Speech Engine",
          description: "Conversational voice recognition in Hindi, English, Tamil, Telugu, and Marathi.",
          priceAdd: 35000,
          unit: "one-time"
        }
      ],
      modes: {
        buy: { basePrice: 485000 },
        build: { kitPrice: 340000, mentorDayRate: 18000, perStudentMaterial: 4500, minStudents: 20 }
      }
    },
    {
      id: "humanoid-interactive",
      slug: "humanoid-interactive",
      family: "humanoid",
      name: "Humanoid Interactive",
      tagline: "Engaging conversational humanoid with integrated 10.1\" chest tablet & expressive gestural arms.",
      description: "Humanoid Interactive combines expressive arm gestures with a vibrant capacitive chest tablet for interactive campus tours, museum curation, and high-footfall retail showrooms. Visitors interact via natural voice dialogue or touch-driven catalog exploration.",
      specs: [
        "Dimensions: 154 cm (H) × 56 cm (W) · Weight: 42 kg",
        "Battery: 9 Hours Run · Smart BMS · Fast Charge to 80% in 90 min",
        "Kinematics: 28 Degrees of Freedom · Chest Tablet · 3D Depth LiDAR"
      ],
      images: ["humanoid-interactive.svg"],
      operations: [
        {
          id: "hi-op-1",
          label: "Interactive Campus & Product Presentation Suite",
          description: "Presents multimedia videos, campus maps, and product catalogs synchronized with gestural speech.",
          priceAdd: 55000,
          unit: "one-time"
        },
        {
          id: "hi-op-2",
          label: "Facial Recognition & VIP Personalization",
          description: "Recognizes returning faculty, VIP delegates, or registered employees with personalized greetings.",
          priceAdd: 48000,
          unit: "one-time"
        },
        {
          id: "hi-op-3",
          label: "Telepresence Operator Mode",
          description: "Enables human operators to remotely beam in, speak, and pilot the robot with two-way HD video.",
          priceAdd: 40000,
          unit: "one-time"
        }
      ],
      modes: {
        buy: { basePrice: 620000 },
        build: { kitPrice: 440000, mentorDayRate: 20000, perStudentMaterial: 5000, minStudents: 20 }
      }
    },
    {
      id: "humanoid-ultimate",
      slug: "humanoid-ultimate",
      family: "humanoid",
      name: "Humanoid Ultimate",
      tagline: "Flagship 36-DOF bipedal service humanoid with articulated 5-finger hands & 360° LiDAR.",
      description: "Our most advanced robotic system. Features five-finger dexterous hands, carbon-reinforced structural limbs, and an NVIDIA Orin edge AI computer. Built for advanced university robotics laboratories, high-tech industrial pavilions, and state-of-the-art corporate innovation hubs.",
      specs: [
        "Dimensions: 168 cm (H) × 60 cm (W) · Weight: 48 kg",
        "Battery: 10 Hours High-Performance Run · Dual Hot-swappable Packs",
        "Kinematics: 36 Degrees of Freedom · Dexterous 5-Finger Hands · Dual 3D LiDAR"
      ],
      images: ["humanoid-ultimate.svg"],
      operations: [
        {
          id: "hu-op-1",
          label: "Dexterous Precision Manipulation & Object Handoff",
          description: "Allows the robot to gently grasp, hold, and hand brochures, gifts, or tools up to 3 kg per hand.",
          priceAdd: 95000,
          unit: "one-time"
        },
        {
          id: "hu-op-2",
          label: "Autonomous 24/7 Facility Patrol & Anomaly Detection",
          description: "Schedules night rounds, checks doors and thermal signatures, and reports security anomalies.",
          priceAdd: 75000,
          unit: "one-time"
        },
        {
          id: "hu-op-3",
          label: "ROS 2 Humble / Iron Full Research API Access",
          description: "Direct joint-level torque control and raw sensory access for university AI and robotics researchers.",
          priceAdd: 50000,
          unit: "one-time"
        }
      ],
      modes: {
        buy: { basePrice: 940000 },
        build: { kitPrice: 680000, mentorDayRate: 24000, perStudentMaterial: 6500, minStudents: 20 }
      }
    },
    {
      id: "assistant-essential",
      slug: "assistant-essential",
      family: "assistant",
      name: "Assistant Essential",
      tagline: "Compact countertop & podium concierge robot with directional beamforming audio and touch terminal.",
      description: "Designed for reception counters, library inquiry desks, and hospital registration kiosks. Occupies zero floor space while automating queries, appointment registrations, and queue ticket issuance with instant reliability.",
      specs: [
        "Dimensions: 46 cm (H) × 32 cm (W) · Weight: 7.8 kg",
        "Power: 12V 5A Direct Mains Adapter with 4-Hour UPS Battery Backup",
        "Display & Audio: 10.1\" IPS Full HD Touchscreen · 4-Mic Far-Field Array"
      ],
      images: ["assistant-essential.svg"],
      operations: [
        {
          id: "ae-op-1",
          label: "Automated Token & Appointment Queue Manager",
          description: "Issues digital tokens, syncs with hospital or office ERP, and displays real-time waiting times.",
          priceAdd: 28000,
          unit: "one-time"
        },
        {
          id: "ae-op-2",
          label: "Voice AI Receptionist & FAQ Assistant",
          description: "Trained on your institutional documentation to answer questions about courses, timings, and fees.",
          priceAdd: 32000,
          unit: "one-time"
        }
      ],
      modes: {
        buy: { basePrice: 195000 },
        build: { kitPrice: 135000, mentorDayRate: 14000, perStudentMaterial: 3000, minStudents: 15 }
      }
    },
    {
      id: "assistant-interactive",
      slug: "assistant-interactive",
      family: "assistant",
      name: "Assistant Interactive",
      tagline: "Autonomous wheeled mobile office assistant with payload tray and indoor slam navigation.",
      description: "An agile mobile robot that moves silently across office floors, libraries, and laboratories. Equipped with a built-in courier shelf for internal mail, medicine delivery, or snacks, and an interactive front touchscreen for staff check-ins.",
      specs: [
        "Dimensions: 112 cm (H) × 48 cm (Base Ø) · Weight: 26 kg",
        "Battery: 12 Hours Runtime · Auto-Return Inductive Charging Dock",
        "Mobility: Differential Drive · Max Speed 1.2 m/s · Payload 15 kg"
      ],
      images: ["assistant-interactive.svg"],
      operations: [
        {
          id: "ai-op-1",
          label: "Intra-Office Document & Parcel Delivery",
          description: "Calls elevators, arrives at specific cubicles or desks, and notifies recipient via mobile PIN.",
          priceAdd: 42000,
          unit: "one-time"
        },
        {
          id: "ai-op-2",
          label: "Crowd Flow Analysis & Visitor Greeting",
          description: "Detects human foot traffic density and roams actively to provide help in busy halls.",
          priceAdd: 36000,
          unit: "one-time"
        }
      ],
      modes: {
        buy: { basePrice: 380000 },
        build: { kitPrice: 265000, mentorDayRate: 16000, perStudentMaterial: 3800, minStudents: 20 }
      }
    },
    {
      id: "assistant-premium",
      slug: "assistant-premium",
      family: "assistant",
      name: "Assistant Premium",
      tagline: "Executive floor concierge robot with dual touch displays, motorized lock-boxes & telepresence.",
      description: "Built for boardroom wings, VIP university administration complexes, and private wealth banking suites. Features brushed metallic aesthetics, dual electronic lock-boxes for sensitive items, and broadcast-grade telepresence hardware.",
      specs: [
        "Dimensions: 125 cm (H) × 52 cm (Base Ø) · Weight: 34 kg",
        "Battery: 14 Hours Continuous Operation · Heavy-Duty Lithium Core",
        "Sensors: 3D LiDAR · Dual Ultra-HD PTZ Cameras · Ultrasonic Safety Ring"
      ],
      images: ["assistant-premium.svg"],
      operations: [
        {
          id: "ap-op-1",
          label: "Biometric & RFID Secure Compartment Access",
          description: "Dual motorized compartments that open only for authorized personnel via fingerprint or RFID.",
          priceAdd: 54000,
          unit: "one-time"
        },
        {
          id: "ap-op-2",
          label: "Executive Boardroom Telepresence Suite",
          description: "High-definition zoom cameras and echo-cancelling conference audio for remote executive presence.",
          priceAdd: 46000,
          unit: "one-time"
        }
      ],
      modes: {
        buy: { basePrice: 510000 },
        build: { kitPrice: 360000, mentorDayRate: 18000, perStudentMaterial: 4500, minStudents: 20 }
      }
    },
    {
      id: "sphere-play",
      slug: "sphere-play",
      family: "sphere",
      name: "Sphere Play",
      tagline: "Programmable spherical STEM robot with 360° omnidirectional gyroscopic drive & glowing shell.",
      description: "Sphere Play is an ultra-durable, waterproof spherical robot designed for school and college engineering labs. Students learn computational logic, sensor fusion, and PID control by programming its gyroscopic momentum drive in Python and Scratch.",
      specs: [
        "Dimensions: 22 cm Diameter · Weight: 1.6 kg",
        "Battery: 4 Hours Dynamic Rolling · Wireless Qi Inductive Fast Charging",
        "Sensors: 9-DOF IMU · Ambient Light Sensor · RGB Programmable Core"
      ],
      images: ["sphere-play.svg"],
      operations: [
        {
          id: "sp-op-1",
          label: "Institutional STEM Curriculum & 40 Project Lab Kit",
          description: "Complete curriculum aligned with CBSE / AICTE standards, instructor manuals, and challenge course mats.",
          priceAdd: 18000,
          unit: "one-time"
        },
        {
          id: "sp-op-2",
          label: "Multi-Robot Swarm Synchronized Choreography",
          description: "Software protocol to program up to 16 spheres to dance and navigate synchronously.",
          priceAdd: 22000,
          unit: "one-time"
        }
      ],
      modes: {
        buy: { basePrice: 85000 },
        build: { kitPrice: 58000, mentorDayRate: 12000, perStudentMaterial: 2200, minStudents: 25 }
      }
    },
    {
      id: "sphere-ai",
      slug: "sphere-ai",
      family: "sphere",
      name: "Sphere AI",
      tagline: "Autonomous spherical inspection drone with IP67 sealed chassis & panoramic multi-spectral camera.",
      description: "Sphere AI operates where wheeled or legged robots cannot. Its hermetically sealed spherical shell rolls through chemical tanks, HVAC ducts, agricultural fields, and pipeline infrastructure while transmitting live 360° video and gas detection data.",
      specs: [
        "Dimensions: 34 cm Diameter · Weight: 4.8 kg",
        "Battery: 6 Hours Exploration Run · IP67 Waterproof & Dustproof",
        "Sensors: 360° Dual Fisheye Optics · VOC Gas Sensor · Infrared Night Vision"
      ],
      images: ["sphere-ai.svg"],
      operations: [
        {
          id: "sa-op-1",
          label: "Hazardous Gas & Thermal Anomaly Detection",
          description: "Monitors methane, carbon monoxide, temperature differentials, and flags leak coordinates.",
          priceAdd: 42000,
          unit: "one-time"
        },
        {
          id: "sa-op-2",
          label: "Confined Space 3D Photogrammetry Mapping",
          description: "Creates digital-twin 3D point clouds of pipes, tunnels, and tanks without exposing human workers.",
          priceAdd: 58000,
          unit: "one-time"
        }
      ],
      modes: {
        buy: { basePrice: 275000 },
        build: { kitPrice: 195000, mentorDayRate: 15000, perStudentMaterial: 3500, minStudents: 20 }
      }
    },
    {
      id: "pet-essential",
      slug: "pet-essential",
      family: "pet",
      name: "Pet Essential",
      tagline: "Dynamic 12-DOF companion quadruped with terrain-adaptive gait, voice response & stair climbing.",
      description: "An agile, lovable robotic pet designed for school robotics demonstrations, special education therapy, and office leisure zones. Responds to vocal instructions, executes trotting and rolling gaits, and effortlessly navigates carpets and stairs.",
      specs: [
        "Dimensions: 58 cm (L) × 34 cm (W) × 38 cm (H) · Weight: 9.5 kg",
        "Battery: 2.5 Hours Active Walking · Fast Battery Bay Swap",
        "Mobility: 12 Coreless High-Torque Joint Servos · Max Speed 1.8 m/s"
      ],
      images: ["pet-essential.svg"],
      operations: [
        {
          id: "pe-op-1",
          label: "Gesture Recognition & Smart Companion Mode",
          description: "Follows recognized humans, responds to hand gestures, and performs greeting bows.",
          priceAdd: 24000,
          unit: "one-time"
        },
        {
          id: "pe-op-2",
          label: "Student Programming Sandbox & Mobile App",
          description: "Drag-and-drop block coding app for tablets allowing custom choreography and gait planning.",
          priceAdd: 19000,
          unit: "one-time"
        }
      ],
      modes: {
        buy: { basePrice: 240000 },
        build: { kitPrice: 170000, mentorDayRate: 14000, perStudentMaterial: 2800, minStudents: 20 }
      }
    },
    {
      id: "pet-advanced",
      slug: "pet-advanced",
      family: "pet",
      name: "Pet Advanced",
      tagline: "Autonomous ROS 2 research quadruped with 3D LiDAR, RealSense depth cameras & terrain mapping.",
      description: "Built specifically for university engineering departments and industrial research centers. Powered by high-bandwidth field-oriented control (FOC) brushless motors and a Linux onboard computer with preconfigured ROS 2 navigation stacks.",
      specs: [
        "Dimensions: 68 cm (L) × 38 cm (W) × 45 cm (H) · Weight: 14.2 kg",
        "Battery: 3.5 Hours Runtime · High-C LiPo Core with Telemetry",
        "Sensors: Solid-State 3D LiDAR · Intel RealSense D435i · 100 Hz IMU"
      ],
      images: ["pet-advanced.svg"],
      operations: [
        {
          id: "pa-op-1",
          label: "Autonomous Uneven Terrain Navigation (Slamtec)",
          description: "Navigates slopes up to 25 degrees, grass, gravel, and steps completely autonomously.",
          priceAdd: 48000,
          unit: "one-time"
        },
        {
          id: "pa-op-2",
          label: "Edge AI Vision (YOLOv8 Object & Person Tracker)",
          description: "Runs real-time object detection and spatial classification on the onboard edge accelerator.",
          priceAdd: 39000,
          unit: "one-time"
        }
      ],
      modes: {
        buy: { basePrice: 460000 },
        build: { kitPrice: 325000, mentorDayRate: 18000, perStudentMaterial: 4200, minStudents: 20 }
      }
    },
    {
      id: "pet-premium",
      slug: "pet-premium",
      family: "pet",
      name: "Pet Premium",
      tagline: "Heavy-duty industrial quadruped with 5-DOF top robotic inspection arm & 8 kg back payload rail.",
      description: "Our industrial-grade robotic quadruped. Built for power substation inspections, construction sites, and manufacturing floor security. Equipped with an articulated robotic arm and dual thermal cameras to read analog gauges and inspect heat signatures.",
      specs: [
        "Dimensions: 82 cm (L) × 46 cm (W) × 58 cm (H) · Weight: 22 kg",
        "Battery: 4.5 Hours Continuous Patrol · Heavy Duty IP54 Weather-resistant",
        "Payload: 8 kg Rail Payload · 5-DOF Articulated Arm with Gripper"
      ],
      images: ["pet-premium.svg"],
      operations: [
        {
          id: "pp-op-1",
          label: "Thermal Substation & Gauge Inspection System",
          description: "Reads analog dials, detects hot spots in electrical switchgear, and logs timestamped alerts.",
          priceAdd: 72000,
          unit: "one-time"
        },
        {
          id: "pp-op-2",
          label: "Motorized Arm Valve & Switch Actuation",
          description: "Allows the robotic arm to flip breaker switches and turn valves in hazardous industrial zones.",
          priceAdd: 85000,
          unit: "one-time"
        }
      ],
      modes: {
        buy: { basePrice: 790000 },
        build: { kitPrice: 560000, mentorDayRate: 22000, perStudentMaterial: 5500, minStudents: 20 }
      }
    },
    {
      id: "butterfly-guide",
      slug: "butterfly-guide",
      family: "butterfly",
      name: "Butterfly Guide",
      tagline: "Architectural kinetic guide robot with illuminated carbon-fiber flapping wings & ambient projection.",
      description: "A mesmerizing architectural kinetic robot designed for grand atriums, science city galleries, and modern corporate entrances. Suspended overhead or wall-mounted, its fluid biomimetic wing motions and ambient optical projection guide crowds toward halls and auditoriums.",
      specs: [
        "Dimensions: 140 cm Wingspan · Fuselage: 55 cm · Weight: 4.2 kg",
        "Power: 24V Continuous Ceiling Tether with Integrated Safety Arrestor",
        "Mechanism: Dual Harmonic Drive Wing Actuators · Addressable LED Veins"
      ],
      images: ["butterfly-guide.svg"],
      operations: [
        {
          id: "bg-op-1",
          label: "Dynamic Directional Ground Projection",
          description: "Projects glowing light arrows and hall names on the floor synchronized with wing movement.",
          priceAdd: 34000,
          unit: "one-time"
        },
        {
          id: "bg-op-2",
          label: "Ambient Music & Visitor Flow Synchrony",
          description: "Adapts wing flap frequency and luminous colors to match ambient atrium acoustics and crowd density.",
          priceAdd: 28000,
          unit: "one-time"
        }
      ],
      modes: {
        buy: { basePrice: 320000 },
        build: { kitPrice: 220000, mentorDayRate: 15000, perStudentMaterial: 3200, minStudents: 20 }
      }
    }
  ]
};
