const calculateATS = (requiredSkills, candidateSkills) => {

  if (!requiredSkills.length) {
    return {
      atsScore: 100,
      matchedSkills: [],
      missingSkills: []
    };
  }

  const matchedSkills = requiredSkills.filter(skill =>
    candidateSkills.some(
      candidate =>
        candidate.toLowerCase() === skill.toLowerCase()
    )
  );

  const missingSkills = requiredSkills.filter(skill =>
    !candidateSkills.some(
      candidate =>
        candidate.toLowerCase() === skill.toLowerCase()
    )
  );

  const atsScore = Math.round(
    (matchedSkills.length / requiredSkills.length) * 100
  );

  return {
    atsScore,
    matchedSkills,
    missingSkills
  };
};

module.exports = calculateATS;