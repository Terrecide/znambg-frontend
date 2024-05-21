import { writable } from "svelte/store";

export const gameState = writable<{
  globalState?: GlobalState;
  me?: Player;
  players?: Player[];
  question?: Question;
  beforeStartTimer?: number;
}>({
  globalState: undefined,
  me: undefined,
  players: undefined,
  question: undefined,
  beforeStartTimer: undefined,
});

export type GlobalState = {
  questionsLength: number;
};

export type Player = {
  availableJokers: [];
  consecutiveAnswers: number;
  currentQuestion: {
    _id: string;
    title: string;
    answers: [];
    correctAnswer: number;
  };
  currentQuestionIndex: number;
  displayName: string;
  finished: boolean;
  id: string;
  score: number;
  state: string;
  timeBetweenQuestionsCounter: number;
  timeToAnswerCounter: number;
  uid: string;
  usedJokerTemp: [];
  answerIndex?: number;
  correctAnswer?: number;
};

export type Question = {
  answers: {
    _id: string;
    text: string;
  }[];
  length: number;
  title: string;
};
