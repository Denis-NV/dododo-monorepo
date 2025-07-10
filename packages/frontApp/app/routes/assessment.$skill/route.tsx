import { MetaFunction } from "@remix-run/node";
import { useLoaderData, Form, useActionData } from "@remix-run/react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useState } from "react";

import assessmentLoader from "./loader";
import assessmentAction, { assessmentSchema } from "./action";

import {
  Heading,
  Button,
  Box,
  Flex,
  Text,
  RadioGroup,
  Card,
} from "@radix-ui/themes";

export const meta: MetaFunction = () => {
  return [
    { title: "skill Assessment" },
    { name: "description", content: "Asses your skill" },
  ];
};

export const loader = assessmentLoader;
export const action = assessmentAction;

const Assessment = () => {
  const params = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  // State for carousel functionality
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>(
    {}
  );
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [form, fields] = useForm({
    id: "emotions",
    lastResult: actionData,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: assessmentSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const assessmentData = {
    emotions: [
      {
        id: "question1",
        question: "What is your preferred learning style?",
        level: "3",
        options: [
          { score: "2", value: "never", label: "Visual" },
          { score: "1", value: "rarely", label: "Auditory" },
          { score: "0", value: "sometimes", label: "Kinesthetic" },
          { score: "3", value: "always", label: "Reading/Writing" },
        ],
      },
      {
        id: "question2",
        question: "How do you handle challenging situations?",
        level: "1",
        options: [
          { score: "3", value: "never", label: "Analyze thoroughly" },
          { score: "2", value: "rarely", label: "Seek help from others" },
          { score: "1", value: "sometimes", label: "Trial and error" },
          { score: "0", value: "always", label: "Take a break first" },
        ],
      },
      {
        id: "question3",
        question: "What motivates you most in your work?",
        level: "2",
        options: [
          { score: "2", value: "never", label: "Personal achievement" },
          { score: "0", value: "rarely", label: "Recognition from others" },
          { score: "3", value: "sometimes", label: "Helping others" },
          { score: "1", value: "always", label: "Continuous learning" },
        ],
      },
      {
        id: "question4",
        question: "How do you prefer to receive feedback?",
        level: "1",
        options: [
          { score: "3", value: "never", label: "Immediate and direct" },
          { score: "1", value: "rarely", label: "Written format" },
          { score: "2", value: "sometimes", label: "Constructive discussion" },
          { score: "0", value: "always", label: "With specific examples" },
        ],
      },
    ],
  };

  const questions = assessmentData.emotions;
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isCurrentQuestionAnswered = selectedValues[currentQuestion.id];

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev - 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const handleValueChange = (value: string) => {
    setSelectedValues((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  return (
    <Box p="4" maxWidth="800px" mx="auto">
      <Heading as="h1" size="6" mb="6" align="center">
        {params?.skill} Assessment
      </Heading>

      {/* Progress indicator */}
      <Box mb="6">
        <Flex justify="between" align="center" mb="2">
          <Text size="2" color="gray">
            Question {currentQuestionIndex + 1} of {questions.length}
          </Text>
          <Text size="2" color="gray">
            {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
            Complete
          </Text>
        </Flex>
        <Box
          style={{
            width: "100%",
            height: "4px",
            backgroundColor: "var(--gray-4)",
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          <Box
            style={{
              width: `${
                ((currentQuestionIndex + 1) / questions.length) * 100
              }%`,
              height: "100%",
              backgroundColor: "#3b82f6",
              transition: "width 0.3s ease",
            }}
          />
        </Box>
      </Box>

      <Form method="post" id={form.id} onSubmit={form.onSubmit}>
        {/* Question Container with all questions always in DOM */}
        <Box style={{ minHeight: "400px" }}>
          {questions.map((question, questionIndex) => {
            const isCurrentQuestion = questionIndex === currentQuestionIndex;
            const field = fields[question.id as keyof typeof fields];

            return (
              <Box
                key={question.id}
                style={{
                  opacity: isCurrentQuestion ? (isTransitioning ? 0 : 1) : 0,
                  visibility: isCurrentQuestion ? "visible" : "hidden",
                  position: isCurrentQuestion ? "relative" : "absolute",
                  top: isCurrentQuestion ? "auto" : 0,
                  left: isCurrentQuestion ? "auto" : 0,
                  width: isCurrentQuestion ? "auto" : "100%",
                  transition: "opacity 0.15s ease-in-out",
                  pointerEvents: isCurrentQuestion ? "auto" : "none",
                }}
              >
                <Card style={{ padding: "24px" }}>
                  <Flex direction="column" gap="4">
                    <Text
                      size="5"
                      weight="medium"
                      style={{ lineHeight: "1.4" }}
                    >
                      {questionIndex + 1}. {question.question}
                    </Text>

                    <RadioGroup.Root
                      name={question.id}
                      value={selectedValues[question.id] || ""}
                      onValueChange={(value) => {
                        setSelectedValues((prev) => ({
                          ...prev,
                          [question.id]: value,
                        }));
                      }}
                    >
                      <Flex direction="column" gap="3">
                        {question.options.map((option) => {
                          const isSelected =
                            selectedValues[question.id] === option.value;

                          return (
                            <Box key={option.value}>
                              <Text asChild>
                                <label
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    padding: "16px 20px",
                                    border: `2px solid ${
                                      isSelected ? "#3b82f6" : "#d1d5db"
                                    }`,
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                    backgroundColor: isSelected
                                      ? "#dbeafe"
                                      : "#ffffff",
                                    boxShadow: isSelected
                                      ? "0 0 0 3px rgba(59, 130, 246, 0.1)"
                                      : "none",
                                  }}
                                  onMouseEnter={(e) => {
                                    if (!isSelected) {
                                      e.currentTarget.style.backgroundColor =
                                        "#f9fafb";
                                      e.currentTarget.style.borderColor =
                                        "#9ca3af";
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!isSelected) {
                                      e.currentTarget.style.backgroundColor =
                                        "#ffffff";
                                      e.currentTarget.style.borderColor =
                                        "#d1d5db";
                                    } else {
                                      e.currentTarget.style.backgroundColor =
                                        "#dbeafe";
                                      e.currentTarget.style.borderColor =
                                        "#3b82f6";
                                    }
                                  }}
                                >
                                  <RadioGroup.Item
                                    value={option.value}
                                    style={{
                                      margin: 0,
                                      opacity: 0,
                                      position: "absolute",
                                      pointerEvents: "none",
                                    }}
                                  />
                                  <Text
                                    size="3"
                                    weight={isSelected ? "bold" : "regular"}
                                    style={{
                                      color: isSelected ? "#1e40af" : "#374151",
                                    }}
                                  >
                                    {option.label}
                                  </Text>
                                </label>
                              </Text>
                            </Box>
                          );
                        })}
                      </Flex>
                    </RadioGroup.Root>

                    {field?.errors && (
                      <Text size="2" color="red">
                        {field.errors[0]}
                      </Text>
                    )}
                  </Flex>
                </Card>
              </Box>
            );
          })}
        </Box>

        {/* Navigation Buttons - Always present in DOM */}
        <Flex justify="between" align="center" mt="6">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            style={{
              opacity: currentQuestionIndex === 0 ? 0 : 1,
              pointerEvents: currentQuestionIndex === 0 ? "none" : "auto",
              cursor: currentQuestionIndex === 0 ? "not-allowed" : "pointer",
              transition: "opacity 0.2s ease",
            }}
          >
            Previous
          </Button>

          <Button
            type="button"
            onClick={handleNext}
            style={{
              opacity: isLastQuestion
                ? 0
                : !isCurrentQuestionAnswered
                ? 0.5
                : 1,
              pointerEvents: isLastQuestion
                ? "none"
                : !isCurrentQuestionAnswered
                ? "none"
                : "auto",
              cursor: !isCurrentQuestionAnswered ? "not-allowed" : "pointer",
              transition: "opacity 0.2s ease",
            }}
          >
            Next
          </Button>

          <Button
            type="submit"
            style={{
              opacity: !isLastQuestion
                ? 0
                : !isCurrentQuestionAnswered
                ? 0.5
                : 1,
              pointerEvents: !isLastQuestion
                ? "none"
                : !isCurrentQuestionAnswered
                ? "none"
                : "auto",
              cursor: !isCurrentQuestionAnswered ? "not-allowed" : "pointer",
              transition: "opacity 0.2s ease",
            }}
          >
            Submit Assessment
          </Button>
        </Flex>

        {actionData?.status === "success" && (
          <Card
            style={{
              padding: "16px",
              backgroundColor: "var(--green-2)",
              marginTop: "24px",
            }}
          >
            <Text size="3" color="green" weight="medium">
              Assessment submitted successfully! Check the console for answers.
            </Text>
          </Card>
        )}
      </Form>
    </Box>
  );
};

export default Assessment;
