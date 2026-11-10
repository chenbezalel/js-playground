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
- [Event loop](#event-loop)
- [Promise](#promise)
- [async / await](#async-await)
- [fetch ו-res.ok](#fetch)
- [Debounce](#debounce)
- [Throttle](#throttle)
- [Promise.all](#promise-all)
- [Prototype ו־prototype chain](#prototype)
- [Class, ו־this ב־callback](#class)
- [reduce](#reduce)
- [ES modules](#es-modules)

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

<a id="event-loop"></a>
## Event loop

**הגדרה:** המנגנון שקובע באיזה סדר הקוד רץ. ל-JavaScript יש thread אחד, אז היא מריצה דבר אחד בכל פעם. ה-event loop מחכה שה-call stack יתרוקן, ורק אז מעלה את הדבר הבא.

**הכלל, שחוזר שוב ושוב:**

</div>

```
1. Run all sync code until the call stack is empty
2. Run ALL microtasks (promises: .then, await) – also new ones added on the way
3. Take ONE task from the task queue (setTimeout, events) → back to step 2
```

<div dir="rtl">

**דוגמה:** (`week-02/01-event-loop.js`)

</div>

```js
console.log('A');                                // sync
setTimeout(() => console.log('B'), 0);           // task queue
Promise.resolve().then(() => console.log('C'));  // microtask queue
console.log('D');                                // sync
// Output: A D C B
```

<div dir="rtl">

‏`setTimeout` עם `0` לא רץ "מיד". הוא נכנס לתור המשימות, ו-microtasks תמיד עוקפים אותו.

**מלכודות ב"מה יודפס?":**
- **microtask שנוצר בתוך microtask** עדיין רץ לפני כל ה-tasks. התור מתרוקן **לגמרי**.
- **microtask שנוצר בתוך task** רץ לפני ה-task הבא.
- **שתי שרשראות `.then`** מתחלפות: ה-`.then` הבא נכנס לסוף התור רק כשהקודם מסתיים.

**למה זה חשוב:**
- **דף שקופא:** לולאה כבדה תופסת את ה-call stack. לחיצות וציור מסך מחכים, והמשתמש לא יכול לעשות כלום. הפתרון: להעביר את העבודה לשרת, ל-Web Worker, או לפצל אותה לחלקים.
- **שרת Node:** יש thread אחד לכל המשתמשים. חסימה בבקשה אחת פוגעת בכולם (לכן משתמשים ב-job queue כמו BullMQ).
- **באגים של סדר:** `console.log` מיד אחרי `fetch` מדפיס `undefined`, כי ה-`.then` ירוץ רק אחר כך.

**תשובה לראיון:**
> event loop זה המנגנון שקובע באיזה סדר הקוד ירוץ. ל-JavaScript יש thread אחד, אז היא מריצה דבר אחד בכל פעם. ובפועל זה אומר שקודם רץ כל הקוד הסינכרוני, לפי הסדר. כשה-call stack מתרוקן, רצים כל ה-microtasks, כמו then של promises, ורק אחר כך task אחד מה-task queue, כמו setTimeout, ואז חוזרים לבדוק את ה-microtasks. למשל, אם מדפיסים A, אחר כך setTimeout עם B, promise עם C, ואז D, יודפס A D C B. זה חשוב כי אם לולאה כבדה תופסת את ה-call stack, ה-event loop לא יכול להריץ שום דבר אחר: הדף קופא, והמשתמש לא יכול ללחוץ או להמשיך לגלוש. לכן עבודה כבדה מעבירים למקום אחר, למשל לשרת שיבצע את החישוב, ובינתיים הדף ממשיך להגיב. ובשרת Node זה עוד יותר חשוב, כי שם יש thread אחד לכל המשתמשים.

---

<a id="promise"></a>
## Promise

**הגדרה:** אובייקט שמייצג ערך שיגיע **אחר כך**. יש לו שלושה מצבים: `pending` (מחכה), `fulfilled` (הצליח, עם ערך) ו-`rejected` (נכשל, עם שגיאה). כשהוא יוצא מ-pending הוא נקרא settled, ולא משתנה יותר.

**מי משנה את המצב:** רק קריאה ל-`resolve` או ל-`reject`. הפונקציה שבתוך `then` רק **נרשמת**. כשה-Promise מסתיים, היא נכנסת לתור ה-microtasks.

**דוגמה:** (`week-02/02-promises.js`)

</div>

```js
getMeals('monday')
  .then((meals) => meals.map((meal) => meal.calories)) // return → next then
  .then((calories) => console.log(calories))
  .catch((error) => console.log(error.message))        // any error skips here
  .finally(() => console.log('Done'));                 // runs in both cases
```

<div dir="rtl">

**כללי השרשור:**
- **כל `then` מחזיר Promise חדש.** מה שעושים לו `return` מגיע ל-`then` הבא.
- **שכחת `return`** (בפונקציית חץ עם `{ }`): ה-`then` הבא מקבל `undefined`, בלי שום שגיאה.
- **שגיאה באמצע:** מדלגת על כל ה-`then` עד ה-`catch` הקרוב.
- **אחרי `catch`:** השרשרת חוזרת למסלול ההצלחה, ומה שה-`catch` מחזיר מגיע ל-`then` הבא.
- **`then` תמיד אסינכרוני:** גם אם ה-Promise כבר fulfilled, הוא רץ רק אחרי הקוד הסינכרוני.

**למה זה חשוב:**
- **בלי Promises** היינו צריכים לחכות ולהקפיא את הדף בכל בקשה לשרת. עם thread אחד, זה לא אפשרי.
- **באגים שקטים:** `return` חסר או `catch` חסר לא נותנים שגיאה ברורה, רק `undefined` בהמשך, או שגיאה שאף אחד לא תפס.

**תשובה לראיון (טיוטה, לתרגל בעל פה):**
> Promise זה אובייקט שמייצג ערך שיגיע אחר כך, למשל תשובה משרת. ובפועל זה אומר שהפונקציה מחזירה אותו מיד, והקוד ממשיך לרוץ בלי לחכות. יש לו שלושה מצבים: pending, fulfilled ו-rejected, והמצב משתנה רק כשקוראים ל-resolve או ל-reject. עם then מקבלים את הערך, ועם catch את השגיאה. כל then מחזיר Promise חדש, ולכן אפשר לשרשר: מה שמחזירים מ-then אחד מגיע לבא אחריו, ושגיאה באמצע קופצת ישר ל-catch. זה חשוב כי ל-JavaScript יש thread אחד: בלי Promises, כל בקשה לשרת הייתה מקפיאה את הדף.

---

<a id="async-await"></a>
## async / await

**הגדרה:** תחביר נוח יותר לאותם Promises (syntactic sugar).
- פונקציה עם `async` **תמיד** מחזירה Promise. גם `return 750` הופך ל-Promise של 750.
- המילה `await` עוצרת **רק את הפונקציה הזו** עד שה-Promise מסתיים. אם הוא הצליח, מקבלים את הערך. אם הוא נכשל, `await` **זורק** את השגיאה.
- עד ה-`await` הראשון, הפונקציה רצה באופן סינכרוני.

**דוגמה:** (`week-02/03-async-await.js`)

</div>

```js
async function loadTotal() {
  try {
    const meals = await getMeals('monday');
    return meals.reduce((sum, meal) => sum + meal.calories, 0);
  } catch (error) {
    console.log('Error:', error.message);
  }
}

const result = loadTotal();   // Promise, not a number!
```

<div dir="rtl">

**שתי מלכודות:**
- **`await` בלי `try/catch`:** אם ה-Promise נכשל, השגיאה לא נתפסת (unhandled rejection). ב-Node התוכנית קורסת.
- **שכחת `await`** לפני פונקציה אסינכרונית: מקבלים Promise במקום נתונים. ב-React זה נראה כמו `data.map is not a function`.

**למה זה חשוב:** הקוד נקרא מלמעלה למטה, כמו קוד רגיל, ואין מלכודת של `return` חסר בשרשרת. ומכיוון ש-`await` עוצר רק את הפונקציה, הדף או השרת ממשיכים לענות לכולם בזמן ההמתנה.

**תשובה לראיון (טיוטה, לתרגל בעל פה):**
> async/await זה תחביר נוח יותר לעבודה עם Promises. ובפועל זה אומר שפונקציה עם async תמיד מחזירה Promise, ו-await עוצר רק את הפונקציה הזו עד שה-Promise מסתיים, ונותן את הערך. אם ה-Promise נכשל, await זורק שגיאה, ולכן תופסים אותה עם try/catch, כמו בקוד רגיל. למשל, טעינת ארוחות מהשרת: const meals = await getMeals(). זה חשוב כי הקוד נקרא מלמעלה למטה, ובזמן ההמתנה שאר התוכנית ממשיכה לרוץ. צריך לזכור שבלי try/catch שגיאה לא נתפסת, ובלי await מקבלים Promise במקום נתונים.

---

<a id="fetch"></a>
## fetch ו-res.ok

**הגדרה:** הפונקציה `fetch` שולחת בקשת HTTP ומחזירה Promise של אובייקט Response.
- **`fetch` נכשל (rejected) רק כשאין תשובה בכלל:** אין רשת, השרת כבוי, או שאף אחד לא מאזין בפורט.
- **404 או 500 הם תשובה.** ה-Promise מצליח, ו-`catch` **לא** רץ.
- **`res.ok`** הוא `true` רק לסטטוס 200–299.
- **`res.json()`** גם מחזיר Promise, כי גוף התשובה מגיע בחלקים.

**דוגמה:** (`week-02/04-fetch.js`)

</div>

```js
const res = await fetch('/api/meals');
if (!res.ok) {
  throw new Error(`Request failed with status ${res.status}`);
}
const meals = await res.json();
```

<div dir="rtl">

**למה זה חשוב:** בלי בדיקת `res.ok`, תשובת 404 נכנסת לקוד כאילו הכל תקין. במקום מערך מקבלים אובייקט שגיאה, ו-`meals.length` מחזיר `undefined` בשקט. הסיבה האמיתית נעלמת, והבאג מופיע רחוק משם, למשל `meals.map is not a function`.

**תשובה לראיון (טיוטה, לתרגל בעל פה):**
> fetch שולח בקשת HTTP ומחזיר Promise של התשובה. ובפועל זה אומר שהוא נכשל רק כשאין תשובה בכלל, למשל שגיאת רשת. אם השרת ענה 404 או 500, מבחינת fetch זו תשובה תקינה, וה-catch לא ירוץ. לכן תמיד בודקים res.ok, ואם הוא false זורקים שגיאה בעצמנו. זה חשוב כי אחרת הקוד ממשיך עם נתונים לא נכונים, ומקבלים undefined או קריסה במקום אחר, רחוק מהסיבה האמיתית.

---

<a id="debounce"></a>
## Debounce

**הגדרה:** הפונקציה `debounce(fn, delay)` מחזירה פונקציה חדשה. כל קריאה לפונקציה החדשה מבטלת את הטיימר הקודם ומתחילה טיימר חדש. הפונקציה `fn` רצה **פעם אחת**, רק אחרי `delay` מילישניות **בלי קריאות חדשות**, עם הערכים של הקריאה **האחרונה**.
- **closure:** המשתנה של הטיימר נוצר פעם אחת, כשקוראים ל־`debounce`. כל הקריאות לפונקציה המוחזרת חולקות אותו, ולכן כל קריאה יכולה לבטל את הטיימר של הקודמת.
- **`setTimeout`** מחזירה מזהה (id) של הטיימר, ו־**`clearTimeout(id)`** מבטלת אותו.
- **`...args`** אוסף את כל הערכים שנשלחו, ומעביר אותם הלאה ל־`fn`.

**דוגמה:** (`week-02/05-debounce.js`, המימוש שלי)

</div>

```js
function debounce(fn, delay) {
  let timerID; // one shared variable (closure)

  return (...args) => {
    clearTimeout(timerID);
    timerID = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

const search = debounce((text) => console.log('Searching:', text), 300);
search('p');
search('pi');
search('pizza');
```

<div dir="rtl">

**למה זה חשוב:** בלי debounce, חיפוש בזמן הקלדה שולח בקשה על כל אות. זה יוצר עומס מיותר על השרת ועל הרשת. התשובות גם יכולות להגיע בסדר הלא נכון (race condition): התוצאות של "פי" מגיעות אחרי אלה של "פיצה", והמשתמש רואה תוצאות שגויות. שימושים נוספים: שינוי גודל חלון (`resize`), שמירה אוטומטית של טופס.

**בונוס, `this`:** בגלל פונקציית החץ, אם `fn` היא מתודה של אובייקט, ה־`this` שלה הולך לאיבוד (בקריאה `fn()` אין נקודה). הפתרון: הפונקציה המוחזרת היא פונקציה רגילה, וקוראים ל־`fn.apply(this, args)`. כך עובדת למשל הספרייה lodash.

**תשובה לראיון (מהמילים שלי):**
> debounce זה מנגנון שדוחה את ביצוע הפונקציה, ובפועל זה אומר שהיא רצה פעם אחת בלבד, רק אחרי שהקריאות הפסיקו לזמן מסוים, עם הערך האחרון. למשל בחיפוש של המילה "פיצה": בלי debounce יוצאת בקשה על כל תו, אבל אין צורך לחפש "פ" או "פי". מה שעושים זה להפעיל טיימר כשמוקלד תו. כשמוקלד תו נוסף, הטיימר הקודם מתבטל ומתחיל טיימר חדש, ורק כשהטיימר מסתיים, פונקציית החיפוש רצה. המשתנה של הטיימר נשמר ב־closure, מחוץ לפונקציה המוחזרת, כך שכל הקריאות חולקות אותו ויכולות לבטל את הקודם. זה חשוב כי אחרת נוצר עומס מיותר על השרת, ותשובות יכולות להגיע בסדר הלא נכון ולהציג תוצאות שגויות.

---

<a id="throttle"></a>
## Throttle

**הגדרה:** הפונקציה `throttle(fn, delay)` מחזירה פונקציה חדשה, ש־`fn` רצה בה **לכל היותר פעם אחת** בכל `delay` מילישניות, גם אם הקריאות לא נעצרות. בגרסה שלי: הקריאה הראשונה רצה **מיד**, וקריאות בתוך החלון **נזרקות** (לא נשמרות לאחר כך).
- **closure:** משתנה בוליאני (flag) נוצר פעם אחת, כשקוראים ל־`throttle`, ומתחיל ב־`false`. אם הוא היה נוצר בתוך הפונקציה המוחזרת, הוא היה מתאפס בכל קריאה, וכל קריאה הייתה רצה.
- **הטיימר מופעל רק אחרי ריצה.** אם גם קריאה שנזרקת מפעילה טיימר, טיימר ישן מאפס את החלון מוקדם מדי.

**ההבדל מ־debounce:** throttle רץ **תוך כדי** הזרם, בקצב קבוע. debounce רץ **פעם אחת אחרי** שהזרם נעצר.

</div>

```
delay = 100, a call every 40ms:
time:      0    40   80   120  160  200  240
throttle:  run  -    -    run  -    -    run
debounce:  -    -    -    -    -    -    -    (runs once, at 340)
```

<div dir="rtl">

**דוגמה:** (`week-02/06-throttle.js`, המימוש שלי)

</div>

```js
function throttle(fn, delay) {
  let isWaiting = false; // one shared flag (closure)

  return (...args) => {
    if (isWaiting) return; // guard clause: inside the window → ignore
    fn(...args);
    isWaiting = true;
    setTimeout(() => {
      isWaiting = false;
    }, delay);
  };
}

window.addEventListener('scroll', throttle(checkPosition, 200));
```

<div dir="rtl">

**מתי מה? השאלה "מי מפעיל את הפונקציה?"**
- **אירועים מבחוץ, ורוצים לפעול תוך כדי:** throttle. גלילה (טעינת עוד פוסטים), תזוזת עכבר בלוח משותף, כפתור "בצע הזמנה" שלוחצים עליו כמה פעמים.
- **אירועים מבחוץ, ורוצים לפעול אחרי שנעצרו:** debounce. חיפוש בזמן הקלדה, שמירה אוטומטית של טיוטה.
- **אין אירועים, צריך לרוץ מעצמו:** polling עם `setInterval`, או push מהשרת עם WebSocket. למשל סטטוס משלוח או תוצאת משחק.

**למה זה חשוב:** אירועים כמו `scroll` ו־`mousemove` נורים עשרות פעמים בשנייה. אם כל פעם רצה פונקציה כבדה, ה־call stack עסוק כל הזמן והדף נתקע. ואם כל פעם יוצאת בקשה, נוצר עומס מיותר על השרת. בכפתור תשלום, לחיצה כפולה יכולה ליצור תשלום כפול. שם throttle הוא רק שכבה אחת: מוסיפים גם `disabled` לכפתור, ו־idempotency בשרת (defense in depth).

**תשובה לראיון (מהמילים שלי):**
> throttle זה כשמגבילים פונקציה כך שתרוץ לכל היותר פעם אחת בכל פרק זמן, ובפועל זה אומר שגם כשהמשתמש עושה פעולה שוב ושוב, הפונקציה רצה בקצב קבוע, והקריאות שבאמצע נזרקות. המנגנון: הקריאה הראשונה רצה ומפעילה טיימר לזמן שהוגדר מראש. כל עוד הטיימר פועל, הפונקציה לא רצה. כשהטיימר מסתיים, הקריאה הבאה של המשתמש רצה, וחוזר חלילה. למשל בגלילה בעמוד, או בלחיצה על כפתור. ההבדל מ־debounce: ב־debounce הטיימר מתבטל ומתחיל מחדש בכל פעולה, למשל בהקלדת אות, והפונקציה רצה רק אחרי שהטיימר מסתיים. כלומר, throttle רץ תוך כדי הזרם, ו־debounce רץ פעם אחת אחרי שהזרם נעצר. זה חשוב כדי למנוע עומס: פונקציה כבדה שרצה עשרות פעמים בשנייה מאטה את הדף, ובקשות מיותרות מעמיסות על השרת. בנוסף, בכפתור תשלום לחיצה כפולה יכולה ליצור תשלום כפול, ו־throttle עוזר למנוע את זה.

---

<a id="promise-all"></a>
## Promise.all

**הגדרה:** הפונקציה `Promise.all(items)` מקבלת מערך, ומחזירה **promise אחד**:
- **הצלחה:** כש**כל** הפריטים הצליחו, עם מערך של כל התוצאות, **לפי הסדר של הקלט** ולא לפי סדר הסיום.
- **כישלון:** **מיד** כשפריט אחד נכשל, עם השגיאה שלו (fail fast), בלי לחכות לשאר.
- **מקרי קצה:** מערך ריק מצליח מיד עם `[]`. ערכים שהם לא promises נחשבים כאילו כבר הצליחו.

**דוגמה: בקשות במקביל במקום בזו אחר זו**

</div>

```js
// one after the other: about 900ms
const user = await getUser();     // 300ms
const meals = await getMeals();   // 300ms
const goals = await getGoals();   // 300ms

// in parallel: about 300ms (the slowest one)
const [user, meals, goals] = await Promise.all([
  getUser(),
  getMeals(),
  getGoals(),
]);
```

<div dir="rtl">

**המימוש שלי** (`week-02/07-promise-all.js`):

</div>

```js
function promiseAll(items) {
  let successCount = 0;
  const results = []; // my own array: never write into the caller's array

  return new Promise((resolve, reject) => {
    if (items.length === 0) return resolve([]); // guard clause, or it stays pending forever
    items.forEach((item, index) => {
      Promise.resolve(item) // turns plain values into promises
        .then((res) => {
          results[index] = res; // the ORIGINAL index keeps the order
          successCount += 1;
          if (successCount === items.length) resolve(results); // checked on every success
        })
        .catch(reject);
    });
  });
}
```

<div dir="rtl">

**מה למדתי בדרך (טעויות נפוצות):**
- **בדיקה אחרי הלולאה:** `then` רק **רושם** פונקציה שתרוץ אחר כך. הקוד שאחרי ה־`forEach` רץ מיד, כשהמונה עדיין 0. לכן הבדיקה "כולם הצליחו?" חייבת להיות **בתוך** `then`.
- **`results.length` במקום מונה:** אחרי `results[2] = 'c'` האורך הוא כבר 3 (sparse array). לכן סופרים הצלחות עם מונה.
- **כתיבה לתוך `items`:** זה mutation של מערך שלא שייך לי (side effect). מי שקרא לפונקציה ימצא אצלו ערכים במקום promises.
- **מערך ריק:** בלי guard clause, אף `then` לא רץ, ו־`resolve` לא נקרא לעולם.

**מתי לא להשתמש:** כשבקשה אחת צריכה תוצאה של בקשה קודמת (למשל צריך קודם את ה־id של המשתמש). וכשרוצים את כל התוצאות גם אם חלק נכשלו, משתמשים ב־`Promise.allSettled`.

**למה זה חשוב:** בקשות שלא תלויות זו בזו יוצאות במקביל, והזמן הכולל הוא של הבקשה **האיטית ביותר**, ולא הסכום של כולן. וגם מקבלים promise אחד שאומר אם הכל הצליח, כך שמטפלים בשגיאה במקום אחד.

**תשובה לראיון (מהמילים שלי):**
> `Promise.all` זו פונקציה שמקבלת מערך של promises, ובפועל היא מחזירה promise אחד, שמצליח עם מערך של כל התוצאות, לפי סדר השליחה ולא לפי סדר החזרה, או נכשל מיד ברגע שאחד מהם נכשל. כדי לממש אותה, מחזירים `new Promise`, ועוברים פריט פריט. על כל פריט רושמים `then` ו־`catch`, שירוצו אחר כך, כשהפריט מסתיים. את התוצאות שומרים במערך חדש, במיקום המקורי, ובמקביל יש מונה. בכל הצלחה משווים אותו לאורך המערך המקורי, וכשהוא שווה, קוראים ל־`resolve`. ברגע שנתפסת שגיאה, קוראים ל־`reject`. מערך ריק מצליח מיד, וערכים רגילים עוטפים עם `Promise.resolve`. למשל כשהאתר עולה וצריך כמה בקשות לשרת, כמו `getUser` ו־`getMeals`: במקום לחכות לכל אחת בנפרד, הן יוצאות במקביל. זה חוסך זמן, כי מחכים רק לאיטית ביותר, וגם מקבלים promise אחד שאומר אם כל הבקשות הצליחו.

---

<a id="prototype"></a>
## Prototype ו־prototype chain

**הגדרה:** לכל אובייקט יש קישור נסתר לאובייקט אחר, שנקרא ה־**prototype** שלו ("תיק משותף"). כשקוראים מאפיין, JS מחפש קודם על האובייקט עצמו (own property). אם אין, הוא עולה ל־prototype, ומשם ל־prototype שלו, עד `null`. המסלול הזה נקרא **prototype chain**.
- **קריאה** עולה בשרשרת. **כתיבה** תמיד נכנסת לאובייקט עצמו, ומסתירה את מה שב־prototype (shadowing).
- זה **קישור, לא עותק**: אם משנים את ה־prototype, כל האובייקטים המקושרים רואים את השינוי.
- הפקודה `Object.keys` מחזירה רק own properties.

</div>

```
           User.prototype  (shared bag)
           ┌───────────────────┐
           │ hello: function   │
           └───────────────────┘
              ▲             ▲
         link │             │ link
   ┌──────────────┐   ┌──────────────┐
   │ dana         │   │ noa          │
   │ name: 'Dana' │   │ name: 'Noa'  │
   └──────────────┘   └──────────────┘
```

```js
const nums = [3, 1, 2];
nums.hasOwnProperty('map');                        // false: map is not in nums
Object.getPrototypeOf(nums) === Array.prototype;   // true: map lives here
```

<div dir="rtl">

**למה זה חשוב:** מתודה שיושבת ב־prototype קיימת **פעם אחת** בזיכרון, גם אם יש מיליון אובייקטים, ושינוי במקום אחד משפיע על כולם. זה גם הבסיס של `class`, של `extends` ושל `instanceof`, ובלי להבין אותו קשה להבין באגים של `this`.

**תשובה לראיון (מהמילים שלי):**
> prototype זה אובייקט "אב" שאובייקט אחר מקושר אליו, ובפועל זה אומר שהתכונות שבו משותפות לכל האובייקטים שמקושרים אליו. כשאני ניגשת לתכונה, JS מחפש אותה קודם באובייקט עצמו, ואם לא מוצא, הוא עולה ל־prototype, וממנו הלאה בשרשרת, עד הסוף. לזה קוראים prototype chain. למשל `map`: היא לא נמצאת בכל מערך שאני יוצרת, אלא פעם אחת ב־`Array.prototype`, וכל מערך מוצא אותה דרך השרשרת. זה חשוב כי יש תכונות שנרצה שיהיו משותפות לכל האובייקטים מאותו סוג: הן נשמרות פעם אחת בזיכרון, ושינוי במקום אחד משפיע על כולם.

---

<a id="class"></a>
## Class, ו־this ב־callback

**הגדרה:** `class` הוא **syntactic sugar** מעל prototypes, ולא מנגנון חדש (`typeof User` הוא `'function'`).
- **constructor ו־class fields** (שדות עם `=`, כמו `count = 0`): רצים בכל `new`, ונכנסים לתיק **של כל אובייקט**.
- **מתודה רגילה** (בלי `=`, כמו `hello() {}`): נכנסת **פעם אחת** ל־`User.prototype`, משותפת לכולם.
- **`extends`:** מוסיף קומה לשרשרת. `super(name)` מריץ את ה־constructor של האב, ו־`super.speak()` את המתודה של האב.
- **קוד בתוך class תמיד ב־strict mode.** לכן קריאה בלי נקודה נותנת `this` = `undefined`.

</div>

```js
class Cart {
  total = 0;               // field → own bag of each cart
  add(price) {             // method → Cart.prototype (shared)
    this.total += price;
  }
}
const cart = new Cart();

[10, 20].forEach(cart.add);            // TypeError: forEach calls fn(10), no dot → this is undefined
[10, 20].forEach((p) => cart.add(p));  // works: the dot is inside the arrow → this is cart
```

<div dir="rtl">

**שלוש דרכים לשמור על `this` ב־callback:**
1. עוטפים ב־arrow: `() => cart.add(p)`. הנקודה נשארת בקריאה.
2. מקבעים עם `bind`: `this.add = this.add.bind(this)` ב־constructor (היה נפוץ ב־React class components).
3. כותבים את המתודה כ־arrow field: `add = (price) => {...}`. ה־arrow לוקחת את `this` מהאובייקט שנוצר. **trade-off:** עותק של הפונקציה לכל אובייקט, ולא אחד משותף.

**למה זה חשוב:** "lost this" הוא באג קלאסי: מעבירים מתודה ל־`onClick`, ל־`forEach` או ל־`setTimeout`, ובלחיצה נזרק `TypeError`. בצד השרת נכתוב הרבה classes (למשל services ו־errors), ובראיונות שואלים "מה ההבדל בין class ל־prototype".

**תשובה לראיון (מהמילים שלי):**
> `class` הוא דרך נוחה יותר לכתוב את אותו מנגנון של prototypes, ובפועל זה אומר שמתודות שאני כותבת ב־class נכנסות פעם אחת ל־prototype, ומה שכתוב ב־constructor נכנס לתיק האישי של כל אובייקט. למשל class של חיה: לכל החיות יש מתודה אחת משותפת להגיד שלום, אבל לכל חיה יש שם משלה, בתיק האישי שלה. כך כל החיות משתמשות באותה מתודה, וחוסכים זיכרון. צריך להיזהר כשמעבירים מתודה כ־callback, למשל ל־`forEach`: ה־`forEach` מקבל את הפונקציה כמשתנה ומריץ אותה בלי נקודה לפניה, ולכן `this` הוא `undefined`. הפתרון: לעטוף ב־arrow function, שם יש נקודה לפני הקריאה, או להשתמש ב־`bind`.

---

<a id="reduce"></a>
## reduce

**הגדרה:** `reduce` "מקפלת" מערך לערך **אחד**: מספר, אובייקט, או אפילו מערך. היא מקבלת callback וערך התחלתי.
- בכל סיבוב, ה־callback מקבל את ה־**accumulator** (`acc`, התוצאה עד עכשיו) ואת האיבר הבא.
- מה שה־callback **מחזיר** הופך ל־`acc` של הסיבוב הבא. בסוף, `reduce` מחזירה את ה־`acc` האחרון.
- **בלי ערך התחלתי:** ה־`acc` הראשון הוא האיבר הראשון, והסיבובים מתחילים מהשני. במערך ריק נזרק `TypeError` (אין מאיפה להתחיל). אין `acc` דיפולטיבי, כי JS לא יודע מה בונים.

</div>

```js
const meals = [
  { day: 'sun', calories: 300 },
  { day: 'mon', calories: 200 },
  { day: 'sun', calories: 500 },
];

const total = meals.reduce((acc, meal) => acc + meal.calories, 0);   // 1000

const perDay = meals.reduce((acc, meal) => {
  acc[meal.day] = (acc[meal.day] ?? 0) + meal.calories;
  return acc;                                                        // don't forget!
}, {});                                                              // { sun: 800, mon: 200 }
```

<div dir="rtl">

**טעויות נפוצות:**
- **שוכחים `return`** ב־callback עם `{ }`: ה־`acc` הבא הוא `undefined`, וכך גם התוצאה. בלי `{ }` יש implicit return.
- **לא נותנים ערך התחלתי:** עובד, עד שמגיע מערך ריק (למשל משתמשת חדשה בלי ארוחות), ואז הדף קורס.
- **מותר** לשנות את `acc` כשהוא אובייקט חדש שיצרנו (`{}`). אסור לשנות מערך שקיבלנו ממי שקרא לנו.

**למה זה חשוב:** `reduce` הופכת נתונים גולמיים למבנה שהמסך צריך: סכום, קיבוץ לפי יום (כמו `GROUP BY` ב־SQL), מקסימום, או אובייקט לפי `id`. הכל במעבר אחד, בלי לשנות את המערך המקורי.

**תשובה לראיון (מהמילים שלי):**
> `reduce` היא מתודה של מערך שמקפלת את כל המערך לערך אחד, ובפועל זה אומר שהיא עוברת איבר איבר ומעדכנת "צובר" (accumulator). היא מקבלת callback וערך התחלתי. בכל סיבוב ה־callback מקבל את ה־`acc` ואת האיבר הנוכחי, ומה שהוא מחזיר הופך ל־`acc` של הסיבוב הבא. למשל, במערך של קלוריות עם ערך התחלתי `0`, היא מחזירה את הסכום. אבל אפשר לבנות איתה כל מבנה: למשל אובייקט עם סך הקלוריות לכל יום. יש שתי טעויות נפוצות. הראשונה: לא לתת ערך התחלתי. אז ה־`acc` הראשון הוא האיבר הראשון, ובמערך ריק נזרקת שגיאה. השנייה: לשכוח `return` בתוך ה־callback, ואז ה־`acc` של הסיבוב הבא הוא `undefined`, וגם התוצאה הסופית. זה חשוב כי `reduce` הופכת נתונים גולמיים למבנה שהמסך צריך, במעבר אחד, בלי לשנות את המערך המקורי.

---

<a id="es-modules"></a>
## ES modules

**הגדרה:** מודול הוא קובץ עם scope משלו. מה שלא עשו לו `export` נשאר פרטי (encapsulation).
- **named export** (`export const X`): כמה בקובץ. מייבאים באותו שם, בתוך `{ }`, ואפשר לשנות שם עם `as`.
- **default export** (`export default ...`): רק אחד בקובץ. מייבאים בלי `{ }`, ובוחרים כל שם.
- **ה־`import` "עולים למעלה":** כל המודולים המיובאים רצים **לפני** שאר הקוד בקובץ.
- **module cache:** כל מודול רץ **פעם אחת**. כל `import` נוסף מקבל את אותו דבר, ולכן משתנה ברמת המודול משותף לכל האפליקציה (singleton).
- **ב־Node:** `"type": "module"` ב־`package.json`, וכותבים סיומת: `'./meals.js'`. המערכת הישנה היא CommonJS: `require` ו־`module.exports`.

</div>

```js
// counter.js – runs once, so there is ONE count for the whole app
let count = 0;
export function increment() {
  count += 1;
  return count;
}

// a.js:    import { increment } from './counter.js';  increment(); // 1
// main.js: import './a.js';
//          import { increment } from './counter.js';  increment(); // 2
```

<div dir="rtl">

**למה זה חשוב:** בצד השרת, חיבור למסד נתונים או logger נוצרים פעם אחת במודול, וכל הקבצים חולקים אותם. בצד הלקוח, Redux store עובד על אותו עיקרון. וגם: מודולים מחלקים קוד לחלקים קטנים עם גבולות ברורים, ומסתירים פרטים פנימיים.

**תשובה לראיון:** עוד לא ניסחתי אותה במילים שלי. נתרגל בסימולציית הראיון (מפגש 6).

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
