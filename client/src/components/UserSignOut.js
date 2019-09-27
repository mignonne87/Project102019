import React from 'react';
import { Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function SignOut({ context:{ actions:{ signOut } } }){
    signOut();
    // Clears authentication credential after sign on
    Cookies.remove('authenticatedUser');
    return <Redirect to='/'/>;
}