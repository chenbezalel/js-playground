# AI review of the spec, round 1

> Done by a fresh AI agent (subagent) on 2026-11-18, with Chen's prompt below. The agent only read `product-spec.md`.
> Decisions are in the "Decision" column, made by Chen.

## The prompt (written by Chen)

1. Goal: I want you to check the specification document that I create and Let me know if I missed anything, if something is unclear, if there are edge cases I didn't consider, potential flaws I didn't list, or ways to improve and streamline the food diary that I haven't thought of.
2. Context: This is an app for managing a food diary. Each day, the user logs the meals they consume; they are allotted a specific number of "stars" to use daily, red stars for carbohydrates, and yellow stars for fats and proteins—with each food item assigned a corresponding star value. The dietitian reviews the diary and provides daily feedback. I am the developer of the app. The draft of the spec is in spec/product-spec.md. It is for the MVP (first version).
3. Constraints: I dont want you to edit or change the file. only read and give me a feedback according to what i asked you. dont tell me how to do the changes, only what need to do. Use simple English, with short sentences.
4. Create an organized list of all the points and prioritize them—no more than 20 points in total. Separate the problems from the ideas. For each point write: Problem (which section) / Why it matters / Suggestion.

## Summary of the points

| # | Point | Priority | Decision |
|---|---|---|---|
| 1 | Calories or stars? The story talks about calories, the app is built on stars | High | **Accept.** Stars are the main unit, calculated from calories (table in rules). |
| 2 | Snapshot rule (5.2) vs future-meal rule (5.4): when is the copy taken? | High | **Reject** the contradiction: the past does not change, the future does. Wording clarified: the copy is taken when the meal time arrives. |
| 3 | Only one user story and one use case. Pain points, dashboard, admin catalog, "create a saved meal" have none | High | **Accept.** To write (next session). |
| 4 | Login, roles and privacy are missing (who sees which diary, delete account) | High | **Accept.** To write (next session). |
| 5 | No flow to edit or delete a meal. What if she edits after the dietitian's feedback? | High | **Accept.** The user can edit. The dietitian is not told about the change. If it is important, the user adds a note (the dashboard shows new notes; notifications later). |
| 6 | A food that is not in the catalog: what does the user do? | High | **Accept.** The user can add a new food. It goes only to her own personal catalog. |
| 7 | Half portions: which fractions, rounding, half-red half-yellow | High | **Accept.** Any portion is allowed. Stars are always in steps of 0.5. For a portion we calculate calories first, then use the star table (no separate rounding rule). |
| 8 | Over quota: warn or block? Which quota? Old days keep the old quota? | High | **Accept.** Warn, do not block (when to warn: open question). Each day keeps a snapshot of its quota. |
| 9 | Day boundary and time zone (a meal at 00:30) | Medium | **Accept.** The day changes at 00:00, in the phone's local time. The user can move a meal to another day by hand. |
| 10 | Dietitian success metric has no number. What is "reviewed"? | Medium | **Accept.** Open questions: feedback vs a checkbox; ask a real dietitian for the baseline. |
| 11 | Daily review rule: weekends, empty days, late dietitian | Medium | **Accept.** Set work days, she closes the backlog when back, empty days are not counted. How to close the backlog well: open question. |
| 12 | A meal can be saved twice in the MVP too (double click, retry) | Medium | **Accept.** Added as an MVP edge case. |
| 13 | Saved meals when the catalog changes | Medium | **Accept.** The saved meal is updated. A one-time notification later. Deleting a food: open question. |
| 14 | Vague pain points (filter what? fast = how fast? favorites vs saved meals) | Low | **Accept.** Filter and sort foods. Search under 1 second. Favorite food vs saved meal defined in Terms. Technical guess moved to Technical notes. |
| 15 | Mixed terms (meal / food / kind), her / himself, missing NFRs (mobile, Hebrew RTL) | Low | **Accept.** Terms section added. "The user" / "he". NFRs: mobile first, Hebrew RTL. |
| 16 | Idea: show stars left for today | Idea | **MVP.** |
| 17 | Idea: recent foods, copy a meal or a day from yesterday | Idea | **Reject** recent foods (covered by suggestions by meal kind, 3.2). **MVP:** copy a meal or a day from any day; the copy gets today's stars. |
| 18 | Idea: dashboard order (over quota, not logged, left a note, not reviewed first) | Idea | **Later.** |
| 19 | Idea: feedback templates, notifications | Idea | **MVP.** (Changes points 5 and 13: notifications are now in the MVP.) |
| 20 | Idea: smaller MVP (move future meals out), mark blocking open questions | Idea | **Reject:** meal planning stays in the MVP. The user should log a meal any time he wants. The price (more rules and tests) is known. Marking blockers: next session. |

