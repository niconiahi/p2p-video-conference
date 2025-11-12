import * as v from "valibot";

export const OfferEventSchema = v.object({
  type: v.literal("offer"),
  sender: v.string(),
  sessionDescription: v.string(),
});
export type OfferEvent = v.InferOutput<typeof OfferEventSchema>;

export const AnswerEventSchema = v.object({
  type: v.literal("answer"),
  sender: v.string(),
  sessionDescription: v.string(),
});
export type AnswerEvent = v.InferOutput<typeof AnswerEventSchema>;

export const CandidateEventSchema = v.object({
  type: v.literal("candidate"),
  sender: v.string(),
  candidate: v.string(),
});
export type CandidateEvent = v.InferOutput<typeof CandidateEventSchema>;

export const GatheredEventSchema = v.object({
  type: v.literal("gathered"),
  sender: v.string(),
});
export type GatheredEvent = v.InferOutput<typeof GatheredEventSchema>;

export const EventSchema = v.variant("type", [
  OfferEventSchema,
  AnswerEventSchema,
  CandidateEventSchema,
  GatheredEventSchema,
]);
export type Event = v.InferOutput<typeof EventSchema>;
