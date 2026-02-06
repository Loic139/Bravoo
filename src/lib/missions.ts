export interface Mission {
  id: string;
  title: string;
  description: string;
  emoji: string;
}

const MORNING_MISSIONS: Mission[] = [
  { id: "m1", title: "10 Squats", description: "Do 10 squats to wake up your legs!", emoji: "🦵" },
  { id: "m2", title: "5 Push-ups", description: "Start your day strong with 5 push-ups!", emoji: "💪" },
  { id: "m3", title: "10 Jumping Jacks", description: "Get your heart pumping with jumping jacks!", emoji: "⭐" },
  { id: "m4", title: "30s Plank", description: "Hold a plank for 30 seconds. You got this!", emoji: "🧘" },
  { id: "m5", title: "15 High Knees", description: "Lift those knees high, 15 times each side!", emoji: "🏃" },
  { id: "m6", title: "10 Lunges", description: "5 lunges on each leg to stretch and strengthen!", emoji: "🦿" },
  { id: "m7", title: "20 Arm Circles", description: "10 forward, 10 backward. Loosen up those shoulders!", emoji: "🔄" },
  { id: "m8", title: "10 Crunches", description: "Quick core work to start the morning!", emoji: "🔥" },
  { id: "m9", title: "Wall Sit 30s", description: "Find a wall and sit against it for 30 seconds!", emoji: "🧱" },
  { id: "m10", title: "Stretch for 1 min", description: "Touch your toes, reach for the sky, feel great!", emoji: "🌅" },
];

const EVENING_MISSIONS: Mission[] = [
  { id: "e1", title: "15 Squats", description: "Finish the day strong with 15 squats!", emoji: "🦵" },
  { id: "e2", title: "10 Push-ups", description: "Push through 10 push-ups before you rest!", emoji: "💪" },
  { id: "e3", title: "15 Jumping Jacks", description: "Burn off the day with jumping jacks!", emoji: "⭐" },
  { id: "e4", title: "45s Plank", description: "Plank it out for 45 seconds. Almost done!", emoji: "🧘" },
  { id: "e5", title: "20 High Knees", description: "Get those knees up 20 times each side!", emoji: "🏃" },
  { id: "e6", title: "Run Around Your Building", description: "Quick lap around the building. Fresh air!", emoji: "🏢" },
  { id: "e7", title: "10 Burpees", description: "The ultimate full-body finisher!", emoji: "🔥" },
  { id: "e8", title: "20 Crunches", description: "A quick core blast before bed!", emoji: "💥" },
  { id: "e9", title: "Wall Sit 45s", description: "Hold that wall sit! Your legs will thank you!", emoji: "🧱" },
  { id: "e10", title: "Dance for 1 min", description: "Put on a song and dance like no one's watching!", emoji: "💃" },
];

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function getTodaysMissions(date: Date = new Date()): {
  morning: Mission;
  evening: Mission;
} {
  const dayIndex = getDayOfYear(date);
  return {
    morning: MORNING_MISSIONS[dayIndex % MORNING_MISSIONS.length],
    evening: EVENING_MISSIONS[dayIndex % EVENING_MISSIONS.length],
  };
}

export function getMissionTimeWindow(date: Date = new Date()): {
  isMorning: boolean;
  isEvening: boolean;
} {
  const hour = date.getHours();
  return {
    isMorning: hour < 12,
    isEvening: hour >= 12,
  };
}
