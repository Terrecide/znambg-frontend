export enum ButtonColors {
  green = "btn-green",
  pink = "btn-pink",
  red = "btn-red",
}

// The complete set of opcodes used for communication between clients and server.
export enum OpCode {
  // New game round starting.
  START = 1,
  // Update to the state of an ongoing round.
  UPDATE = 2,
  // A game round has just completed.
  DONE = 3,
  // A move the player wishes to make and sends to the server.
  ANSWER = 4,
  // Move was rejected.
  REJECTED = 5,
  // A move the player wishes to make and sends to the server.
  CORRECT_ANSWER = 6,
  // Message from server to client to change the question.
  CHANGE_QUESTION = 7,
  // Message from server to client to generate Podium
  PODIUM = 8,
  // Message from client to server to remove questions
  JOKER_REMOVE_QUESTIONS = 9,
}
