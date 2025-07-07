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
    id: "assessment-form",
    lastResult: actionData,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: assessmentSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const questions = [
    {
      id: "question1",
      question: "What is your preferred learning style?",
      options: [
        { value: "visual", label: "Visual" },
        { value: "auditory", label: "Auditory" },
        { value: "kinesthetic", label: "Kinesthetic" },
        { value: "reading", label: "Reading/Writing" },
      ],
    },
    {
      id: "question2",
      question: "How do you handle challenging situations?",
      options: [
        { value: "analyze", label: "Analyze thoroughly" },
        { value: "seek_help", label: "Seek help from others" },
        { value: "trial_error", label: "Trial and error" },
        { value: "take_break", label: "Take a break first" },
      ],
    },
    {
      id: "question3",
      question: "What motivates you most in your work?",
      options: [
        { value: "achievement", label: "Personal achievement" },
        { value: "recognition", label: "Recognition from others" },
        { value: "helping", label: "Helping others" },
        { value: "learning", label: "Continuous learning" },
      ],
    },
    {
      id: "question4",
      question: "How do you prefer to receive feedback?",
      options: [
        { value: "immediate", label: "Immediate and direct" },
        { value: "written", label: "Written format" },
        { value: "constructive", label: "Constructive discussion" },
        { value: "examples", label: "With specific examples" },
      ],
    },
  ];

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
        {/* Hidden inputs for all selected values */}
        {Object.entries(selectedValues).map(([questionId, value]) => (
          <input
            key={questionId}
            type="hidden"
            name={questionId}
            value={value}
          />
        ))}

        {/* Question Container with fade transition */}
        <Box
          style={{
            opacity: isTransitioning ? 0 : 1,
            transition: "opacity 0.15s ease-in-out",
            minHeight: "400px",
          }}
        >
          <Card style={{ padding: "24px" }}>
            <Flex direction="column" gap="4">
              <Text size="5" weight="medium" style={{ lineHeight: "1.4" }}>
                {currentQuestionIndex + 1}. {currentQuestion.question}
              </Text>

              <RadioGroup.Root
                value={selectedValues[currentQuestion.id] || ""}
                onValueChange={handleValueChange}
              >
                <Flex direction="column" gap="3">
                  {currentQuestion.options.map((option) => {
                    const isSelected =
                      selectedValues[currentQuestion.id] === option.value;

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
                                e.currentTarget.style.borderColor = "#9ca3af";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isSelected) {
                                e.currentTarget.style.backgroundColor =
                                  "#ffffff";
                                e.currentTarget.style.borderColor = "#d1d5db";
                              } else {
                                e.currentTarget.style.backgroundColor =
                                  "#dbeafe";
                                e.currentTarget.style.borderColor = "#3b82f6";
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
            </Flex>
          </Card>
        </Box>

        {/* Navigation Buttons */}
        <Flex justify="between" align="center" mt="6">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            style={{
              opacity: currentQuestionIndex === 0 ? 0.5 : 1,
              cursor: currentQuestionIndex === 0 ? "not-allowed" : "pointer",
            }}
          >
            Previous
          </Button>

          {isLastQuestion ? (
            <Button
              type="submit"
              disabled={!isCurrentQuestionAnswered}
              style={{
                opacity: !isCurrentQuestionAnswered ? 0.5 : 1,
                cursor: !isCurrentQuestionAnswered ? "not-allowed" : "pointer",
              }}
            >
              Submit Assessment
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleNext}
              disabled={!isCurrentQuestionAnswered}
              style={{
                opacity: !isCurrentQuestionAnswered ? 0.5 : 1,
                cursor: !isCurrentQuestionAnswered ? "not-allowed" : "pointer",
              }}
            >
              Next
            </Button>
          )}
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
