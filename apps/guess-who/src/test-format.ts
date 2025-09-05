const badlyFormatted = {
  name: "test",
  value: 123,
  items: [1, 2, 3],
  nested: { deep: { value: "hello world" } },
};

// ESLint should catch these any/as issues:
const myArray = [1, 2, 3, 4, 5];
const myString = "single quotes should be double quotes"; // quotes rule
const trailing = "extra semicolon"; // extra semicolon
const spacing = myArray.length + 1; // spacing around operators

// These should trigger ESLint errors:
const badAny: any = "this should be caught";
const badAssertion = myArray as any;

function poorlySpaced(a: number, b: string) {
  console.log("debugging stuff");
  const result = a + b.length;
  const badUsage = badAny.someProperty; // unsafe member access
  return { result: result, formatted: false, badUsage };
}

// Use variables to avoid unused warnings - trigger hook
console.log(myString, trailing, spacing, badAssertion);

export { badlyFormatted, poorlySpaced };
