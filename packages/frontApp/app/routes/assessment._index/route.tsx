import { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import assessmentLoader from "./loader";

import { Heading, Button, Box, Flex, Text, Card, Grid } from "@radix-ui/themes";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "dododo Assessment" },
    { name: "description", content: "Choose your assessment" },
  ];
};

export const loader = assessmentLoader;

const Assessment = () => {
  const { availableSkills, assessmentData } = useLoaderData<typeof loader>();

  return (
    <Box p="6" maxWidth="1200px" mx="auto">
      <Box mb="8" style={{ textAlign: "center" }}>
        <Heading as="h1" size="8" mb="4">
          Choose Your Assessment
        </Heading>
        <Text size="4" color="gray">
          Select a skill category to begin your personalized assessment
        </Text>
      </Box>

      <Grid columns={{ initial: "1", md: "2", lg: "3" }} gap="6">
        {availableSkills.map((skill: string) => {
          const skillData =
            assessmentData[skill as keyof typeof assessmentData];
          const questionCount = Array.isArray(skillData) ? skillData.length : 0;

          return (
            <Card key={skill}>
              <Flex direction="column" gap="4" height="100%" p="4">
                <Box>
                  <Heading
                    as="h3"
                    size="5"
                    mb="2"
                    style={{ textTransform: "capitalize" }}
                  >
                    {skill} Assessment
                  </Heading>
                  <Text size="3" color="gray" mb="4">
                    {questionCount} questions designed to evaluate your {skill}{" "}
                    skills and understanding
                  </Text>
                </Box>

                <Box style={{ marginTop: "auto" }}>
                  <Flex direction="column" gap="3">
                    <Text size="2" color="gray">
                      ⏱️ Estimated time: {Math.ceil(questionCount * 0.5)}{" "}
                      minutes
                    </Text>
                    <Text size="2" color="gray">
                      📊 {questionCount} multiple choice questions
                    </Text>
                  </Flex>

                  <Box mt="4">
                    <Link
                      to={`/assessment/${skill}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Button size="3" style={{ width: "100%" }}>
                        Start {skill} Assessment
                      </Button>
                    </Link>
                  </Box>
                </Box>
              </Flex>
            </Card>
          );
        })}
      </Grid>

      {availableSkills.length === 0 && (
        <Card style={{ padding: "48px", textAlign: "center" }}>
          <Text size="4" color="gray">
            No assessments available at this time.
          </Text>
        </Card>
      )}
    </Box>
  );
};

export default Assessment;
