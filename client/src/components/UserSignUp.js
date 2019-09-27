import React,{ Component } from 'react';
import { Link } from 'react-router-dom';

class SignUp extends Component{

    state = {
        firstName:'',
        lastName:'',
        emailAddress:'',
        password:'',
        confirmPassword:'',
        errorMessages: null,
    }

    beforeSubmit = (e) => {
        e.preventDefault();
        const { password, confirmPassword } = this.state;

        if(password !== confirmPassword){
            //if both pass dont match set error message
            this.setState({
                errorMessages:['Make Sure Both Password Matchs']
            })
        }else {
            // Overwise submits
            this.submit()
        }
    }

    submit = async () => {

        const { data, actions } = this.props.context;

        const {
            firstName,
            lastName,
            emailAddress,
            password,
        } = this.state;
    
        const user = {
            firstName,
            lastName,
            emailAddress,
            password,
        };

        try{
            //once user is created, user will be sidned in and taken to home page
            await data.createUser(user);
            await actions.signIn(emailAddress, password);
            this.props.history.push('/');

        }catch(err){

            if(err.message) this.setState({ errorMessages: err.message });
            console.log(err);

        }
    }

  //changes value of state from input form 
  change = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({ [name]: value });
    }

    render(){
        //css cursor style
        const style = {
            cursor: "pointer"
        }

        const {
            firstName,
            lastName,
            emailAddress,
            password,
            confirmPassword,
            errorMessages
        } = this.state;

        const { errDisplay, cancel } = this.props.context.actions


        return(
            <div className="bounds">
                <div className="grid-33 centered signin">
                <h1>Sign Up</h1>
                {
                    //diplayes validation messages if available 
                    (errorMessages)?
                    errDisplay(errorMessages)
                    :false
                }
                <div>
                    <form onSubmit={this.beforeSubmit}>
                        <div>
                            <input 
                            id="firstName" 
                            name="firstName" 
                            type="text" 
                            className="" 
                            placeholder="First Name" 
                            value={firstName} 
                            onChange={this.change} />
                            
                        </div>
                        <div>
                            <input 
                            id="lastName" 
                            name="lastName" 
                            type="text" 
                            className="" 
                            placeholder="Last Name" 
                            value={lastName} 
                            onChange={this.change} />
                        </div>
                        <div>
                            <input 
                            id="emailAddress" 
                            name="emailAddress" 
                            type="text" 
                            className="" 
                            placeholder="Email Address" 
                            value={emailAddress} 
                            onChange={this.change} />
                        </div>
                        <div>
                            <input 
                            id="password" 
                            name="password" 
                            type="password" 
                            className="" 
                            placeholder="Password" 
                            value={password} 
                            onChange={this.change} 
                            autoComplete="off"
                            />
                        </div>
                        <div>
                            <input 
                            id="confirmPassword" 
                            name="confirmPassword" 
                            type="password" 
                            className="" 
                            placeholder="Confirm Password"
                            value={confirmPassword} 
                            onChange={this.change} 
                            autoComplete="off"
                            />
                        </div>
                        <div className="grid-100 pad-bottom">
                            <button 
                            style={style} 
                            className="button" 
                            type="submit"
                            onClick={e => this.beforeSubmit(e)}>
                            Sign Up
                            </button>
                            <button 
                            style={style} 
                            className="button button-secondary" 
                            onClick={e => cancel(e)}>
                            Cancel
                            </button>
                        </div>
                    </form>
                </div>
                <p>&nbsp;</p>
                <p>Already have a user account? <Link to="/signin">Click here</Link> to sign in!</p>
                </div>
            </div>
        );
    }
}

export default SignUp