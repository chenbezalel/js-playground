# Product spec: Nutrition diary

> Written by Chen (week 2, session 5). Status: draft. Reviewed once by AI (see `ai-review-1.md`).

## 1. Problem and goal

**Problem:** The user spends a lot of time logging meals in the diary. The dietitian has many diaries to check every day (for example: 30 clients).

**Goal:** Decrease the time the user and the dietitian spend in the app, and help the user stay inside his quota.

**Success:**

1. User: logging a saved meal takes 5 seconds or less. (Baseline today: about 15 seconds for my usual breakfast.)
2. User: logging a new meal (not saved) with 3 foods takes 15 seconds or less. (Baseline today: about 20 seconds, because I search each food separately.)
3. Dietitian: in one screen (a dashboard), she sees for each client:
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

### Dietitian manager (operational user)

- Connects each user to a dietitian (manual matching in the MVP).
- Can see the health info that a user chose to share (for example: pregnancy), to choose a fitting dietitian.

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

### 3.2 Suggestions by meal kind (user, Must, story 2)

As a user, I want to see suggestions by meal kind,
so that I spend minimum time to log a meal in the diary.

The idea: when I log lunch, the foods I often eat at lunch (for example: rice) show first in the list. Rice should not show first at breakfast. Simple version: count how many times each food was logged in each meal kind.

Acceptance criteria (first draft by AI, reviewed by me):

1. When the user logs lunch, the foods he logged most at lunch show first.
2. The suggestions are personal: they are based only on this user's own diary, not on what other users eat.

### 3.3 More MVP features (from the AI review, ideas)

- Show the red and yellow stars left for today, all the time.
- Copy a meal or a full day from any day. A copied meal is a new meal, so it gets today's stars from the catalog.
- Dietitian: ready-made feedback templates.
- Notifications: a new note (user to dietitian, dietitian to user), a saved meal that changed (one time).
- Meal planning: log meals for the future. Price: more rules to build and test (see edge cases 2 and 4, and open questions).

### 3.4 Create a saved meal (user, Must, story 1)

As a user, I want to create a saved meal,
so that I can choose the meal and log it to the diary, instead of choosing each food of the meal separately.

Acceptance criteria:

1. Empty state: when the saved meals list is empty, the user sees a message that says the list is empty, and an option to add a meal.
2. When the user opens the food catalog, he sees a "create new meal" button.
3. To create a saved meal, the user adds all the foods of the meal, and must give the meal a name.
4. After saving, the user sees a "success" message, and the meal shows in the saved meals list with: its name, its foods with their portions and stars, and the total stars of the meal.
5. If a food inside the meal changes (for example: the admin changes its stars), the saved meal changes too, and the user sees a mark on the saved meal that it was updated. (Not a notification: notifications are not Must.)

### 3.5 Who sees which diary (user, Must, story 14)

As a user, I want only me and my dietitian to see my diary,
so that it stays private.

Acceptance criteria:

1. I can see my diary.
2. A dietitian can see only the diaries of the users she is responsible for now (her current clients).
3. A user cannot see the diary of another user.
4. The admin cannot see the diaries. The dietitian manager cannot see the diaries either (MVP).
5. When a user moves to a new dietitian, the new dietitian can see all his diary, also the days from before. (Like a doctor who sees my medical history: it helps her learn about the user.)
6. The same rule for the notes: the new dietitian can see the old notes (she is now responsible for his nutrition). The old dietitian cannot see the diary or the notes anymore (she is not his dietitian, so she has no permission).

### 3.6 Dietitian dashboard (dietitian, Must, story 8)

As a dietitian, I want a dashboard that shows all the users I am responsible for,
so that I can save time and do not need to open all the diaries separately.

Acceptance criteria:

1. The dashboard shows which users went over their quota yesterday.
2. The dashboard shows which users are missing feedback from me about yesterday.
3. If a user's diary is empty, the dashboard shows that I do not need to give him feedback.
4. On my first work day after days off (for example: Sunday), the dashboard shows, for each user, all the days that are missing feedback, not only yesterday.

### 3.7 Write feedback (dietitian, Must, story 9)

As a dietitian, I need to give feedback to each user about the day before,
so that I can properly keep track of his food diary.

Acceptance criteria:

1. The user sees in his diary, on the relevant day, the feedback that his dietitian added.
2. The dietitian writes the feedback and sends it. Then the dashboard shows this user as reviewed. (A user is "reviewed" when the feedback is sent. No separate "I checked" checkbox.)
3. After sending, the dietitian can edit her feedback (for example: to fix a typo).

Notes:

- Feedback templates are not Must: at first, the dietitian writes the feedback by herself.

### 3.8 Search, filter and sort foods (user, Must, story 4)

As a user, I want to search, sort and filter foods,
so that I spend minimum time to log a meal in the diary.

