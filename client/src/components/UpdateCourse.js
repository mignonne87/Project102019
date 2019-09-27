import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';

class UpdateCourse extends PureComponent{

    state = {
        id:'',
        title:'',
        description:'',
        estimatedTime:'',
        materialsNeeded:'',
        user : '',
        errorMessages: null,
        redirect: false,
        redirectMessages: null,
        isRender: false
    }

    chnage = (e)  => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]:value})
    }

    componentDidMount = async () => {

        const { data, authenticatedUser } = this.props.context;
        const { params } = this.props.match;
        
        try{
            const course = await data.getCourses(`/courses/${params.id}`);
            
            const {
                id,
                description,
                estimatedTime,
                materialsNeeded,
                title,
                User,
            } = course;

            if(course !== null){
                // if user doesnt not own the course it will throw a err
                //otherwise it will change state with the fetched data
                if(authenticatedUser.id !== User.id){
                    
                     let err = {
                        title:'Forbidden',
                        message:`Oh oh! You can't access this page. 
                        The course you're trying to update belongs to the user "${User.firstName}"`
                    }

                    throw err;

                }else{

                    await this.setState({
                        id,
                        title,
                        description,
                        estimatedTime,
                        materialsNeeded,
                        user : User,
                        isRender:true
                });
                }
            }

        }catch(err){
            if(!err.title)err.title = "Not Found";      
            this.setState({
                redirect:true,
                redirectMessages: err
            });
        }
    }


    
    //method which will submit the course with new data which is picked up from state.
    submit = async (e) => {
        e.preventDefault();

        const { 
            context: { 
                data, 
                cryptr: { decrypt },
                authenticatedUser
            }, 
            history
        } = this.props;

        //data in state
        const {
            id,
            description,
            estimatedTime,
            materialsNeeded,
            title,
        } = this.state;


        //new course data
        const newCourse = {
            description,
            estimatedTime,
            materialsNeeded,
            title,
        };

        const { emailAddress, password } = authenticatedUser;
        const decryptedString = decrypt(password);//decrypted password

        try{

            const res = await data.updateCourse(`/courses/${id}`, newCourse, emailAddress, decryptedString);            
            //if res has a message property, it means an error has occurred
            //otherwise it will move to home page
            if(res.message) throw res;
            else history.push('/');

        }catch(err){
        console.log(`Output => : UpdateCourse -> submit -> err`, err);

            if(err.status === 500){
                
                this.setState({
                    redirect:true,
                    redirectPath: '/error',
                    redirectMessages: err
                });

            }else{

                this.setState({ errorMessages: err.message });

            } 
        }
    }

    render(){
        
        //
        const style = {
            cursor: "pointer"
        };

        const {
            id,
            title,
            description,
            materialsNeeded,
            estimatedTime,
            user,
            errorMessages,
            redirect,
            isRender
        }= this.state;
        
        const { errDisplay, cancel } = this.props.context.actions;        

        if(redirect){
            return(
                <Redirect to={{
                    pathname: '/forbidden',
                    state: this.state.redirectMessages
                }} />
            );
            /*
            when a user is send to the forbidden page just right before getting there, they were getting a glance of the update course
            returned JSX, after a few test i made i found out the when a user was heading to the forbidden page, this componet renders 3 times,
            not sure if thats the mean cause. My solution to aviod that visual disturbances I've set a isRender propety in state,if its true only 
            */
        }else if(isRender){

            return(
                <div className="bounds course--detail">
                    <h1>Update Course</h1>
                    {
                        //diplayes validation messages if available
                        (errorMessages)?
                        errDisplay(errorMessages)
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
                                        onChange={this.chnage}
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
                                    onChange={this.chnage}>
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
                                            onChange={this.chnage}/>
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
                                            onChange={this.chnage}>
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
                                Update Course
                                </button>
                                <button 
                                style={style}
                                className="button button-secondary" 
                                onClick={e => cancel(e,`/courses/${id}`)}>
                                Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            );
        }
    return null
    }
}

export default UpdateCourse