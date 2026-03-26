import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { db } from '@bullaris/db'
import { TRPCError } from '@trpc/server'

export const learningRouter = router({
  /**
   * List all published learning content.
   * Learning progress uses legitimate interest — no explicit consent required.
   */
  list: protectedProcedure.query(async () => {
    const content = await db.learningContent.findMany({
      orderBy: { publishedAt: 'desc' },
    })
    return content
  }),

  /**
   * Get the current employee's learning progress.
   */
  myProgress: protectedProcedure.query(async ({ ctx }) => {
    const progress = await db.learningProgress.findMany({
      where: { employeeId: ctx.employee.id },
      select: {
        id: true,
        contentId: true,
        completedAt: true,
      },
    })
    return progress
  }),

  /**
   * Mark a learning content item as complete.
   */
  markComplete: protectedProcedure
    .input(z.object({ content_id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify content exists
      const content = await db.learningContent.findUnique({
        where: { id: input.content_id },
      })

      if (!content) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Content not found' })
      }

      const progress = await db.learningProgress.upsert({
        where: {
          employeeId_contentId: {
            employeeId: ctx.employee.id,
            contentId: input.content_id,
          },
        },
        create: {
          employeeId: ctx.employee.id,
          contentId: input.content_id,
          completedAt: new Date(),
        },
        update: {
          completedAt: new Date(),
        },
      })

      return { success: true, data: progress }
    }),

  /**
   * Get a single content item.
   */
  getContent: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const content = await db.learningContent.findUnique({
        where: { id: input.id },
      })

      if (!content) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      return content
    }),

  // ── Courses ────────────────────────────────────────────────────────────────

  /**
   * List all published courses with enrollment status for the current employee.
   */
  listCourses: protectedProcedure.query(async ({ ctx }) => {
    const [courses, enrollments] = await Promise.all([
      db.course.findMany({ orderBy: { publishedAt: 'desc' } }),
      db.courseEnrollment.findMany({
        where: { employeeId: ctx.employee.id },
        select: { courseId: true, enrolledAt: true, completedAt: true },
      }),
    ])

    const enrollmentMap = new Map(enrollments.map((e) => [e.courseId, e]))

    return courses.map((course) => ({
      ...course,
      enrollment: enrollmentMap.get(course.id) ?? null,
    }))
  }),

  /**
   * Enroll in a course.
   */
  enroll: protectedProcedure
    .input(z.object({ course_id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const course = await db.course.findUnique({ where: { id: input.course_id } })
      if (!course) throw new TRPCError({ code: 'NOT_FOUND' })

      const enrollment = await db.courseEnrollment.upsert({
        where: {
          employeeId_courseId: {
            employeeId: ctx.employee.id,
            courseId: input.course_id,
          },
        },
        create: { employeeId: ctx.employee.id, courseId: input.course_id },
        update: {},
      })

      return { success: true, data: enrollment }
    }),

  /**
   * Mark a course as complete.
   */
  completeCourse: protectedProcedure
    .input(z.object({ course_id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const enrollment = await db.courseEnrollment.findUnique({
        where: {
          employeeId_courseId: {
            employeeId: ctx.employee.id,
            courseId: input.course_id,
          },
        },
      })

      if (!enrollment) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Not enrolled in this course' })
      }

      const updated = await db.courseEnrollment.update({
        where: { id: enrollment.id },
        data: { completedAt: new Date() },
      })

      return { success: true, data: updated }
    }),
})
