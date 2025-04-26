import bcrypt from "bcrypt";

async function Decrypt(password, userPassword) {
  try {
    const isMatch = await bcrypt.compare(password, userPassword);
    return isMatch;
  } catch (error) {
    console.log("Error in password decryption");
    throw error;
  }
}

export default Decrypt;
