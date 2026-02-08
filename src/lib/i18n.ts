export type Locale = "en" | "fr";

const translations: Record<Locale, Record<string, string>> = {
  en: {
    // General
    "app.name": "Bravoo",
    "app.tagline": "2 minutes. 1 star. Daily momentum.",
    "app.login.subtitle": "One tap to sign in.\nStart moving in 2 minutes!",
    "app.login.button": "Sign in with Google",
    "app.login.signing_in": "Signing in...",
    "app.logout": "Logout",
    "app.loading": "Loading...",
    "app.version": "v2.3.0",

    // Dashboard
    "dashboard.days_left": "Days left this month",
    "dashboard.days_short": "d",
    "dashboard.gold": "Gold",
    "dashboard.stars_progress": "stars",
    "dashboard.stars_goal": "Goal: 4 stars this month",
    "dashboard.stars_reached": "You reached LEGEND status!",
    "dashboard.stars_remaining": "{count} more star(s) to Legend",
    "dashboard.leaderboard": "Leaderboard",

    // Quests
    "quests.daily": "Daily",
    "quests.weekly": "Weekly",
    "quests.complete": "Mission completed!",
    "quests.completed": "Completed!",
    "quests.validating": "Validating...",
    "quests.reroll": "Reroll",
    "quests.rerolled": "Already rerolled",
    "quests.empty_slot": "Empty slot",
    "quests.new_quest_tomorrow": "New quest tomorrow",
    "quests.new_quests_monday": "New quests Monday",
    "quests.gold_reward": "+{amount} gold",
    "quests.weekly_progress": "Week: {completed}/{total}",
    "quests.star_earned": "Star earned!",
    "quests.today_title": "Today's Quests",

    // Quest titles
    "quest.daily.squats10": "10 Squats",
    "quest.daily.pushups5": "5 Push-ups",
    "quest.daily.jumpingjacks10": "10 Jumping Jacks",
    "quest.daily.plank30": "30s Plank",
    "quest.daily.highknees15": "15 High Knees",
    "quest.daily.lunges10": "10 Lunges",
    "quest.daily.armcircles20": "20 Arm Circles",
    "quest.daily.crunches10": "10 Crunches",
    "quest.daily.wallsit30": "Wall Sit 30s",
    "quest.daily.stretch1": "Stretch 1 min",

    // Quest descriptions
    "quest.daily.squats10.desc": "Do 10 squats to wake up your legs!",
    "quest.daily.pushups5.desc": "Start your day with 5 push-ups!",
    "quest.daily.jumpingjacks10.desc": "Get your heart pumping!",
    "quest.daily.plank30.desc": "Hold a plank for 30 seconds!",
    "quest.daily.highknees15.desc": "Lift those knees high!",
    "quest.daily.lunges10.desc": "5 lunges on each leg!",
    "quest.daily.armcircles20.desc": "10 forward, 10 backward!",
    "quest.daily.crunches10.desc": "Quick core work!",
    "quest.daily.wallsit30.desc": "Find a wall and sit for 30s!",
    "quest.daily.stretch1.desc": "Touch your toes, reach for the sky!",

    // Weekly quest titles
    "quest.weekly.run2k": "Run 2km",
    "quest.weekly.squats50": "50 Squats",
    "quest.weekly.pushups30": "30 Push-ups",
    "quest.weekly.plank5min": "5 min Plank",
    "quest.weekly.jumpingjacks100": "100 Jumping Jacks",
    "quest.weekly.lunges45": "3x15 Lunges",
    "quest.weekly.coreblast": "Core Blast",
    "quest.weekly.burpees20": "20 Burpees",
    "quest.weekly.dance10": "Dance 10 min",
    "quest.weekly.walk5000": "Walk 5000 steps",

    // Weekly quest descriptions
    "quest.weekly.run2k.desc": "Run or jog 2 kilometers!",
    "quest.weekly.squats50.desc": "Complete 50 squats in one session!",
    "quest.weekly.pushups30.desc": "Do 30 push-ups, take breaks if needed!",
    "quest.weekly.plank5min.desc": "Accumulate 5 minutes of plank!",
    "quest.weekly.jumpingjacks100.desc": "100 jumping jacks, feel the burn!",
    "quest.weekly.lunges45.desc": "3 sets of 15 lunges each leg!",
    "quest.weekly.coreblast.desc": "50 crunches + 50 sit-ups!",
    "quest.weekly.burpees20.desc": "The ultimate full-body challenge!",
    "quest.weekly.dance10.desc": "Put on music and dance for 10 minutes!",
    "quest.weekly.walk5000.desc": "Take a walk and hit 5000 steps!",

    // Ranks
    "rank.Bronze": "Bronze",
    "rank.Silver": "Silver",
    "rank.Gold": "Gold",
    "rank.Platinum": "Platinum",
    "rank.Legend": "Legend",

    // Leaderboard
    "leaderboard.title": "Leaderboard",
    "leaderboard.monthly": "Monthly ranking",
    "leaderboard.no_entries": "No entries yet",
    "leaderboard.no_entries_sub": "Complete quests to appear here!",
    "leaderboard.you": "(you)",
    "leaderboard.back": "Back",

    // Popup
    "popup.well_done": "Well done!",
    "popup.stars_count": "You now have {count} {count, plural, one {star} other {stars}}",
    "popup.gold_earned": "+{amount} gold earned!",
    "popup.continue": "Continue",
    "popup.stop": "Stop for today",
    "popup.continue_training": "Would you like to continue training?",

    // Tabs
    "tab.quests": "Quests",
    "tab.character": "Character",
    "tab.shop": "Shop",
    "tab.battles": "Battles",

    // Coming soon
    "coming_soon.title": "Coming Soon",
    "coming_soon.character": "Customize your avatar, track your stats, and level up your character.",
    "coming_soon.shop": "Spend your gold on power-ups, cosmetics, and special items.",
    "coming_soon.battles": "Challenge other players and climb the ranks!",

    // Feedback
    "tab.feedback": "Ideas",
    "feedback.title": "Suggestions",
    "feedback.subtitle": "Help us improve Bravoo! Share your ideas.",
    "feedback.placeholder": "Describe your idea or suggestion...",
    "feedback.send": "Send",
    "feedback.sent": "Thanks for your feedback!",
    "feedback.all_suggestions": "All suggestions",
    "feedback.empty": "No suggestions yet",
    "feedback.empty_sub": "Be the first to share an idea!",
    "feedback.just_now": "Just now",
    "feedback.mins_ago": "{count}m ago",
    "feedback.hours_ago": "{count}h ago",
    "feedback.days_ago": "{count}d ago",

    // Errors
    "error.connection": "Connection error. Please try again.",
    "error.unauthorized_domain": "This domain is not authorized.",
    "error.server": "Server error ({status}). Check logs.",
  },

  fr: {
    // General
    "app.name": "Bravoo",
    "app.tagline": "2 minutes. 1 etoile. Chaque jour compte.",
    "app.login.subtitle": "Connecte-toi en un clic.\nCommence a bouger en 2 minutes !",
    "app.login.button": "Se connecter avec Google",
    "app.login.signing_in": "Connexion...",
    "app.logout": "Deconnexion",
    "app.loading": "Chargement...",
    "app.version": "v2.3.0",

    // Dashboard
    "dashboard.days_left": "Jours restants ce mois",
    "dashboard.days_short": "j",
    "dashboard.gold": "Or",
    "dashboard.stars_progress": "etoiles",
    "dashboard.stars_goal": "Objectif : 4 etoiles ce mois",
    "dashboard.stars_reached": "Tu as atteint le rang LEGENDE !",
    "dashboard.stars_remaining": "Encore {count} etoile(s) pour la Legende",
    "dashboard.leaderboard": "Classement",

    // Quests
    "quests.daily": "Journaliere",
    "quests.weekly": "Hebdomadaire",
    "quests.complete": "Mission accomplie !",
    "quests.completed": "Terminee !",
    "quests.validating": "Validation...",
    "quests.reroll": "Changer",
    "quests.rerolled": "Deja change",
    "quests.empty_slot": "Emplacement vide",
    "quests.new_quest_tomorrow": "Nouvelle quete demain",
    "quests.new_quests_monday": "Nouvelles quetes lundi",
    "quests.gold_reward": "+{amount} or",
    "quests.weekly_progress": "Semaine : {completed}/{total}",
    "quests.star_earned": "Etoile gagnee !",
    "quests.today_title": "Quetes du jour",

    // Quest titles
    "quest.daily.squats10": "10 Squats",
    "quest.daily.pushups5": "5 Pompes",
    "quest.daily.jumpingjacks10": "10 Jumping Jacks",
    "quest.daily.plank30": "30s de Gainage",
    "quest.daily.highknees15": "15 Montees de genoux",
    "quest.daily.lunges10": "10 Fentes",
    "quest.daily.armcircles20": "20 Cercles de bras",
    "quest.daily.crunches10": "10 Abdos",
    "quest.daily.wallsit30": "Chaise 30s",
    "quest.daily.stretch1": "Etirements 1 min",

    // Quest descriptions
    "quest.daily.squats10.desc": "Fais 10 squats pour reveiller tes jambes !",
    "quest.daily.pushups5.desc": "Commence ta journee avec 5 pompes !",
    "quest.daily.jumpingjacks10.desc": "Fais battre ton coeur !",
    "quest.daily.plank30.desc": "Tiens la planche 30 secondes !",
    "quest.daily.highknees15.desc": "Monte les genoux bien haut !",
    "quest.daily.lunges10.desc": "5 fentes de chaque cote !",
    "quest.daily.armcircles20.desc": "10 vers l'avant, 10 vers l'arriere !",
    "quest.daily.crunches10.desc": "Un peu d'abdos rapides !",
    "quest.daily.wallsit30.desc": "Trouve un mur et tiens la chaise 30s !",
    "quest.daily.stretch1.desc": "Touche tes pieds, tends les bras !",

    // Weekly quest titles
    "quest.weekly.run2k": "Courir 2km",
    "quest.weekly.squats50": "50 Squats",
    "quest.weekly.pushups30": "30 Pompes",
    "quest.weekly.plank5min": "5 min de Gainage",
    "quest.weekly.jumpingjacks100": "100 Jumping Jacks",
    "quest.weekly.lunges45": "3x15 Fentes",
    "quest.weekly.coreblast": "Seance Abdos",
    "quest.weekly.burpees20": "20 Burpees",
    "quest.weekly.dance10": "Danser 10 min",
    "quest.weekly.walk5000": "Marcher 5000 pas",

    // Weekly quest descriptions
    "quest.weekly.run2k.desc": "Cours ou trottine sur 2 kilometres !",
    "quest.weekly.squats50.desc": "Complete 50 squats en une seance !",
    "quest.weekly.pushups30.desc": "Fais 30 pompes, avec des pauses si besoin !",
    "quest.weekly.plank5min.desc": "Accumule 5 minutes de gainage !",
    "quest.weekly.jumpingjacks100.desc": "100 jumping jacks, sens la brulure !",
    "quest.weekly.lunges45.desc": "3 series de 15 fentes par jambe !",
    "quest.weekly.coreblast.desc": "50 abdos + 50 crunchs !",
    "quest.weekly.burpees20.desc": "Le defi ultime full-body !",
    "quest.weekly.dance10.desc": "Mets de la musique et danse 10 minutes !",
    "quest.weekly.walk5000.desc": "Fais une balade et atteins 5000 pas !",

    // Ranks
    "rank.Bronze": "Bronze",
    "rank.Silver": "Argent",
    "rank.Gold": "Or",
    "rank.Platinum": "Platine",
    "rank.Legend": "Legende",

    // Leaderboard
    "leaderboard.title": "Classement",
    "leaderboard.monthly": "Classement mensuel",
    "leaderboard.no_entries": "Aucune entree",
    "leaderboard.no_entries_sub": "Complete des quetes pour apparaitre ici !",
    "leaderboard.you": "(toi)",
    "leaderboard.back": "Retour",

    // Popup
    "popup.well_done": "Bien joue !",
    "popup.stars_count": "Tu as maintenant {count} etoile(s)",
    "popup.gold_earned": "+{amount} or gagne !",
    "popup.continue": "Continuer",
    "popup.stop": "Arreter pour aujourd'hui",
    "popup.continue_training": "Tu veux continuer a t'entrainer ?",

    // Tabs
    "tab.quests": "Quetes",
    "tab.character": "Personnage",
    "tab.shop": "Boutique",
    "tab.battles": "Combats",

    // Coming soon
    "coming_soon.title": "Bientot disponible",
    "coming_soon.character": "Personnalise ton avatar, suis tes stats et fais evoluer ton personnage.",
    "coming_soon.shop": "Depense ton or pour des bonus, des cosmetiques et des objets speciaux.",
    "coming_soon.battles": "Defie d'autres joueurs et grimpe dans le classement !",

    // Feedback
    "tab.feedback": "Idees",
    "feedback.title": "Suggestions",
    "feedback.subtitle": "Aide-nous a ameliorer Bravoo ! Partage tes idees.",
    "feedback.placeholder": "Decris ton idee ou suggestion...",
    "feedback.send": "Envoyer",
    "feedback.sent": "Merci pour ton retour !",
    "feedback.all_suggestions": "Toutes les suggestions",
    "feedback.empty": "Aucune suggestion",
    "feedback.empty_sub": "Sois le premier a partager une idee !",
    "feedback.just_now": "A l'instant",
    "feedback.mins_ago": "Il y a {count}min",
    "feedback.hours_ago": "Il y a {count}h",
    "feedback.days_ago": "Il y a {count}j",

    // Errors
    "error.connection": "Erreur de connexion. Reessaie.",
    "error.unauthorized_domain": "Ce domaine n'est pas autorise.",
    "error.server": "Erreur serveur ({status}). Verifie les logs.",
  },
};

export function detectLocale(): Locale {
  if (typeof navigator === "undefined") return "en";
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith("fr")) return "fr";
  return "en";
}

export function t(key: string, locale: Locale, params?: Record<string, string | number>): string {
  let text = translations[locale]?.[key] || translations.en[key] || key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(`{${k}}`, String(v));
    }
  }
  return text;
}

export function getLocales(): { code: Locale; label: string }[] {
  return [
    { code: "en", label: "English" },
    { code: "fr", label: "Francais" },
  ];
}
