import React, { useState, useEffect, useReducer,useContext } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../store/auth-context";
import Input from '../UI/Input/Input'

const emailReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.includes("@") };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.includes("@") };
  }
  return { value: "", isValid: false };
};

const passwordReducer = (state,action)=> {
  if(action.type === 'INPUT_PASSWORD'){
    return {value : action.val, isValid: action.val.trim().length > 6}
  }
  if(action.type === 'PASSWORD_BLUR'){
    return {value : state.value, isValid: state.value.trim().length > 6}
  }
  return {value:'', isValid:false}
}

const Login = (props) => {
  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });

  // const [enteredEmail, setEnteredEmail] = useState("");
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState("");
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);


  //destructuring object (because we want only isValid property not entire object)
  const {isValid: emailIsValid}= emailState;
  const {isValid: passwordIsValid} = passwordState;

  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log('Chcking for Validity')
      setFormIsValid(
        emailIsValid && passwordIsValid
      );
    }, 500);

    return ()=> {
      console.log('CleanUp')
      clearTimeout(identifier)
    }
  }, [emailIsValid,passwordIsValid])

  //email
  const emailChangeHandler = (event) => {
    dispatchEmail({ type: "USER_INPUT", val: event.target.value });

    // setFormIsValid(
    //   emailState.value.includes("@") && passwordState.value.trim().length > 6
    // );
  };

  //password
  const passwordChangeHandler = (event) => {
    dispatchPassword({type:'INPUT_PASSWORD',val:event.target.value})

    // setFormIsValid(
    //   emailState.value.includes("@") && passwordState.value.trim().length > 6
    // );
  };

  //Blur email input
  const validateEmailHandler = () => {
    dispatchEmail({type:'INPUT_BLUR'})
  };

  //Blur password input
  const validatePasswordHandler = () => {
    dispatchPassword({type: 'PASSWORD_BLUR'})
  };

  const ctx = useContext(AuthContext)

  const submitHandler = (event) => {
    event.preventDefault();
    ctx.onLogin(emailState.value, passwordState.value);
  };



  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input type="email" label="E-Mail" id="email" value={emailState.value} isValid={emailIsValid} onChange={emailChangeHandler} onBlur={validateEmailHandler}/>
        
          <Input
            type="password"
            id="password"
            label="Password"
            isValid={passwordIsValid}
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
