const pdfParse = require("pdf-parse");

const parseResume = async (buffer) => {
  const data = await pdfParse(buffer);

  return data.text;
};

module.exports = parseResume;