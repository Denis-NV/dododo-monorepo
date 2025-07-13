export enum TAnswer {
  NEVER = "never",
  RARELY = "rarely",
  SOMETIMES = "sometimes",
  ALWAYS = "always",
}

export enum TSkill {
  EMOTIONS = "emotions",
  ATTENTION = "attention",
  COMMUNICATION = "communication",
  READING_WRITING = "reading_writing",
  FINE_MOTOR = "fine_motor",
  ORGANIZING = "organizing",
  LOGICS = "logics",
}

export type TAssesmentJson = {
  [K in TSkill]?: {
    question1: TAnswer;
    question2: TAnswer;
    question3: TAnswer;
    question4: TAnswer;
    question5: TAnswer;
    question6: TAnswer;
    question7: TAnswer;
    question8: TAnswer;
    question9: TAnswer;
    question10: TAnswer;
    question11: TAnswer;
    question12: TAnswer;
    question13: TAnswer;
    question14: TAnswer;
    question15: TAnswer;
    question16: TAnswer;
    question17: TAnswer;
    question18: TAnswer;
    question19: TAnswer;
    question20: TAnswer;
  };
};
