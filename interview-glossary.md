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
