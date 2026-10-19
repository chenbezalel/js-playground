<div dir="rtl">

# מילון ראיונות

כל ערך בנוי מ: **הגדרה** · **דוגמה** · **למה זה חשוב** · **תשובה לראיון**.

## תוכן

**JavaScript**
- [Closure](#closure)
- [Hoisting ו-TDZ](#hoisting)
- [var / let / const](#var-let-const)
- [this](#this)
- [Arrow functions ו-this](#arrow-this)

**AI**
- [LLM ו-Agent](#llm-agent)
- [Context ו-Context window](#context)
- [System prompt ו-User prompt](#system-user-prompt)
- [Hallucination](#hallucination)
- [איך אני עובדת עם כלי AI](#ai-workflow)

**תהליכי עבודה**
- [Code review](#code-review)

---

<a id="closure"></a>
## Closure

**הגדרה:** פונקציה פנימית שזוכרת את המשתנים של הפונקציה החיצונית שבה היא נוצרה, וממשיכה לגשת אליהם גם אחרי שהפונקציה החיצונית סיימה לרוץ.

**דוגמה:**

</div>

```js
function makeCounter() {
  let count = 0;
  return () => ++count;
}
const c1 = makeCounter();
const c2 = makeCounter();
c1(); c1(); c2();   // 1, 2, 1
```

<div dir="rtl">

כל קריאה לפונקציה החיצונית יוצרת סביבה חדשה. לכן לכל מונה יש משתנה משלו.

**למה זה חשוב:**
- **פרטיות נתונים:** אי אפשר לשנות את המונה מבחוץ, רק דרך הפונקציה.
- **בשימוש יומיומי:** כל event handler ב-React שמשתמש ב-state הוא closure. גם debounce ו-throttle מבוססים על closure.

**תשובה לראיון:**
> closure זה כשפונקציה פנימית זוכרת את המשתנים של הפונקציה החיצונית שבה היא נוצרה, וממשיכה לגשת אליהם גם אחרי שהפונקציה החיצונית סיימה לרוץ. למשל, פונקציה שמייצרת מונה: כל קריאה אליה יוצרת סביבה חדשה עם מונה משלה, ושני מונים לא משפיעים אחד על השני. זה חשוב קודם כל לפרטיות, כי את המונה אי אפשר לשנות מבחוץ. ובפועל אני משתמשת בזה כל הזמן: כל event handler ב-React שמשתמש ב-state הוא closure, וגם debounce מבוסס על closure.

---

<a id="hoisting"></a>
## Hoisting ו-TDZ

**הגדרה:** לפני שהקוד רץ, המנוע עובר עליו ורושם בזיכרון את כל ההצהרות על משתנים ופונקציות.
- משתנה `var` נרשם ומאותחל ל-`undefined`.
- משתנה `let` או `const` נרשם אבל לא מאותחל. עד השורה שבה הוא מוצהר, הוא נמצא ב-**Temporal Dead Zone** (TDZ), וכל גישה אליו זורקת שגיאה.
- הצהרת פונקציה (function declaration) נרשמת במלואה, ולכן אפשר לקרוא לה עוד לפני השורה שבה היא כתובה.

**דוגמה:**

</div>

```js
console.log(a);   // undefined
console.log(b);   // ReferenceError: Cannot access 'b' before initialization
var a = 1;
let b = 2;
```

<div dir="rtl">

**למה זה חשוב:** עם `var` באג יכול לעבור בשקט, כי מקבלים `undefined` ולא שגיאה. עם `let` ו-`const` מקבלים שגיאה ברורה, וזו אחת הסיבות שמשתמשים בהם.

**תשובה לראיון:**
> hoisting זה שהצהרות על משתנים ופונקציות נרשמות בזיכרון לפני שהקוד רץ. משתנה var מאותחל ל-undefined, ולכן אפשר לגשת אליו לפני השורה שבה הוא מוצהר בלי לקבל שגיאה. משתנה let או const נמצא ב-Temporal Dead Zone עד השורה שבה הוא מוצהר, וגישה אליו זורקת ReferenceError. לכן עדיף let ו-const: שגיאה ברורה עדיפה על undefined שקט.

---

<a id="var-let-const"></a>
## var / let / const

| | var | let | const |
|---|---|---|---|
| Scope | פונקציה | בלוק | בלוק |
| Hoisting | מאותחל ל-undefined | TDZ | TDZ |
| אפשר להציב ערך חדש | כן | כן | לא |

<b>שימי לב:</b> משתנה `const` לא אומר שהערך לא משתנה. אי אפשר להציב בו ערך חדש, אבל אפשר לשנות את התוכן של אובייקט או מערך שהוא מחזיק.

**הדוגמה הקלאסית בראיונות:**

</div>

```js
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i));  // 3 3 3
for (let j = 0; j < 3; j++) setTimeout(() => console.log(j));  // 0 1 2
```

<div dir="rtl">

עם `var` יש משתנה **אחד** לכל הלולאה. עם `let` נוצר משתנה **חדש בכל סיבוב**. הפונקציות שהועברו ל-setTimeout רצות רק אחרי שהלולאה מסתיימת, ולכן עם `var` כולן רואות את הערך האחרון.

**תשובה לראיון:**
> var שייך לפונקציה, ו-let ו-const שייכים לבלוק. בלולאה עם var יש משתנה אחד משותף, ולכן callbacks שרצים אחרי הלולאה יראו כולם את הערך האחרון. עם let נוצר משתנה חדש בכל סיבוב, וכל callback זוכר את שלו. const זהה ל-let, רק שאי אפשר להציב בו ערך חדש. ברירת המחדל שלי היא const, ו-let רק כשצריך לשנות ערך.

---

<a id="this"></a>
## this

**הגדרה:** בפונקציה רגילה, `this` נקבע **ברגע הקריאה**, לפי מה שנמצא משמאל לנקודה.

</div>

```js
user.regular();          // this = user
const fn = user.regular;
fn();                    // this lost (undefined in strict mode)
```

<div dir="rtl">

**ארבעת הכללים, מהחזק לחלש:**
1. קריאה עם `new`: הערך של `this` הוא האובייקט החדש.
2. קריאה עם `call`, `apply` או `bind`: הערך של `this` הוא מה שהועבר.
3. קריאה עם נקודה (`obj.fn()`): הערך של `this` הוא `obj`.
4. קריאה רגילה (`fn()`): הערך הוא `undefined` במצב strict, או `window` בקוד ישן.

**תשובה לראיון:**
> בפונקציה רגילה this נקבע לפי איך שהפונקציה נקראת, ולא לפי איפה שהיא נכתבה. אם קוראים לה דרך אובייקט, this הוא האובייקט. אם מעבירים אותה כ-callback או שומרים אותה במשתנה, this אובד. אפשר לקבע אותו עם bind, או להשתמש ב-arrow function.

---

<a id="arrow-this"></a>
## Arrow functions ו-this

**הגדרה:** ל-arrow function אין `this` משלה. היא לוקחת את `this` מהסביבה שבה היא **נכתבה**.

**המלכודת:** הסוגריים המסולסלים של אובייקט הם **לא** סביבה (scope).

</div>

```js
const user = {
  name: "Noa",
  arrow: () => console.log(this.name),    // NOT Noa: written directly in the object
  greet() {
    setTimeout(() => console.log(this.name));  // Noa: written inside a method
  },
};
```

<div dir="rtl">

**מתי להשתמש:** callbacks בתוך מתודות, כשרוצים לשמור על `this`.
**מתי לא להשתמש:** כמתודה של אובייקט.

**תשובה לראיון:**
> פונקציה רגילה מקבלת this לפי איך שקוראים לה, ו-arrow function לפי איפה שכתבו אותה, כי אין לה this משלה. לכן arrow function מצוינת ל-callback בתוך מתודה, כי היא שומרת על ה-this של המתודה. אבל לא כדאי להגדיר בה מתודה של אובייקט, כי הסוגריים של אובייקט הם לא סביבה, ואז this יגיע מבחוץ.

---

<a id="llm-agent"></a>
## LLM ו-Agent

**הגדרה:** מודל שפה (LLM) מקבל טקסט ומחזיר טקסט. סוכן (agent) הוא LLM שקיבל **כלים** ועובד ב**לולאה**: הוא מבצע פעולות, מסתכל על התוצאה וממשיך עד שהמשימה גמורה.

</div>

```
LLM:   text in → text out

Agent: LLM + tools + loop
       1. Think  – what should I do next?
       2. Act    – use a tool (read a file, run a command, edit code)
       3. Look   – read the result
       4. Repeat – until the task is done
```

<div dir="rtl">

**דוגמה:** שואלים "למה האפליקציה קורסת?". צ'אט נותן רשימת סיבות כללית. סוכן מריץ את האפליקציה, קורא את השגיאה האמיתית ומצביע על השורה הבעייתית.

**למה זה חשוב:**
- **יתרון:** סוכן בודק את עצמו. הוא מריץ, רואה שגיאה ומתקן.
- **סיכון:** סוכן משנה דברים אמיתיים: קבצים, commits, push. לכן צריך human-in-the-loop, אדם שמאשר פעולות חשובות.

**תשובה לראיון:**
> ההבדל הוא ש-LLM הוא מודל השפה עצמו: הוא מקבל טקסט ומחזיר טקסט, כלומר עונה על שאלות, אבל לא מבצע פעולות. סוכן, או agent, זה LLM שקיבל כלים ועובד בלולאה. ובפועל זה אומר שהוא עושה דברים בעצמו: קורא קבצים, משנה קוד, מריץ פקודות, עושה commit ו-push, מסתכל על התוצאה וממשיך עד שהמשימה גמורה. לדוגמה, אם אשאל צ'אט למה האפליקציה קורסת, אקבל רשימת סיבות כללית. סוכן יריץ את האפליקציה, יקרא את השגיאה האמיתית ויגיד לי באיזו שורה הבעיה. זה חשוב כי הסוכן מסוגל לבצע פעולות בעצמו: לקרוא את הקוד, להריץ אותו, לראות את התוצאה ולתקן. ככה הוא בודק את עצמו. אבל זה בדיוק גם הסיכון, כי הוא עלול לבצע שינויים לא רצויים. לכן צריך human-in-the-loop: אדם שמאשר את הפעולות החשובות.

---

<a id="context"></a>
## Context ו-Context window

**הגדרה:** הקונטקסט (context) הוא כל המידע שיש למודל ברגע נתון. רק לפיו הוא פועל. ה-context window הוא הקיבולת: כמה מידע נכנס, נמדד ב-tokens.

</div>

```
In context:      rules (system prompt, CLAUDE.md), the conversation,
                 files the agent read, results of commands it ran
NOT in context:  previous conversations (unless saved to a file),
                 what is only in your head
```

<div dir="rtl">

**דוגמה:** בקובץ ההתקדמות היה כתוב בטעות ששיעור כבר התחיל. ה-agent קרא את הקובץ, דילג על ההסבר וקפץ לחידון. זה stale context: מידע ישן שהמודל פעל לפיו כאילו הוא נכון.

**למה זה חשוב:**
- המודל לא יודע אם הקונטקסט שלו נכון. הוא פשוט פועל לפיו, ובביטחון.
- לכן: לתת קונטקסט טוב (context engineering), לשמור קבצי הוראות מעודכנים, ולתקן מיד.
- כשה-context window מתמלא, מידע ישן נדחק החוצה או מסוכם. לכן שומרים מידע חשוב בקבצים ולא רק בשיחה.

**תשובה לראיון:**
> הקונטקסט זה כל המידע שקיים למודל ברגע נתון: ההוראות, השיחה עד עכשיו, קבצים שקרא ותוצאות של פקודות שהריץ. מידע משיחות קודמות, למשל, הוא לא חלק מהקונטקסט, אלא אם הוא נשמר בקובץ, כמו קובץ הוראות לפרויקט. זו דרך לשמר מידע בין שיחות. ה-context window זה הקיבולת של הקונטקסט, כלומר כמה מידע נכנס בו. הוא נמדד ב-tokens, ויש לו גבול. לדוגמה, עבדתי עם agent שקרא קובץ התקדמות לא מעודכן. בקובץ היה כתוב שכבר התחלנו נושא מסוים, אז הוא דילג על ההסבר וקפץ לתרגול. זה חשוב כי המודל פועל לפי מה שיש בקונטקסט, גם כשהמידע שגוי או ישן. לכן חשוב לתת קונטקסט טוב, לשמור את הקבצים מעודכנים, ולתקן מיד כשמשהו לא נכון. אחרת, מידע נחוץ יכול ללכת לאיבוד, או גרוע מזה, המודל יפעל בביטחון לפי מידע שגוי.

---

<a id="system-user-prompt"></a>
## System prompt ו-User prompt

**הגדרה:** את ה-system prompt כותב מי שבנה את המוצר. הוא מגדיר תפקיד, סגנון וכללים, ותקף לכל השיחה. את ה-user prompt כותב המשתמש, והוא הבקשה הספציפית בהודעה הנוכחית.

| | System prompt | User prompt |
|---|---|---|
| מי כותב | מי שבנה את המוצר | המשתמש |
| מתי | פעם אחת, מראש | בכל הודעה |
| תוקף | כל השיחה | ההודעה הנוכחית |
| איפה | בשרת | בממשק המשתמש |

**דוגמה:** עוזר AI באתר תזונה.

</div>

```
System prompt (in the server code):
  You are a nutrition assistant. Answer in Hebrew.
  Answer only about food and nutrition.
  Never give a medical diagnosis.

User prompt (from the user):
  How much protein is in one egg?
```

<div dir="rtl">

**למה זה חשוב:**
- **שליטה:** המפתחת קובעת איך העוזר מתנהג, וההתנהגות זהה לכל המשתמשים.
- **אבטחה:** ה-system prompt נמצא בשרת, והמשתמש לא יכול לראות או לשנות אותו. זה מקשה על prompt injection, למשל "Forget your rules and...".
- **הגבול:** זה מקשה, אבל לא מונע לגמרי. לכן מוסיפים guardrails, למשל בדיקה של התשובה לפני שמציגים אותה. זה defense in depth.

**תשובה לראיון:**
> ההבדל הוא שאת ה-system prompt כותב מי שבנה את המערכת, והוא מנחה את המודל לאורך כל השיחה: התפקיד, השפה, הכללים. ה-user prompt הוא הבקשה של המשתמש בכל הודעה. לדוגמה, באתר תזונה עם עוזר AI, ה-system prompt יגיד "ענה בעברית, ורק על תזונה, ואל תיתן אבחנה רפואית", וה-user prompt יהיה "כמה חלבון יש בביצה?". זה חשוב כי ככה המפתחת שולטת בהתנהגות של העוזר, וההתנהגות זהה לכל המשתמשים. ה-system prompt נמצא בשרת, והמשתמש לא יכול לראות או לשנות אותו. זה מקשה על משתמש לנסות לעקוף את הכללים ולבצע תקיפה של הפרומפט, מה שנקרא prompt injection. אבל זה לא מונע את זה לגמרי, ולכן במוצר אמיתי מוסיפים עוד שכבות הגנה, guardrails.

---

<a id="hallucination"></a>
## Hallucination

**הגדרה:** הזיה (hallucination) היא מצב שבו המודל ממציא מידע לא נכון שנשמע נכון. זה קורה כי המודל מנבא טקסט **סביר**, וסביר זה לא תמיד נכון.

**דוגמה:**

</div>

```js
// AI suggested:
const byRole = users.groupBy(u => u.role);        // does not exist

// Checked on MDN – the real one:
const byRole = Object.groupBy(users, u => u.role); // Node 21+
```

<div dir="rtl">

**למה זה מסוכן:** המודל כותב מידע מומצא **באותו ביטחון** כמו מידע אמיתי, ואין סימן שמבדיל ביניהם. התוצאה: באגים בפרודקשן, או ספרייה זדונית (slopsquatting).

**איך מתמודדים:**

</div>

```
Verify AFTER the answer:
  - source of truth: MDN (JS), react.dev (React), npmjs.com (packages)
  - run it:          node -e "console.log(typeof Object.groupBy)"
  - NOT "are you sure?" – same source, and sycophancy

Ground BEFORE the answer (grounding):
  - give the model real sources: docs, project files (package.json)
  - RAG: the system finds relevant docs and adds them to the context
```

<div dir="rtl">

**תשובה לראיון:**
> הזיה, או hallucination, זה כשהמודל ממציא מידע לא נכון, שנשמע נכון. למשל, הוא משתמש בפונקציה שלא קיימת, או מציע להתקין ספרייה שלא קיימת. זה קורה כי המודל מנבא טקסט סביר, וסביר זה לא תמיד נכון. זה מסוכן כי המודל כותב מידע מומצא באותו ביטחון כמו מידע אמיתי, ואין שום סימן שמבדיל ביניהם. בלי בדיקה, זה יכול להגיע לפרודקשן כבאג, או אפילו כספרייה זדונית שמישהו רשם בשם שמודלים נוטים להמציא. יש שתי דרכים להתמודד. קודם כל, לאמת אחרי: להסתמך על מקורות מהימנים בהתאם, MDN לבדיקה של פונקציות ו-npm לבדיקת ספריות ומהימנותן, ולהריץ ניסוי קצר. ושנית, למנוע מראש: לתת למודל מקורות אמיתיים להסתמך עליהם, כמו קבצים מהפרויקט או התיעוד הרשמי. זה נקרא grounding.

---

<a id="ai-workflow"></a>
## איך אני עובדת עם כלי AI

**השאלה:** "How do you use AI tools in your work?"

זו לא שאלת הגדרה אלא שאלה על דרך עבודה. המבנה שונה:

</div>

```
1. Approach  – my general attitude (one sentence)
2. Process   – before → after
3. Example   – something real
4. Why       – why I work this way
```

<div dir="rtl">

**לפני:** פרומפט עם 4 חלקים (Goal, Context, Constraints, Done), ו-grounding.
**אחרי:** code review: לקרוא את ה-diff, להריץ, edge cases, לאמת מול התיעוד.
**לאורך כל הדרך:** human-in-the-loop.

**דוגמאות אמיתיות שלי:**
- review לפונקציה של AI שהבטיחה "handles all cases": 4 באגים (`week-01/05-ai-code-review.js`).
- לומדת עם AI agent כמורה, עם קובץ הוראות (`CLAUDE.md`) שמגדיר לו context. כשהקובץ היה לא מעודכן, ה-agent טעה, ותיקנתי את הקובץ.
- (להוסיף דוגמאות מפרויקט הגמר)

**תשובה לראיון:**
> אני מתייחסת ל-AI כמו למפתח junior מהיר: הוא חוסך לי הרבה זמן, אבל אני אחראית על כל שורה שנכנסת לפרויקט. לפני שאני מבקשת משהו, אני כותבת פרומפט עם ארבעה חלקים: מה המטרה, למשל להוסיף שדה חיפוש; מה הקונטקסט, למשל באיזו טכנולוגיה ובאיזה קובץ; מה המגבלות, למשל לא להוסיף ספרייה חדשה; ומתי זה גמור, למשל כשהקלדת אות מציגה רק את המאכלים המתאימים, ומחיקת השדה מציגה מחדש את כולם. אני גם עושה grounding: נותנת למודל מקורות אמיתיים להסתמך עליהם, כמו קבצים מהפרויקט או התיעוד הרשמי. אחרי שאני מקבלת את הקוד, אני עושה לו code review: קוראת את ה-diff, מריצה בעצמי, בודקת edge cases, ומאמתת כל דבר לא מוכר מול התיעוד הרשמי. בסוף המודל עושה טעויות, ולכן שינויים חשובים עוברים אישור שלי. לדוגמה, קיבלתי פעם מ-AI פונקציה שהוא הבטיח שמטפלת בכל המקרים. ב-review והרצה מצאתי בה ארבעה באגים: היא שינתה את המערך המקורי, החזירה NaN כשחסר ערך, החזירה תוצאה שגויה, וקרסה על מערך ריק. אני עובדת ככה כי הקוד נכנס לפרויקט בשם שלי, ואני צריכה להיות מסוגלת להסביר כל שורה בו.

---

<a id="code-review"></a>
## Code review

**הגדרה:** קריאה ובדיקה של קוד לפני שהוא נכנס לפרויקט. בודקים את ה-diff מול הדרישות, מריצים, ומחפשים edge cases. אותו תהליך בדיוק מתאים גם לקוד שכתב AI.

**צ'קליסט:**
1. לקרוא את ה-diff, כל שורה. שורה שלא מבינים, עוצרים ושואלים.
2. להשוות לדרישות: Goal, Constraints, Acceptance criteria.
3. להריץ.
4. לבדוק edge cases: מערך ריק, ערך חסר, `0`, שגיאת רשת.
5. לחפש scope creep ו-over-engineering.
6. API או ספרייה לא מוכרים? לאמת מול התיעוד הרשמי.

**הנוסחה להערת review:**

</div>

```
Problem    = what is wrong + why it matters
Proof      = input + output
Suggestion = exact change + why it's better
```

<div dir="rtl">

**דוגמה 1:** באג בקוד של AI (`week-01/05-ai-code-review.js`)

</div>

```
Problem:    meals.sort() changes the original array.
            The constraints say the order must not change.
Proof:      monday = Oatmeal, Salad, Yogurt
            after summarizeDay(monday): Salad, Oatmeal, Yogurt
Suggestion: filter first (it returns a new array), then sort the new array.
```

<div dir="rtl">

**דוגמה 2:** כוונה לא ברורה בקוד שלי

</div>

```
Problem:    !!meal.calories ignores meals with 0 calories.
            It is not clear if this is on purpose.
Proof:      [{ name: 'Diet Cola', calories: 0 }]
            returns { total: 0, top: null }
Suggestion: change the filter condition to meal.calories > 0,
            so the intent is clear.
```

<div dir="rtl">

**ניסוח כשלא בטוחים:** הערה בצורת שאלה היא מקצועית ולגיטימית.

</div>

```
I think this changes the original array — can you check?
Question: what happens if meals is empty?
Nit: rename meals → meal inside filter (shadowing).
```

<div dir="rtl">

**למה זה חשוב:**
- בצוות, כל קוד עובר review. ככה תופסים באגים לפני שהם מגיעים לפרודקשן.
- עם כלי AI זה חשוב עוד יותר: קוד של AI נראה מקצועי ובטוח, גם כשיש בו באגים (automation bias).
- בראיונות מבקשים לפעמים לעשות review לקוד קיים, ושואלים איך את עובדת עם AI.

**תשובה לראיון:**
> (נכתוב יחד, במילים שלך, בתרגול בעל-פה)

</div>
