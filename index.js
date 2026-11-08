import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { lessons as lessonsModules } from "./src/lessons/registry.js";

const main = async () => {
  const prompt = createInterface({ input: stdin, output: stdout });
  const inputLines = prompt[Symbol.asyncIterator]();

  try {
    while (true) {
      console.log("\nSelect a lesson to run:");
      lessonsModules.forEach((lesson, index) => {
        console.log(`${index + 1}. ${lesson.title}`);
      });
      console.log("0. Exit");

      stdout.write("Run lesson... > ");
      const { value, done } = await inputLines.next();
      if (done) return;

      const selection = value.trim();
      if (selection === "0") return;

      const lessonIndex = Number(selection) - 1;
      const lesson = Number.isInteger(lessonIndex) ? lessonsModules[lessonIndex] : undefined;
      if (!lesson) {
        console.log("Invalid selection. Please choose a lesson number or 0 to exit.");
        continue;
      }

      const { default: runLesson } = await lesson.load();
      if (typeof runLesson !== "function")
        throw new TypeError(`Lesson "${lesson.title}" must export a default function.`);

      await runLesson();
      return;
    }
  } finally {
    prompt.close();
  }
};

await main();
