import { body, validationResult } from "express-validator";

function newTaskValidationRules() {
  return [
    body("taskname", "Taskname should be minimum 2 chars and maximum 150chars").isLength({ min: 2, max: 150 }),
    body("taskemail", "Taskemail should be valid email address").isEmail(),
    body("taskphone", "Taskphone should be valid").isMobilePhone(),
    body("isCompleted", "iscompleted should be a boolean").isBoolean(),  

  ];
}



function userRegistrationRules() {
  return [
    body("firstname", "Firstname cannot be empty").isLength({ min: 2, max: 30 }),
    body("email", "Email should be valid email address").isEmail(),
    body("password", "Password should be minimum 8 characters 1 Uppercase and 1 Lowercase and one special symbol  ").isStrongPassword({minLength:8,minLowercase:1,minUppercase:1,minSymbols:1}),
    body("phone", "Phone should be valid").isMobilePhone(),
    body("address", "Address cannot be empty").notEmpty(),  

  ];
}




function errorMiddleware(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    next();
  }
}

export { newTaskValidationRules,userRegistrationRules, errorMiddleware };
