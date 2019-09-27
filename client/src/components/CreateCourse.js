import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
class NewCourse extends Component{

  state = {
      title:'',
      description:'',
      estimatedTime:'',
      materialsNeeded:'',
      user : this.props.context.authenticatedUser,
      errorMessages: null,
      redirect: false,
      redirectPath: null,
      redirectMessages: null,
  }

  submit = async (e) => {

    e.preventDefault();
    const { authenticatedUser, cryptr, data } = this.props.context;

    const {
      title,
      description,
      estimatedTime,
      materialsNeeded,
      user
    } = this.state;

    const newData = {
      title,
      description,
      estimatedTime,
      materialsNeeded,
      user
    }

    const { emailAddress, password } = authenticatedUser;
    const decryptedString = cryptr.decrypt(password);//decrypt password

    try{
      
      await data.createCourses('/courses', newData, emailAddress ,decryptedString);
      this.props.history.push('/');//Goes home after course is created
    
    }catch(err){

      if(err.status === 500){
        this.setState({
            redirect:true,
            redirectPath: '/error',
            redirectMessages: err
        });
      }  else if(err.message.length > 0){
        this.setState({ errorMessages: err.message });
      }
    }
  }

  //changes value of state from input form 
  change = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({[name]: value});
  }



  render(){
    
    //css cursor style 
    const style = {
      cursor: "pointer"
    };

    const {
      title,
      description,
      estimatedTime,
      materialsNeeded,
      user,
      errorMessages,
      redirect,
      redirectPath,
      redirectMessages
    } = this.state;

    const { errDisplay,cancel } = this.props.context.actions;
  
    //any error occurred user will be directed to an error page
    if(redirect){
      return <Redirect to={{
          pathname: redirectPath,
          state: redirectMessages
      }} />
    }

    return(
      <div className="bounds course--detail">
        <h1>Create Course</h1>
        {
         //Show validation messages if any
          (errorMessages !== null)
          ?errDisplay(errorMessages)
          :false
        }
        <div>
          <form onSubmit={this.submit}>
            <div className="grid-66">
              <div className="course--header">
                <h4 className="course--label">Course</h4>
                <div>
                  <input 
                  id="title" 
                  name="title" 
                  type="text" 
                  className="input-title course--title--input" 
                  placeholder="Course title..."
                  value={title}
                  onChange={this.change}
                  />
                </div>
                <p>By {`${user.firstName} ${user.lastName}`}</p>
              </div>
              <div className="course--description">
                <div>
                  <textarea 
                  id="description" 
                  name="description" 
                  className="" 
                  placeholder="Course description..."
                  value={description}
                  onChange={this.change}>
                  </textarea>
                </div>
              </div>
            </div>
            <div className="grid-25 grid-right">
              <div className="course--stats">
                <ul className="course--stats--list">
                  <li className="course--stats--list--item">
                    <h4>Estimated Time</h4>
                    <div>
                      <input 
                      id="estimatedTime" 
                      name="estimatedTime" 
                      type="text" 
                      className="course--time--input"
                      placeholder="Hours" 
                      value={estimatedTime}
                      onChange={this.change}
                      />
                    </div>
                  </li>
                  <li className="course--stats--list--item">
                    <h4>Materials Needed</h4>
                    <div>
                      <textarea 
                      id="materialsNeeded" 
                      name="materialsNeeded" 
                      className="" 
                      placeholder="List materials..."
                      value={materialsNeeded}
                      onChange={this.change}>
                      </textarea>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="grid-100 pad-bottom">
              <button
              style={style}
              className="button" 
              type="submit">
              Create Course
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
      </div>
    );
  }
}

export default NewCourse