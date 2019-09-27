import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';

//components
import Header from './components/Header';
import Courses from './components/Courses';
import NewCourse from './components/CreateCourse';
import UpdateCourse from './components/UpdateCourse';
import CourseDetail from './components/CourseDetail';
import UserSignUp from './components/UserSignUp';
import UserSignIn from './components/UserSignIn';
import UserSignOut from './components/UserSignOut';
import ErrorHandler from './components/ErrorHandler';
import withContext from './Context';

//components withContext
const HeaderWithContext = withContext(Header);
const CoursesWithContext = withContext(Courses);
const NewCourseWithContext = withContext(NewCourse);
const UpdateCourseWithContext = withContext(UpdateCourse);
const UsersCourseWithContext = withContext(CourseDetail);
const SignUpWithContext = withContext(UserSignUp);
const SignInWithContext = withContext(UserSignIn);
const SignOutWithContext = withContext(UserSignOut);
const ErrorHandlerWithContext = withContext(ErrorHandler);


const PrivateRoute = withContext(({context,component: Component, ...rest }) => {
  return (
    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /signin page
    <Route
      {...rest}
      render={(props) => context.authenticatedUser !== null ? (
          <Component {...props} />
        ) : (
          <Redirect to={{
            pathname: '/signin',
            state: { from: props.location }
          }} />
        )
      }
    />
  );
})


function App() {
  return (
    <Router>
    <React.Fragment>
      <HeaderWithContext />
      <Switch>
      <Route exact path="/" component={CoursesWithContext} />
      <PrivateRoute exact path="/courses/create" component={NewCourseWithContext} />
      <PrivateRoute exact path="/courses/:id/update" component={UpdateCourseWithContext} />
      <Route exact path="/courses/:id" component={UsersCourseWithContext} />
      <Route path="/signup" component={SignUpWithContext} />
      <Route path="/signin" component={SignInWithContext} />
      <Route path="/signOut" component={SignOutWithContext} />
      <Route path="/forbidden" component={ErrorHandlerWithContext} />
      <Route component={ErrorHandlerWithContext} />
      </Switch>
    </React.Fragment>
  </Router>
  );
}

export default App;