## Full answer of the agent

### Part A: Problems

#### High priority

**1. Calories or stars?**
- **Problem (3.1, 4.1, 6):** The user story and its acceptance criteria talk about calories. The app is built on stars. The postcondition in 4.1 talks about stars. These do not match.
- **Why it matters:** A developer won't know what to build or test. Should the day total show calories, stars, or both?
- **Suggestion:** Choose one main unit and use it everywhere. Say whether calories are shown at all.

**2. The snapshot rule and the future-meal rule conflict**
- **Problem (5.2 vs 5.4):** Rule 2 says a logged meal keeps a copy of its stars. Rule 4 says a future meal updates when the stars change. Both are logged meals.
- **Why it matters:** This is a direct contradiction. The code can follow only one rule.
- **Suggestion:** Say exactly when the copy is taken: when the meal is logged, or at the meal's time. Then check that rules 2 and 4 agree.

**3. Core features have no user stories or use cases**
- **Problem (1, 2, 3, 4):** There is only one user story and one use case. Most pain points are not covered: saved meals, favorites, half portions, search, filter, the quota warning. The dietitian dashboard, the dietitian's feedback and the admin catalog have none either. Use case 4.1 assumes a saved meal exists, but no flow creates one.
- **Why it matters:** Anything without a story and acceptance criteria will be built by guessing, or forgotten.
- **Suggestion:** Each pain point and each user type needs at least one story with acceptance criteria. That includes "create a saved meal" and the empty state when there are no saved meals yet.

**4. Login, roles and privacy are missing**
- **Problem (2, 8):** The spec does not cover: sign up, log in or password reset; how a dietitian account is created and checked; how a user connects to a dietitian (an open question); who can see which diary; whether a user can delete her account and data.
- **Why it matters:** This is health data. Permissions are part of the MVP, not an extra. Several open questions block the data design.
- **Suggestion:** Write down who sees what, for each role. Answer the blocking open questions before building.

**5. Editing and deleting meals**
- **Problem (3, 4, 5):** There is no flow to edit or delete a meal. It is also not clear how far back a user can log or change meals. What happens if she changes a day after the dietitian already wrote feedback?
- **Why it matters:** Users make mistakes all the time. If she edits after feedback, the feedback may be about data that changed.
- **Suggestion:** Define edit and delete. Define any time limit. Define what the dietitian sees when a day changes after her review.

**6. A food that is not in the catalog**
- **Problem (2 Admin, 3):** Only the admin manages the catalog. What does the user do when she can't find a food?
- **Why it matters:** This will happen in the first days of use. If she can't log a food, the diary is wrong and she may stop using the app.
- **Suggestion:** Decide what happens in the MVP when a food is not found. Write it as an alternative flow.

**7. Half portions and fractions are not defined**
- **Problem (1, pain point 6; and 6):** "Half pizza = 2 red, 1/2 yellow" means stars can be fractions. The spec does not say: which fractions are allowed (1/2, 1/4, any number); how numbers are rounded; how a half-red, half-yellow food counts toward each quota.
- **Why it matters:** Totals and quotas depend on this. Wrong rounding gives a wrong "over quota" result.
- **Suggestion:** Add a business rule for portion size, the smallest fraction and rounding.

**8. Going over the quota is not defined**
- **Problem (1, pain point 5; and 6):** The spec says there is no indication today, but not what the new app should do: warn the user, or block her? Check the total, red only, yellow only, or all three? When the quota changes, do old days keep their old quota?
- **Why it matters:** The dashboard question "did she eat more than her quota" needs the quota that was valid on that day. Without a rule, history changes when the quota changes.
- **Suggestion:** Define the over-quota behavior. Decide whether quotas get a snapshot, like stars do.

#### Medium priority

**9. Day boundary and time zone**
- **Problem (3.1 notes; and 6):** A meal at 00:30 belongs to which day? What if the user travels? What if the dietitian is in another time zone? "The day before" depends on all of this.
- **Why it matters:** A meal can land on the wrong day. Then the totals, the quota check and the dashboard are all wrong.
- **Suggestion:** Define what a "day" is and whose time zone sets it.

