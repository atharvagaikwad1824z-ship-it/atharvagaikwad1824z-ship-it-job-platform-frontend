const skillsDB = require("./skills");

const extractSkills = (resumeText) => {

  return skillsDB.filter(skill =>
    resumeText
      .toLowerCase()
      .includes(skill.toLowerCase())
  );

};

module.exports = extractSkills;