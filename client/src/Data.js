const apiBaseUrl = 'http://localhost:5000/api';
export default class Data {
  //messag for http status 500
  serverError = {
    status: 500,
    title:'Error',
    message:'Sorry! We just encountered an unexpected error.'
  }
 
  /**
   * 
   * @param {string} path value of api endpoint
   * @param {string} method HTTP mothed
   * @param {object} body values to be send in the request body 
   * @param {boolean} requiresAuth set if authentication is needed, 
   * if needed credentials must be giving a value else it will fail
   * @param {object} credentials object of email and pasword value
   */
  api(path, method = 'GET', body = null, requiresAuth = false, credentials = null) {
    const url = apiBaseUrl + path;
  
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    };

    if (body !== null) {
      options.body = JSON.stringify(body);
    }

    if (requiresAuth) {    
      const encodedCredentials = btoa(`${credentials.username}:${credentials.password}`);
      options.headers['Authorization'] = `Basic ${encodedCredentials}`;
    }
    return fetch(url, options);
  }

  /**
   * Gets logged in users details
   * These three http status does respond from request
   * 401 - 'Unauthorized'
   * 200 - 'OK'
   * 500 - 'Server error'
   * errors will always throw an object
   * @param {string} username pass in users email
   * @param {string} password pass in users password
   */
  async getUser(email, password) {
    const response = await this.api(`/users`, 'GET', null, true, { username: email, password });
    const res = await response.json();
    if (response.status === 200) {
      return res;
    }else if (response.status === 401) {
      //if status is 401 an error nothing to the user if email or password is wrong;
      return {
        isNull: true,
        errors: [res.errors[1]]
      };
    }else if (response.status === 500) {
      throw this.serverError;
    }else {
      throw res;
    }
  }

  /**
   * signs a user up to the web app
   * These three http status does respond from request
   * 400 - 'SequelizeValidationError' (if any)
   * 201 - 'Success/Created'
   * 500 - 'Server error'
   * errors will always throw an object
   * @param {object} user an object of user details will be passed in but
   *  it object must contian password and confirmPassword
   */
  async createUser(user) {
      const response = await this.api('/users', 'POST', user);
      if (response.status === 201) {
        return [];
      }else if (response.status === 400) {
        const res = await response.json()

        throw res;
      }else if (response.status === 500) {
        throw this.serverError;
      }else {
        throw new Error();
      };
  }

  /**
   * Gets all of the courses or one course depending the url path you feed it,
   * to get all courses pass in '/courses' and to get one course 
   * pass in '/courses/:id' (id is the courses id number)
   * These three http status does respond from request
   * 404 - ''Course not found'
   * 200 - 'OK'
   * 500 - 'Server error'
   * errors will always throw an object
   * @param {string} path value of api endpoint
   */
  async getCourses(path) {
    const response = await this.api(path, 'GET');
    const res = await response.json()
    if (response.status === 200) {
      return res;
    }else if (response.status === 500) {
      throw this.serverError;
    }else {
      if(res.hasOwnProperty('message'))throw res;
      else throw new Error();
    }
  }

  /**
   * Create's a new coruses, if it fails it will retrun 
     validation error will will be diplayed for the user,
     in order to create user must be authenticated & authorized
   * These three http status does respond from request
   * 404 - 'SequelizeValidationError'
   * 201 - 'Success/Created'
   * 500 - 'Server error'
   * errors will always throw an object
   * @param {string} path value of api endpoint
   * @param {object} body  values to be send in the request body 
   * @param {string} email current users emaill address 
   * @param {string} password current users password address
   */
  async createCourses(path, body , email, password) {
    const response = await this.api(path, 'POST', body, true, { username: email, password });       
    if (response.status === 201) {
      return [];
    
    }else if (response.status === 400) {
      const res = await response.json()
      throw res;
    }else if (response.status === 500) {
      throw this.serverError;
    }else {
      throw new Error()
    };
  }
/**
 * Delete's a course, the user must be authenticated & authorized 
 * to delete a course, one user can not delete another user's course.
 * there are 4 kinds of http status can respond from the request
 * 403 - 'Unable to update other users\'s courses'
 * 404  - 'Courses not found / Unable to update'
 * 204  - 'Success/No content'
 * 500  - 'Server error'
 * errors will always throw an object
 * @param {value of api endpoint} path 
 * @param {string} email current users emaill address
 * @param {string} password current users password address
 */
  async deleteCourses(path, email, password) {
    const response = await this.api(path, 'DELETE', null, true, { username: email, password });
    const checkStatus = response.status === 404 
                     || response.status === 403;     
    if (response.status === 204) {
      return [];
    }else if (checkStatus) {
      const res = await response.json();
      return res.message;
    }else if (response.status === 500) {
      throw this.serverError;
    }else {
      throw new Error();
    };
  }
/**
 * Updates's a course, the user must be authenticated & authorized 
 * to Update a course, one user can not Update another user's course.
 * there are 5 kinds of http status can respond from the request
 * 400 will give back - 'No empty objects'
 * another 400 will give back - 'SequelizeValidationError' (if any)
 * 403 - 'Unable to update other users\'s courses'
 * 404 - 'Courses not found / Unable to update'
 * 204 - 'Success/No content'
 * 500 - 'Server error'
 * errors will always throw an object
 * @param {value of api endpoint} path 
 * @param {object} body values to be send in the request body 
 * @param {string} email current users emaill address
 * @param {string} password current users password address
 */
  async updateCourse(path, body, email, password){
    const response = await this.api(path, 'PUT', body, true, { username: email, password });
    const checkStatus =  response.status === 400 
                || response.status === 404 
                || response.status === 403;
    if(checkStatus){
      const res = await response.json();
      return res;
    }else if(response.status === 204){
      return []
    }else if (response.status === 500) {
      throw this.serverError;
    }else{
      throw new Error()
    }
  }
}