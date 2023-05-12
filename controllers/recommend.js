// For python script using Node.js
const { spawn } = require('child_process');
const {userCalorieHelper} = require("../controllers/goal");

const util = require('util');
const exec = util.promisify(require('child_process').exec);

exports.recommendRecipe = async (userId) => {
  let [status, caloriesInfo] = await userCalorieHelper(userId);
  const calories = caloriesInfo.caloriesMappings;
  delete calories['start_date'];
  delete calories['end_date'];
  if (status === 'success') {
    try {
      console.log(`calling python script ${JSON.stringify(calories)}`);
      console.log("calling recommend.js userId", userId);
      const { stdout, stderr } = await exec(`python3 recommendation.py '${JSON.stringify(calories)}'`);
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        throw new Error('Internal Server Error: Something went wrong.');
      }
      const parsedResult = JSON.parse(stdout.trim());
      const final = Object.keys(parsedResult).map((key) => {
        return { [key]: parsedResult[key] };
      });
      console.log(`final recommendation ${final.length}`);
      return final;
    } catch (error) {
      console.error(`error: ${error}`);
      throw new Error('Internal Server Error: Something went wrong.');
    }
  } else {
    console.log('some probs here');
    throw new Error('User Details Not found');
  }
}
