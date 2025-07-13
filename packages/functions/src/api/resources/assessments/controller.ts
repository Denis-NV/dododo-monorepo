import { Request, Response } from "express";

import { db, eq, and, AssessmentTable } from "@dododo/db";
import {
  createUpdateAssessmentRequestSchema,
  TAssessmentResponse,
} from "@dododo/core";

export const createUpdateAssessment = async (
  { body }: Request,
  res: Response<TAssessmentResponse>
) => {
  try {
    // Validate the request body
    const parsedBody = createUpdateAssessmentRequestSchema.safeParse(body);
    if (!parsedBody.success) {
      return res.status(400).json({
        error: "Invalid input",
      });
    }

    const { userId, version, assessment } = parsedBody.data;

    // Check if an assessment with the provided version already exists
    const [existingAssessment] = await db
      .select()
      .from(AssessmentTable)
      .where(
        and(
          eq(AssessmentTable.userId, userId),
          eq(AssessmentTable.version, version)
        )
      );

    // If assessment exists, check if it's locked
    if (existingAssessment) {
      if (existingAssessment.locked) {
        return res.status(409).json({
          error: "Assessment is locked and cannot be updated",
        });
      }

      // Update existing assessment (preserve existing locked status)
      const [updatedAssessment] = await db
        .update(AssessmentTable)
        .set({
          assessment,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(AssessmentTable.userId, userId),
            eq(AssessmentTable.version, version)
          )
        )
        .returning();

      if (!updatedAssessment) {
        return res.status(500).json({
          error: "Failed to update assessment",
        });
      }

      return res.status(200).json({
        assessment: updatedAssessment,
        message: "Assessment updated successfully",
      });
    } else {
      // Create new assessment (default locked to false)
      const [newAssessment] = await db
        .insert(AssessmentTable)
        .values({
          userId,
          version,
          assessment,
          locked: false,
        })
        .returning();

      if (!newAssessment) {
        return res.status(500).json({
          error: "Failed to create assessment",
        });
      }

      return res.status(201).json({
        assessment: newAssessment,
        message: "Assessment created successfully",
      });
    }
  } catch (error) {
    console.error("[ API ] Error creating/updating assessment:", error);

    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
