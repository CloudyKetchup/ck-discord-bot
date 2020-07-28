const values = [
  "token",
  "prefix",
  "version",
  "CLIENT_ID",
  "CLIENT_SECRET",
  "TWITCH_CLIENT_ID",
  "TWITCH_CLIENT_SECRET"
];

/***
 * Check if config.json file is present and contains all values
 * 
 * @return object with result
 */
const configValid = () =>
{
  let config;
  
  try
  {
    config = require("../config.json");
  } catch (e)
  {
    return { valid: false, error: "File config.json doesn't exist" };
  }

  for (val of values)
  {
    const value = config[val];

    if (!value)
    {
      return { valid: false, error: `Value ${val} not found in config.json` };
    }
    console.log(`--- ${val}`);
  }
  console.log("config.json is ok 👍")
  return { valid: true };
};

module.exports = { configValid };