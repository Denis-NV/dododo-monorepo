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
import { StepIndicator } from "../../components";

export const meta: MetaFunction = () => {
  return [
    { title: "skill Assessment" },
    { name: "description", content: "Asses your skill" },
  ];
};

export const loader = assessmentLoader;
export const action = assessmentAction;

const Assessment = () => {
  const {
    skill,
    assessmentData,
    questions: loaderQuestions,
  } = useLoaderData<typeof loader>();
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

  // Use questions from loader or fallback to emotions
  const questions = loaderQuestions || assessmentData.emotions;
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
    <Box p="4" style={{ maxWidth: "800px" }} mx="auto">
      <Heading as="h1" size="6" mb="6" align="center">
        {skill} Assessment
      </Heading>

      <StepIndicator
        currentStep={currentQuestionIndex + 1}
        totalSteps={questions.length}
      />

      <Form method="post" id={form.id} onSubmit={form.onSubmit}>
        {/* Question Container with all questions always in DOM */}
        <Box style={{ minHeight: "400px" }} position="relative">
          {questions.map((question, questionIndex) => {
            const isCurrentQuestion = questionIndex === currentQuestionIndex;
            const field = fields[question.id as keyof typeof fields];

            return (
              <Box
                key={question.id}
                position={isCurrentQuestion ? "relative" : "absolute"}
                top={isCurrentQuestion ? "auto" : "0"}
                left={isCurrentQuestion ? "auto" : "0"}
                width={isCurrentQuestion ? "auto" : "100%"}
                style={{
                  opacity: isCurrentQuestion ? (isTransitioning ? 0 : 1) : 0,
                  visibility: isCurrentQuestion ? "visible" : "hidden",
                  transition: `opacity var(--transition-fast)`,
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
                                      isSelected
                                        ? "var(--blue-9)"
                                        : "var(--gray-6)"
                                    }`,
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    transition: `all var(--transition-medium)`,
                                    backgroundColor: isSelected
                                      ? "var(--blue-2)"
                                      : "var(--color-background)",
                                    boxShadow: isSelected
                                      ? "0 0 0 3px var(--blue-4)"
                                      : "none",
                                  }}
                                  onMouseEnter={(e) => {
                                    if (!isSelected) {
                                      e.currentTarget.style.backgroundColor =
                                        "var(--gray-2)";
                                      e.currentTarget.style.borderColor =
                                        "var(--gray-8)";
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!isSelected) {
                                      e.currentTarget.style.backgroundColor =
                                        "var(--color-background)";
                                      e.currentTarget.style.borderColor =
                                        "var(--gray-6)";
                                    } else {
                                      e.currentTarget.style.backgroundColor =
                                        "var(--blue-2)";
                                      e.currentTarget.style.borderColor =
                                        "var(--blue-9)";
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
                                    color={isSelected ? "blue" : "gray"}
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
            size="3"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            style={{
              opacity: currentQuestionIndex === 0 ? 0 : 1,
            }}
          >
            Previous
          </Button>

          <Button
            type="button"
            size="3"
            onClick={handleNext}
            disabled={!isCurrentQuestionAnswered}
            style={{
              opacity: isLastQuestion ? 0 : 1,
              visibility: isLastQuestion ? "hidden" : "visible",
            }}
          >
            Next
          </Button>

          <Button
            type="submit"
            size="3"
            disabled={!isCurrentQuestionAnswered}
            style={{
              opacity: isLastQuestion ? 1 : 0,
              visibility: isLastQuestion ? "visible" : "hidden",
              position: isLastQuestion ? "static" : "absolute",
              right: isLastQuestion ? "auto" : "0",
            }}
          >
            Submit Assessment
          </Button>
        </Flex>

        {actionData?.status === "success" && (
          <Card
            mt="6"
            style={{ padding: "16px", backgroundColor: "var(--green-2)" }}
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
