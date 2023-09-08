import { writable } from "svelte/store";

type GameState = {
  gameStarted: boolean;
  questions: Question[];
  playersProgress: { [userID: string]: number };
  deadline: number;
  correctAnswer: CorrectAnswerMessage | null;
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

export const gameStateStore = writable<GameState>({
  gameStarted: false,
  questions: [],
  playersProgress: {},
  deadline: 0,
  correctAnswer: null,
});