Acceptance criteria (first draft by AI, reviewed by me):

1. Search results show in less than 1 second.
2. The user can sort foods by name and by stars.
3. The user can filter foods by number of stars, and by category (for example: saved meals, breads, proteins). Foods are divided into categories from the start, so that filtering is possible. (Favorites come later, with story 3.)

Notes:

- The AI draft had "the search uses debounce of 300 ms". Deleted: it is an implementation detail, and the user cannot check it. What the user can check is AC 1.

### 3.9 Manage the food catalog (admin, Must, story 11)

As an admin, I want to manage the food catalog,
so that it stays organized and reliable.

Acceptance criteria (first draft by AI, reviewed by me):

1. The admin can add, edit and delete a food. He enters the calories, and the system calculates the stars (see the star table in section 6).
2. When the admin changes a food, past meals do not change. Future meals and saved meals are updated (see edge cases 2, 4 and 11).

Notes:

- The admin does not need to type every food from zero. We can import foods from an existing food database (seed data), for example: the Israeli Ministry of Health database ("Tzameret"), Open Food Facts, or USDA FoodData Central. The admin then manages and fixes the catalog (Hebrew names, categories, mistakes). The stars are still calculated from calories. See open questions.

### 3.10 Give roles (admin, Must, story 12)

As an admin, I want to give roles,
so that I can make sure that each person is exposed only to the information they are authorized to access.

Acceptance criteria (first draft by AI, reviewed by me):

1. The admin can give each person a role: user, dietitian or dietitian manager.
2. A person can have more than one role. (Edge case: a dietitian can also be a user and keep her own diary.)

Notes:

- The AI draft had "the admin can open the diary of any user, to check the role". Deleted: the admin cannot see diaries (see 3.5).

### 3.11 Sign up, log in, password reset (user, Must, story 13)

As a user, I want to sign up, log in and reset my password,
so that only I can see my information (data security).

Acceptance criteria (first draft by AI, reviewed by me):

1. The user signs up with email and password.
2. The user stays logged in, and does not need to log in again every time.
3. If the user forgets his password, he gets a link by email to choose a new one.

Notes:

- The AI draft had "the password is saved in localStorage, so the user does not need to log in again". The need is OK, the "how" is not: data in the browser can be read by any script on the page (XSS). How to keep the user logged in is for the technical design (week 8).

### Priority (MoSCoW)

**Must, foundation** (without these there is no app):

- 11 Admin: manage the food catalog. Without foods, the user cannot log anything.
- 12 Admin: give roles. Without roles, the app cannot work.
- 13 Sign up / log in / password reset. Logging in comes before logging in the diary.
- 14 Who sees which diary.

**Must, to reach the goals** (see Success):

- Goals 1 and 2 (logging time): 1 Create a saved meal, 2 Suggestions by meal kind, 4 Search, filter and sort foods.
- Goal 3 (dietitian): 8 Dashboard, 9 Write feedback.

**Not Must** (the app works without them, but less well): 3 Favorite foods, 5 Quota warning, 6 Stars left today, 7 Copy a meal or a day, 10 Notifications, 15 Delete account and data, feedback templates.

### More stories to write (from the AI review, points 3 and 4)

All Must stories are written. Not Must stories (later): favorite foods, quota warning, stars left today, copy a meal or a day, notifications, delete account and data, feedback templates.

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
- Each food keeps its nutrition values per 100 grams, like on the label: calories, carbohydrates, protein and fat (grams). A portion is in grams (for example: a slice of pizza = its weight in grams), and the system calculates from the values per 100 grams.
- The red/yellow split comes from the nutrition values: carbohydrates = red, protein and fat = yellow. A food does not need one "kind" for the stars. The category (for example: breads, proteins) is only for the search filter.
- Stars of a food: first the total stars from the total calories (star table), then we split this total into red and yellow by the ratio. (Not each part separately: rounding each part can give a different total. Example, pizza per 100 g: 264 calories = 2.5 stars, but carbohydrates 130 calories = 1.5 and protein + fat 133 calories = 1.5, together 3.)
- Each user has a daily star quota, and inside it a quota for red and for yellow stars.
- Who sets the quota: the dietitian. If the user has no dietitian, the system gives a general recommendation based on gender, weight and sport activity. The user can also set the quota for himself.
- When the user has a dietitian, her quota wins: she is the professional, and the eating follows her decision. The user cannot change the quota. He can ask her (for example: in a note), and she decides.
- The permission to edit the quota depends on one thing: is the user connected to a dietitian? If he leaves his dietitian and has no dietitian now, he can edit his quota again. (Until he changes it, the last quota stays.)
- The general recommendation is not advice from a dietitian (show a disclaimer).
- Over quota: the system warns the user. It does not block him.
- The dietitian must review each client's diary of the day before, every day, and write some feedback.
  - The dietitian has set work days. When she is back (for example on Sunday), she must give feedback on the days she missed (the backlog).
  - Days with an empty diary are not counted.
