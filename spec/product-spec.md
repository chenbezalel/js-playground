# Product spec: Nutrition diary

> Written by Chen (week 2, session 5). Status: draft. Reviewed once by AI (see `ai-review-1.md`).

## 1. Problem and goal

**Problem:** The user spends a lot of time logging meals in the diary. The dietitian has many diaries to check every day (for example: 30 clients).

**Goal:** Decrease the time the user and the dietitian spend in the app, and help the user stay inside his quota.

**Success:**

1. User: logging a saved meal takes 5 seconds or less. (Baseline today: about 15 seconds for my usual breakfast.)
2. Dietitian: in one screen (a dashboard), she sees for each client:
   - Did the client eat more than his quota?
   - Did I already write feedback to this client?

### Pain points today (from my own use of a star-based diet app)

1. There is no category for favorite food.
2. There is no option to save a full meal and reuse it. For example: every morning I eat the same pita with the same cheese, in the same amount. I want to add the full meal at once.
3. Search is slow. (See Technical notes.)
4. There are no filter or sort options for foods.
5. When I pass my daily quota, there is no indication.
6. I cannot log part of a food. For example: a full pizza is 4 red and 1 yellow. When I eat half, I want it saved as 2 red and 1/2 yellow.

## Terms

- **User:** the end user who keeps the diary. In this spec: "the user" or "he".
- **Food:** one food item, for example a spelt pita. It has calories and stars.
- **Meal:** one food or more, eaten together. Each meal has a meal kind (breakfast, lunch, snack, dinner ...).
- **Saved meal:** a fixed meal that repeats many times, saved to log it again fast. For example: spelt pita, a slice of yellow cheese and a cup of coffee.
- **Favorite food:** a food that I add to many different meals. For example: spelt pita.
- **Star kind:** red stars (carbohydrates) or yellow stars (protein and fat).
- **Portion:** how much of a food I ate (for example: 1/3 pizza).

## 2. User types

Three groups (modules): end users, operational users, admin.

### User (end user)

- Logs his meals in the diary.
- Can add a note for his dietitian.

### Dietitian (operational user)

- Sees the diary of her clients.
- Adds notes with feedback to a client.
- Pain point: she must review 30 diaries every day. Idea: a dashboard (summary screen) of all her clients.

### Admin

- Gives each person a role (user or dietitian), with the permissions of that role.
- Manages the content: the food catalog (foods and their stars). Recipes come later (see Out of scope).

## 3. User stories

### 3.1 Log a meal (user)

As a user, I want to log all the meals I eat,
so that I can follow my calories, the kinds of food I eat, and the hours of each meal.

Acceptance criteria:

1. After I log a meal, it shows in the diary of that day, with its name, time and stars.
2. The meal is saved on the right day and hour. I can see the food name, its kind (for example: protein) and its stars.
3. After I log a meal, the total stars of that day is updated.

Notes:

