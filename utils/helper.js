export const getInitials = (name) => {
  if (!name) return "";

  const words = name.split(" ");
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0]; // Use words[i][0] instead of words[1][0]
  }

  return initials.toUpperCase(); // Call the function correctly
};