**10. The dietitian's success metric has no number**
- **Problem (1, Success 2):** The user metric has a number (5 seconds). The dietitian metric only lists what the screen shows. It also does not define "reviewed".
- **Why it matters:** You can't know if the goal was met. The goal was to save her time.
- **Suggestion:** Add a measurable target for the dietitian. Define when a client counts as "reviewed".

**11. The daily review rule is not realistic**
- **Problem (6):** "The dietitian must review each client every day." There is no rule for: weekends, holidays or a sick day; a day when the client logged nothing; a dietitian who is late.
- **Why it matters:** A "must" rule needs a case for when it is broken. Otherwise the dashboard keeps showing old days without end.
- **Suggestion:** Define what happens with missed reviews and with empty days.

**12. A meal can be saved twice in the MVP**
- **Problem (4.1 flow 4c; and 7):** The spec raises idempotency only for offline support. But the MVP has the same risk: a double click, or a retry after the server saved the meal but the reply was lost.
- **Why it matters:** The same meal is counted twice, and the quota check is wrong.
- **Suggestion:** Add this as an edge case in the MVP, not only in "Out of scope".

**13. Saved meals after the catalog changes**
- **Problem (5):** Rule 2 protects meals that were already eaten. It does not say what happens to a saved meal (a template) when the admin changes or deletes a food inside it.
- **Why it matters:** The next time she uses the saved meal, it may have old stars or a deleted food.
- **Suggestion:** Add an edge case for saved meals when the catalog changes.

#### Low priority

**14. Some pain points are vague**
- **Problem (1, pain points 1, 3, 4):** The spec does not say: what to filter or sort (foods, meals, days); what "fast search" means as a number; how "favorites" are different from "saved meals". Pain point 3 also names a suspected technical cause inside a product spec.
- **Why it matters:** Vague needs can't be tested. The technical guess may be wrong.
- **Suggestion:** Write each one as a need you can measure. Keep the technical guess for the technical design.

**15. Unclear terms and mixed words**
- **Problem (whole document):** "Meal", "food", "kind of meal" and "kind of food" are used in a mixed way. The user is sometimes "her" and sometimes "himself" (6). Non-functional needs are also missing: mobile or desktop, Hebrew and RTL, speed.
- **Why it matters:** Readers may understand the same word in different ways, and so may an AI that uses this spec as context.
- **Suggestion:** Add a short list of terms (meal, food item, saved meal, portion, kind). Use one form for the user. Add a short list of non-functional needs.

### Part B: Ideas

**16. Stars left for today**
- **Problem (1, pain point 5):** The user only sees what she already ate.
- **Why it matters:** Showing what is left helps her decide before she eats, not after.
- **Suggestion:** Show the red and yellow stars that are left for today, all the time.

**17. Faster logging: recent foods and copy**
- **Problem (1, Success 1):** Saved meals help, but people also repeat foods or whole days without saving them.
- **Why it matters:** This goes straight to the goal of less time in the app.
- **Suggestion:** Consider a "recent foods" list and "copy a meal or a day from yesterday".

**18. A smart order for the dashboard**
- **Problem (2, Dietitian; and 1, Success 2):** With 30 clients, a flat list is still slow.
- **Why it matters:** She should see first the clients who need her most.
- **Suggestion:** Show first the clients who went over quota, did not log, left her a note, or were not reviewed yet. Let her filter by these.

**19. Feedback templates and notifications**
- **Problem (2, Dietitian and User):** Writing 30 notes a day takes time. The user also doesn't know when feedback arrives.
- **Why it matters:** This saves the dietitian time and keeps the user involved.
- **Suggestion:** Consider short ready-made feedback templates. Consider a notification when feedback arrives, and a reminder when the user has not logged.

**20. Make the MVP smaller and decide the blockers first**
- **Problem (5.4, 7, 8):** Future-meal planning adds hard rules (points 2 and 8), but it is not a core pain point. Some open questions block the design: which quota wins, how a user connects to a dietitian, who sees old diaries.
- **Why it matters:** A smaller MVP ships sooner. Blocking questions left open become rework later.
- **Suggestion:** Consider moving future-meal planning to "Out of scope". Mark which open questions must be answered before building.
