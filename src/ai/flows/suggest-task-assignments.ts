'use server';

/**
 * @fileOverview An AI agent for suggesting task assignments based on member workload.
 *
 * - suggestTaskAssignments - A function that suggests task assignments.
 * - SuggestTaskAssignmentsInput - The input type for the suggestTaskAssignments function.
 * - SuggestTaskAssignmentsOutput - The return type for the suggestTaskAssignments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTaskAssignmentsInputSchema = z.object({
  taskDescription: z.string().describe('The description of the task to be assigned.'),
  groupMembers: z
    .array(z.object({name: z.string(), currentWorkload: z.number().nonnegative()}))
    .describe('The group members and their current workload.'),
});

export type SuggestTaskAssignmentsInput = z.infer<typeof SuggestTaskAssignmentsInputSchema>;

const SuggestTaskAssignmentsOutputSchema = z.object({
  suggestedAssignments: z
    .array(z.object({memberName: z.string(), rationale: z.string()}))
    .describe('The suggested task assignments with rationale for each member.'),
});

export type SuggestTaskAssignmentsOutput = z.infer<typeof SuggestTaskAssignmentsOutputSchema>;

export async function suggestTaskAssignments(
  input: SuggestTaskAssignmentsInput
): Promise<SuggestTaskAssignmentsOutput> {
  return suggestTaskAssignmentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTaskAssignmentsPrompt',
  input: {schema: SuggestTaskAssignmentsInputSchema},
  output: {schema: SuggestTaskAssignmentsOutputSchema},
  prompt: `You are an AI task assignment assistant. Given a task description and the current workload of group members, suggest the best task assignments.

Task Description: {{{taskDescription}}}

Group Members and Workload:
{{#each groupMembers}}
- Name: {{{name}}}, Workload: {{{currentWorkload}}}
{{/each}}

Suggest task assignments, providing a rationale for each assignment. Ensure that the suggested assignments are optimized to balance the workload across all members.

Format your response as a JSON array of objects, where each object has 'memberName' and 'rationale' fields.
`, // Ensure valid JSON format
});

const suggestTaskAssignmentsFlow = ai.defineFlow(
  {
    name: 'suggestTaskAssignmentsFlow',
    inputSchema: SuggestTaskAssignmentsInputSchema,
    outputSchema: SuggestTaskAssignmentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
