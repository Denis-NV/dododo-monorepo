import { MetaFunction } from "@remix-run/node";
import { useLoaderData, Form, useActionData } from "@remix-run/react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";

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

  return (
    <Box p="4" maxWidth="800px" mx="auto">
      <Heading as="h1" size="6" mb="6" align="center">
        {params?.skill} Assessment
      </Heading>

      <Form method="post" id={form.id} onSubmit={form.onSubmit}>
        <Flex direction="column" gap="6">
          {questions.map((question, questionIndex) => {
            const field = fields[question.id as keyof typeof fields];

            return (
              <Card key={question.id} style={{ padding: "16px" }}>
                <Flex direction="column" gap="3">
                  <Text size="4" weight="medium">
                    {questionIndex + 1}. {question.question}
                  </Text>

                  <RadioGroup.Root
                    name={question.id}
                    defaultValue={field?.initialValue as string}
                  >
                    <Flex direction="column" gap="2">
                      {question.options.map((option) => (
                        <Box key={option.value}>
                          <Text asChild>
                            <label
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "12px 16px",
                                border: "1px solid var(--gray-6)",
                                borderRadius: "6px",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                backgroundColor: "var(--color-surface)",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "var(--gray-2)";
                                e.currentTarget.style.borderColor =
                                  "var(--gray-8)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "var(--color-surface)";
                                e.currentTarget.style.borderColor =
                                  "var(--gray-6)";
                              }}
                            >
                              <RadioGroup.Item
                                value={option.value}
                                style={{ margin: 0 }}
                              />
                              <Text size="3">{option.label}</Text>
                            </label>
                          </Text>
                        </Box>
                      ))}
                    </Flex>
                  </RadioGroup.Root>

                  {field?.errors && (
                    <Text size="2" color="red">
                      {field.errors[0]}
                    </Text>
                  )}
                </Flex>
              </Card>
            );
          })}

          <Box mt="4">
            <Button type="submit" size="3" style={{ width: "100%" }}>
              Submit Assessment
            </Button>
          </Box>

          {actionData?.status === "success" && (
            <Card
              style={{ padding: "16px", backgroundColor: "var(--green-2)" }}
            >
              <Text size="3" color="green" weight="medium">
                Assessment submitted successfully! Check the console for
                answers.
              </Text>
            </Card>
          )}
        </Flex>
      </Form>
    </Box>
  );
};

export default Assessment;
