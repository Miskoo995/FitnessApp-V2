

import axios from 'axios'

const spoonacular = axios.create({
  baseURL: 'https://api.spoonacular.com/mealplanner/generate?',
  
});

export default spoonacular