- The default day and hour is "now". The user can change both (for example: log yesterday's dinner this morning).

### 3.2 Suggestions by meal kind (user, MVP)

_Story and acceptance criteria to write._ The idea: when I log lunch, the foods I often eat at lunch (for example: rice) show first in the list. Rice should not show first at breakfast. Simple version: count how many times each food was logged in each meal kind.

### 3.3 More MVP features (from the AI review, ideas)

- Show the red and yellow stars left for today, all the time.
- Copy a meal or a full day from any day. A copied meal is a new meal, so it gets today's stars from the catalog.
- Dietitian: ready-made feedback templates.
- Notifications: a new note (user to dietitian, dietitian to user), a saved meal that changed (one time).
- Meal planning: log meals for the future. Price: more rules to build and test (see edge cases 2 and 4, and open questions).

### More stories to write (from the AI review, points 3 and 4)

- Create a saved meal (and the empty state: no saved meals yet).
- Favorite foods. Search, filter and sort foods. Quota warning.
- Dietitian: dashboard, write feedback.
- Admin: manage the food catalog, give roles.
- Sign up, log in, password reset. Who sees which diary. Delete account and data.

## 4. Main use cases (full flow)

### 4.1 Log a saved meal

**Actor:** User

**Precondition:** The user is logged in, and is on the diary screen of the relevant day. He has a meal he saved before (for example: "my breakfast pita").

**Main flow:**

1. The user clicks "add meal".
2. He chooses the kind of meal (breakfast, lunch, ...).
3. He chooses the meal from his saved meals list.
4. He saves it to the diary.

**Alternative flows:**

- 4a. He needs to change the hour of the meal -> he clicks "edit time" before saving.
- 4b. He adds a note to his dietitian about the meal.
- 4c. The network or the server fails -> the system shows "The meal was not saved, try again". The meal is NOT shown as saved.

**Postcondition:** The meal is in the diary of that day, with its stars, and the day's total is updated.

## 5. Edge cases and failures

1. A dietitian leaves, joins, or is replaced -> the permissions are updated, the UI shows the new dietitian, and the quota is updated if the new dietitian changes it.
2. The admin changes the number of stars of a food -> meals that were already eaten do NOT change. The rule: the past does not change, the future does. Each meal keeps a copy (snapshot) of its stars, taken when the meal time arrives. Until then (a future meal, see 4), it follows the catalog.
3. The user logs a food with 0 stars (for example: water, black coffee) -> it is valid. The diary shows the food name without stars.
4. The user logs a future meal (planning). If the stars of that food change before the meal time -> the future meal is updated.
5. Saving a meal fails (network or server) -> see use case 4.1, flow 4c.
6. The user cannot find a food in the catalog -> he can add a new food. It is added only to his own personal catalog, not to the general catalog.
7. The user edits a meal of a past day, after the dietitian already wrote feedback -> allowed. The dietitian is not told about the edit. If it is important, the user adds a note, and the dietitian gets a notification about the note.
8. A meal at 00:30 -> the day changes at 00:00. If the user wants the meal on the day before, he changes the day by hand (and can add a note).
9. The user is abroad -> the day and hour follow the local time of his phone.
10. The same meal is sent twice (double click, or a retry after the server already saved it) -> it is saved only once.
11. The admin changes a food that is inside a saved meal -> the saved meal is updated (a saved meal is a template for the future, like a future meal). The user gets a one-time notification.
12. A day with an empty diary -> the dietitian does not need to give feedback on it.

## 6. Business rules

- Stars are the main unit of the diary. Red star = carbohydrates. Yellow star = protein and fat.
- Stars are calculated from calories, in steps of half a star:

  | Calories | Stars |
  |---|---|
  | 0–24 | 0 |
  | 25–74 | 0.5 |
  | 75–124 | 1 |
  | ... (every 50 calories = 0.5 star more) | ... |

- Portions have no limit: the user can log any part of a food (1/2, 1/3, 1/4 pizza ...).
- Stars are always in steps of 0.5. For a portion, we always calculate the calories first (for example: 1/3 of the pizza's calories), then use the star table above. The table already does the rounding.
- Each day keeps a copy (snapshot) of the quota that was valid on that day. If the quota changes, old days do not change (same rule as stars: the past does not change).
- A food can be half red and half yellow (for example: 2 spoons of some legumes).
- Each user has a daily star quota, and inside it a quota for red and for yellow stars.
- Who sets the quota: the dietitian. If the user has no dietitian, the system gives a general recommendation based on gender, weight and sport activity. The user can also set the quota for himself.
- The general recommendation is not advice from a dietitian (show a disclaimer).
- Over quota: the system warns the user. It does not block him.
- The dietitian must review each client's diary of the day before, every day, and write some feedback.
  - The dietitian has set work days. When she is back (for example on Sunday), she must give feedback on the days she missed (the backlog).
  - Days with an empty diary are not counted.
- A day starts at 00:00, in the user's local time (the time of his phone).
- The server is the source of truth. In the MVP we do not keep meals in the browser. If saving fails, the user sees a message and the meal is not shown as saved.

## Non-functional requirements (NFRs)

- Mobile first (also works on desktop).
- Hebrew, with RTL layout.
- Search: results show in less than 1 second.

## 7. Out of scope (not in the MVP)

Ideas for later versions:

- AI from a photo: take a picture of a plate, the AI returns the foods, amounts and total stars. The user can fix what it got wrong.
- AI from a recipe: send a recipe and the number of portions, the AI counts the stars per portion.
- AI from a food label: take a picture of a nutrition label, the system reads the calories (OCR) and counts the stars.
- In all three AI tools, the result can be added directly to the diary.
- Recipe bank: save recipes I liked, and add my own recipes.
- Offline support: if saving fails, keep the meal on the device and send it when the network is back. Needs a unique id per meal, so it is not saved twice (idempotency). Risk: data in the browser can be read by any script on the page (XSS), and health data is sensitive.
- Dashboard order: first the clients who went over quota, did not log, left a note, or were not reviewed. Filter by these.

## 8. Open questions

- How to define the kind of a food that has several kinds (for example: pizza)?
- Track grams of protein per day? (Nice to have.)
- The user set his own quota, then joins a dietitian who sets a different one. Which quota wins?
- What is the formula for the general recommendation?
- Old meals keep old stars. Should the diary show a small note when stars were updated (for example: "was 2, now 3"), so it does not look like a bug?
- If the admin fixes a mistake in the catalog (not a real change), should old meals change too? (MVP: no, keep the simple rule.)
- Over quota warning: when? While he logs the meal, or on the day summary?
- When is a client "reviewed"? When the dietitian writes feedback, or a separate checkbox "I checked"?
- Dietitian success metric: how long does the daily check take her today (baseline)? Ask a real dietitian (user research).
- The dietitian comes back after days off: how can she close the backlog in an efficient way?
- The admin deletes a food that is inside a saved meal. What happens to the saved meal?
- How do we split a food's stars into red and yellow? (By calories from carbohydrates vs protein and fat?)
- Can the admin see a user's diary? It is health data (privacy).
- How does a user get connected to a dietitian? Who decides?
- When a user changes dietitian: does the new one see the old diaries and notes? Can the old one still see them?
- Does a planned (future) meal count in today's quota before its time?

## Technical notes (for the technical design, not product requirements)

- Pain point 3 (slow search): my guess about the other app is no debounce, many calls to the server, and no caching. To check in the technical design.
