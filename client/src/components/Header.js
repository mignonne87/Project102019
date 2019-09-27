import React,{ Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';

function Header({ context:{ authenticatedUser }, location:{ pathname }}){
 //css styling for logo color
  const style = {
    color:'#fff'
  }

  return (
    <Fragment>
      <div className="header">
        <div className="bounds">
          <h1 className="header--logo"><Link style={style} to="/">Courses</Link></h1>
          <nav>
          {
            //if your is authenticated then render welcome message and sign out button in header
            (authenticatedUser !== null)?
            <Fragment>
              <span>Welcome,{` ${authenticatedUser.firstName} ${authenticatedUser.lastName}`} </span>
              <Link className="signout" to="/signout">Sign Out</Link>
            </Fragment>
            :
            <Fragment>
              <Link className="signup" to="/signup">Sign Up</Link>
              <Link 
              className="signin" 
              to={{ pathname:"/signin" , 
                    state:{
                      from :pathname
                      }}}>Sign In</Link>
            </Fragment>
          }
          </nav>
        </div>
      </div>
    </Fragment>
  );
}

export default withRouter(Header)