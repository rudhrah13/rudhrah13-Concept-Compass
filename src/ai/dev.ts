import { config } from 'dotenv';
config();

import '@/ai/flows/generate-feedback.ts';
import '@/ai/flows/evaluate-concept.ts';
import '@/ai/flows/get-student-feedback.ts';
import '@/ai/flows/get-concept-overview.ts';
import '@/ai/flows/get-student-profile.ts';
