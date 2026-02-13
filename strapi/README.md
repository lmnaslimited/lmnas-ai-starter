# Strapi backend for Benefit Creator questions

This folder contains the Strapi content-type setup needed to manage guided questions for Benefit Creators in LMNAs AI Revenue Platform.

## Implemented task

- **TASK-008**: Create Strapi backend for Benefit Creator question management.

## Content type

A `benefit-question` collection type is defined at:

- `src/api/benefit-question/content-types/benefit-question/schema.json`

### Fields

- `benefitType` (enum): links question to a specific benefit flow (e.g. `pipeline_audit`)
- `questionId` (string, unique): stable key consumed by the frontend
- `prompt` (text): question shown to the user
- `insight` (text): optional contextual helper text
- `order` (integer): ordering within the benefit flow
- `options` (json): selectable options (`id`, `label`, optional `next`)
- `nextQuestionId` (string): optional explicit next-step override
- `active` (boolean): toggle visibility

## How to use in Strapi

1. Create or open your Strapi project.
2. Copy the `src/api/benefit-question` folder into the Strapi project `src/api` directory.
3. Start Strapi and run any pending migrations/build.
4. In Strapi Admin, add entries for each benefit flow and publish them.

## Suggested API query

```http
GET /api/benefit-questions?filters[benefitType][$eq]=pipeline_audit&filters[active][$eq]=true&sort[0]=order:asc
```

This lets the frontend render dynamically managed questions instead of hardcoded flow definitions.
