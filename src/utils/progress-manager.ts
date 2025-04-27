interface Activity {
  type: 'quiz' | 'problem' | 'visualizer' | 'lesson' | 'game';  // Add 'game' type
  title: string;
  score?: string;
  date: string;
}

interface UserProgress {
  level: number;
  xp: number;
  totalXp: number;
  streak: number;
  lastLoginDate: string;
  completedLessons: number;
  totalLessons: number;
  quizzesPassed: number;
  totalQuizzes: number;
  problemsSolved: number;
  totalProblems: number;
  recentActivity: Activity[];
  achievements: {
    name: string;
    earned: boolean;
    date?: string;
  }[];
  subjectProgress: {
    [key: string]: {
      completed: number;
      total: number;
      lastAccessed: string;
    };
  };
  weeklyStats: {
    [key: string]: number;
  };
}

const DEFAULT_PROGRESS: UserProgress = {
  level: 1,
  xp: 0,
  totalXp: 100,
  streak: 1,
  lastLoginDate: new Date().toISOString(),
  completedLessons: 0,
  totalLessons: 20,
  quizzesPassed: 0,
  totalQuizzes: 10,
  problemsSolved: 0,
  totalProblems: 30,
  recentActivity: [],
  achievements: [
    { name: "First Login", earned: false },
    { name: "Quiz Master", earned: false },
    { name: "Problem Solver", earned: false },
    { name: "7 Day Streak", earned: false },
    { name: "Math Visualizer Pro", earned: false },
    { name: "VR Explorer", earned: false }
  ],
  subjectProgress: {
    algebra: { completed: 0, total: 10, lastAccessed: new Date().toISOString() },
    geometry: { completed: 0, total: 8, lastAccessed: new Date().toISOString() },
    calculus: { completed: 0, total: 12, lastAccessed: new Date().toISOString() },
    statistics: { completed: 0, total: 6, lastAccessed: new Date().toISOString() }
  },
  weeklyStats: {
    monday: 0,
    tuesday: 0,
    wednesday: 0,
    thursday: 0,
    friday: 0,
    saturday: 0,
    sunday: 0
  }
};

export const ProgressManager = {
  getProgress: (): UserProgress => {
    const stored = localStorage.getItem('user_progress');
    const progress = stored ? JSON.parse(stored) : DEFAULT_PROGRESS;
    
    // Set First Login achievement if not already earned
    const firstLoginAchievement = progress.achievements.find(a => a.name === "First Login");
    if (firstLoginAchievement && !firstLoginAchievement.earned) {
      firstLoginAchievement.earned = true;
      firstLoginAchievement.date = new Date().toISOString();
      ProgressManager.saveProgress(progress);
    }
    
    return progress;
  },

  saveProgress: (progress: UserProgress) => {
    localStorage.setItem('user_progress', JSON.stringify(progress));
  },

  addXP: (amount: number) => {
    const progress = ProgressManager.getProgress();
    progress.xp += amount;
    
    // Level up if XP threshold reached
    if (progress.xp >= progress.totalXp) {
      progress.level += 1;
      progress.xp = progress.xp - progress.totalXp;
      progress.totalXp = Math.floor(progress.totalXp * 1.5);
    }

    ProgressManager.saveProgress(progress);
    return progress;
  },

  updateStreak: () => {
    const progress = ProgressManager.getProgress();
    const lastLogin = new Date(progress.lastLoginDate);
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      progress.streak += 1;
      // Check for streak achievement
      if (progress.streak >= 7) {
        const streakAchievement = progress.achievements.find(a => a.name === "7 Day Streak");
        if (streakAchievement && !streakAchievement.earned) {
          streakAchievement.earned = true;
          streakAchievement.date = today.toISOString();
        }
      }
    } else if (diffDays > 1) {
      progress.streak = 0;
    }

    progress.lastLoginDate = today.toISOString();
    progress.weeklyStats[today.toLocaleString('en-US', { weekday: 'long' }).toLowerCase().slice(0, 3)] += 1;

    ProgressManager.saveProgress(progress);
    return progress;
  },

  addActivity: (activity: Omit<Activity, 'date'>) => {
    const progress = ProgressManager.getProgress();
    const newActivity = {
      ...activity,
      date: new Date().toISOString()
    };

    progress.recentActivity = [newActivity, ...progress.recentActivity].slice(0, 10);
    ProgressManager.saveProgress(progress);
    return progress;
  },

  updateSubjectProgress: (subject: string, completed: number) => {
    const progress = ProgressManager.getProgress();
    if (progress.subjectProgress[subject]) {
      progress.subjectProgress[subject].completed = completed;
      progress.subjectProgress[subject].lastAccessed = new Date().toISOString();
    }
    ProgressManager.saveProgress(progress);
    return progress;
  },  // Add comma here

  updateQuizzesPassed: () => {
    const progress = ProgressManager.getProgress();
    progress.quizzesPassed += 1;

    // Update Quiz Master achievement after 1 quiz
    const quizMasterAchievement = progress.achievements.find(a => a.name === "Quiz Master");
    if (quizMasterAchievement && !quizMasterAchievement.earned) {
      quizMasterAchievement.earned = true;
      quizMasterAchievement.date = new Date().toISOString();
    }

    // Add quiz completion to recent activity
    progress.recentActivity = [
      {
        type: 'quiz',
        title: 'Quiz Completed',
        score: '100%',
        date: new Date().toISOString()
      },
      ...progress.recentActivity.slice(0, 9)
    ];

    // Check for Quiz Master achievement
    if (progress.quizzesPassed >= 5) {
      const quizMasterAchievement = progress.achievements.find(a => a.name === "Quiz Master");
      if (quizMasterAchievement && !quizMasterAchievement.earned) {
        quizMasterAchievement.earned = true;
        quizMasterAchievement.date = new Date().toISOString();
      }
    }

    ProgressManager.saveProgress(progress);
    return progress;
  },

  updateProblemsSolved: () => {
    const progress = ProgressManager.getProgress();
    progress.problemsSolved += 1;

    // Update Problem Solver achievement after 1 problem
    const problemSolverAchievement = progress.achievements.find(a => a.name === "Problem Solver");
    if (problemSolverAchievement && !problemSolverAchievement.earned) {
      problemSolverAchievement.earned = true;
      problemSolverAchievement.date = new Date().toISOString();
    }

    // Add XP for solving a problem
    progress.xp += 25;
    
    // Level up if XP threshold reached
    if (progress.xp >= progress.totalXp) {
      progress.level += 1;
      progress.xp = progress.xp - progress.totalXp;
      progress.totalXp = Math.floor(progress.totalXp * 1.5);
    }

    // Add to recent activity
    progress.recentActivity = [
      {
        type: 'problem',
        title: 'Problem Solved',
        date: new Date().toISOString()
      },
      ...progress.recentActivity.slice(0, 9)
    ];

    // Check for achievements
    if (progress.problemsSolved >= 10) {
      const problemSolverAchievement = progress.achievements.find(a => a.name === "Problem Solver");
      if (problemSolverAchievement && !problemSolverAchievement.earned) {
        problemSolverAchievement.earned = true;
        problemSolverAchievement.date = new Date().toISOString();
      }
    }

    ProgressManager.saveProgress(progress);
    return progress;
  },
};