const badlyFormatted = {
  name: "test",
  value: 123,
  items: [1, 2, 3],
  nested: { deep: { value: "hello world" } },
};

function poorlySpaced(a: number, b: string) {
  return { result: a + b.length, formatted: false };
}

export { badlyFormatted, poorlySpaced };