- A day starts at 00:00, in the user's local time (the time of his phone).
- Connecting a user to a dietitian (MVP): the dietitian manager does it by hand. Later: automatic matching (see Out of scope).
- Health info (opt-in): on the first login, the user can mark from a list: pregnancy, breastfeeding, diabetes, vegan, athlete ... It is not required. If he shares, he checks a consent checkbox. Before he chooses, the app tells him who will see it: his own dietitian and the dietitian manager. If he does not share, he still gets a dietitian.
- Deleting a food from the catalog is a soft delete: the food is marked "deleted" and does not show in search anymore, but it is not really deleted. Past meals keep it (the past does not change). If the food is inside a saved meal, it is removed from the saved meal, and the user sees the "updated" mark on the saved meal (story 1, AC 5).
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
- Automatic matching of a user to a dietitian, by rules: the least busy dietitian, a dietitian with free places (capacity), or a fitting specialty (for example: pregnancy). The dietitian manager can still change the choice by hand.
- Support access: in the MVP the admin cannot see diaries (privacy, least privilege). Later: a support person can see a diary only with the user's consent, for a limited time, and every access is written in an audit log (who, when, why). The same for the dietitian manager, only when needed. For example: a user asks for a new dietitian because he is not happy with the feedback of the current one.

## 8. Open questions

**Blocker** = we must answer it before the data design (week 7), because the answer changes what we save in the tables.

### Blockers for the data design (week 7)

None left. All 8 blockers were answered on 2026-11-23 (see "Answered" below).

### Other open questions (not blockers)

- Red/yellow ratio: by grams (carbohydrates vs protein + fat) or by calories (carbohydrates x4 vs protein x4 + fat x9)? For the pizza it gives a different split (by grams: 1.5 red and 1 yellow; by calories: about half and half). And how to round when the split is not in steps of 0.5? **Ask a real dietitian (domain expert).** Not a blocker: both ways need the same data (grams per 100 g), only the calculation changes. (An AI tool in my star app gave 1.5 / 1, but an AI answer is not a source for a business rule.)
- Track grams of protein per day? (Nice to have, later.) Not a blocker anymore: we already save protein per food.
- What is the formula for the general recommendation?
- Over quota warning: when? While he logs the meal, or on the day summary?
- Dietitian success metric: how long does the daily check take her today (baseline)? Ask a real dietitian (user research).
- The dietitian comes back after days off: how can she close the backlog in an efficient way?
- Does a planned (future) meal count in today's quota before its time?
- Where do the first foods in the catalog come from? Import from an existing food database (which one? license? Hebrew?), or type by hand? Note: we cannot copy from a site like FoodsDictionary: its data is protected by copyright and terms of use. Prefer an official source that allows use (for example: "Tzameret").

### Answered

- Can the admin see a user's diary? **No** (story 14, 3.5). Support access with consent comes later (Out of scope).
- When a user changes dietitian: does the new one see the old diaries? **Yes**, all the days. The old one does not see the diary anymore (story 14, 3.5).
- And the notes? **The same rule:** the new dietitian sees the old notes, the old dietitian does not (story 14, AC 6).
- When is a client "reviewed"? **When the dietitian sends the feedback.** No separate checkbox (story 9, 3.7).
- If the admin fixes a mistake in the catalog (not a real change), should old meals change too? **MVP: no**, keep the simple rule "the past does not change".
- Can a person have more than one role? **Yes** (story 12, 3.10).
- How does a user get connected to a dietitian? Who decides? **MVP: the dietitian manager, by hand.** Automatic matching comes later (Out of scope). See business rules.
- The user set his own quota, then joins a dietitian who sets a different one. Which quota wins? **The dietitian's.** The user cannot edit it while he has a dietitian (see business rules).
- How do we split a food's stars into red and yellow? **From the nutrition values per 100 g**, total stars first, then split (see business rules). The exact ratio (grams or calories) is still open, but it is not a blocker.
- Old meals keep old stars. Should the diary show a small note when stars were updated (for example: "was 2, now 3")? **No**, it is not needed. (If we want it later, the data is already saved: the snapshot in the meal and the current stars in the catalog.)
- The admin deletes a food that is inside a saved meal. What happens? **Soft delete**: past meals keep the food, the saved meal loses it and shows the "updated" mark (see business rules).
- How to define the kind of a food that has several kinds (for example: pizza)? **Not needed for the stars**: the split comes from the nutrition values. The category is only for the search filter.

## Technical notes (for the technical design, not product requirements)

- Pain point 3 (slow search): my guess about the other app is no debounce, many calls to the server, and no caching. To check in the technical design.
