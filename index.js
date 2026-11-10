import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { lessons as lessonsModules } from "./src/lessons/registry.js";

const main = async () => {
  const { argv: cliArgs } = process;
  // The lesson number passed as a command-line argument
  // Example usage: node index.js -- 3 (to run lesson 3)
  const requestedLesson = cliArgs[2];

  if (requestedLesson !== undefined) {
    const lessonIndex = Number(requestedLesson) - 1;
    const lesson = Number.isInteger(lessonIndex) ? lessonsModules[lessonIndex] : undefined;
    if (!lesson) {
      throw new RangeError(
        `Invalid lesson number "${requestedLesson}". Choose a number from 1 to ${lessonsModules.length}.`,
      );
    }

    await runLesson(lesson);
    return;
  }

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

      await runLesson(lesson);
      return;
    }
  } finally {
    prompt.close();
  }
};

const runLesson = async (lesson) => {
  const { default: runLessonModule } = await lesson.load();
  if (typeof runLessonModule !== "function")
    throw new TypeError(`Lesson "${lesson.title}" must export a default function.`);

  await runLessonModule();
};

await main();
