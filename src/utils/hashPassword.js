async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(10); // Salt rounds (security factor)
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.log("Error password hashing api");
    throw error;
  }
}

export default hashPassword;
