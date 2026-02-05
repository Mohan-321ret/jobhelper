import fs from "fs";
import mammoth from "mammoth";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse"); // ✅ works in v1.1.1

export const extractResumeText = async (file) => {
  let text = "";

  if (file.mimetype === "application/pdf") {
    const buffer = fs.readFileSync(file.path);
    const data = await pdfParse(buffer);
    text = data.text;
  } else {
    const result = await mammoth.extractRawText({ path: file.path });
    text = result.value;
  }

  fs.unlinkSync(file.path); // delete file
  return text;
};
