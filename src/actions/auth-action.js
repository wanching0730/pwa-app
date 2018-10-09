import {browserHistory} from 'react-router';
import { verifyUser } from '../utils/http_function';
import { confirmAlert } from 'react-confirm-alert';
import firebase from 'firebase';

import {
    LOGIN_USER_SUCCESS,
    // LOGIN_USER_FAILURE,
    // LOGIN_USER_REQUEST,
    LOGOUT_USER,
    GET_FCM_TOKEN
} from '../constant';

export function getFcmTokenSuccessful(token) {
    return {
        type: GET_FCM_TOKEN,
        payload: {
            fcmToken: token
        }
    }
}

export function loginUserSuccessful(userName, userId, id, societies, token) {
    localStorage.setItem('token', token);

    return {
        type: LOGIN_USER_SUCCESS,
        payload: {
            userName: userName,
            userId: userId,
            id: id,
            societies: societies,
            token: token
        }
    }
}

export function logout() {
    localStorage.removeItem('token');
    return {
        type: LOGOUT_USER
    };
}

export function logoutAndRedirect() {
    return (dispatch) => {
        dispatch(logout());
        browserHistory.push('/');
    };
}

export function getFcmToken() {
    return function (dispatch) {
        const messaging = firebase.messaging();
        messaging
        .requestPermission()
        .then(() => {
            console.log("Have Permission");
            return messaging.getToken();
        })
        .then(token => {
            console.log("FCM Token:", token);
            messaging.usePublicVapidKey("BKCWz7kE-vlcFudrN0S4M9z-RTZVp8J-ncVbYQoRgObAeDfJEO8bHNYL0dgtTlpxRclWNUci_YwvfYUtbUK9lqQ");
            dispatch(getFcmTokenSuccessful(token));
            //fetch(`http://localhost:5000/get/notification/` + token);
        })
        .catch(error => {
            if (error.code === "messaging/permission-blocked") {
                console.log("Please Unblock Notification Request Manually");
            } else {
                console.log("Error Occurred", error);
            }
        });

        messaging.onMessage(function(payload) {
            console.log('Message received. ', payload);
            // ...
        });
    }
}

export function loginUser(postData) {
    return function (dispatch) {
        const data = Object.keys(postData).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(postData[key]);
        }).join('&');
    
        return verifyUser(data).then(result => result.json()).then(reply => {

            let user = reply["user"];
            let userSociety = reply["userSociety"];
            let token = reply["token"];
            var societies = [];
            
            let userName = user[0]["name"];
            let userId = user[0]["userId"];

            if(userName.substring(0,2) === "00") {
                console.log("username substring: " + userName.substring(0,2));
                let id = user[0]["staffId"];
                if(userSociety.length > 0) {
                    for(var i = 0; i < userSociety.length; i++) {
                        societies.push({
                            societyId: userSociety[i]["societyId"],
                            name: userSociety[i]["name"],         
                            position: userSociety[i]["position"],
                            joinDate: "-"
                        })
                    }
                    console.log("user societies: " + societies);
                }
                
                dispatch(loginUserSuccessful(userName, userId, id, societies, token));
            } else {
                console.log("username substring: " + userName.substring(0,2));
                let id = user[0]["studentId"];
                if(userSociety.length > 0) {
                    for(var i = 0; i < userSociety.length; i++) {
                        societies.push({
                            societyId: userSociety[i]["societyId"],
                            name: userSociety[i]["name"],
                            category: userSociety[i]["category"],
                            position: userSociety[i]["position"],
                            joinDate: userSociety[i]["joinDate"]
                        })
                    }
                }

                dispatch(loginUserSuccessful(userName, userId, id, societies, token));
            }

            browserHistory.push("/home");

            console.log("token: " + reply["token"]);
            console.log("token in local storage: " + localStorage.getItem('token'));
        })
        .catch(error => {
            confirmAlert({
                title: 'Invalid Login',
                message: 'Your user name and password are not valid' + error,
                buttons: [
                    {
                        label: 'Close',
                        onClick: () => {
                            console.log('Click close');
                        }
                    }
                ]
              })
        });
    }
}