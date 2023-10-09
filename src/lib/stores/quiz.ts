import { writable } from "svelte/store";

type GameState = {
  gameStarted: boolean;
  questions: Question[];
  playersProgress: { [userID: string]: playerProgress };
  podium: playerScore[];
  deadline: number;
  correctAnswer: CorrectAnswerMessage | null;
  changeQuestion: {
    nextQuestionIndex: number;
  } | null;
  tickRate: number;
};

export type playerScore = {
  userId: string;
  score: number;
  rightAnswers: number;
  allAnswers: number;
};

export type CorrectAnswerMessage = {
  questionId: string;
  playerAnswerId: string;
  correctAnswerId: string;
};

export type Answer = {
  _id: string;
  text: string;
};

export type Question = {
  _id: string;
  title: string;
  answers: Answer[];
};

export type playerProgress = {
  currentQuestionIndex: number | null;
  timeLeftToAnswer: number;
  timeBetweenQuestions: number;
};

export type playersAnswer = {
  questionId: string;
  playerAnswerId: string;
  correctAnswerId: string;
  extraTime: number;
};

export const gameStateStore = writable<GameState>({
  gameStarted: false,
  questions: [],
  playersProgress: {},
  podium: [],
  deadline: 0,
  correctAnswer: null,
  changeQuestion: null,
  tickRate: 0,
});
