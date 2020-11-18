import {
    USER_LOGGED_IN,
    USER_LOGGED_OUT,
    LOADING_USER,
    USER_LOADED
} from './actionTypes'
import axios from 'axios'
import { setMessage } from './message'
import { firebase } from '../../firebase/config'

const authBaseURL = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty'
const API_KEY = 'AIzaSyC-ck1_8cK9E8uxftKHJzxqjZZQ6cLFaAU'

export const userLogged = user => {
    return {
        type: USER_LOGGED_IN,
        payload: user
    }
}

export const logout = () => {
    return {
        type: USER_LOGGED_OUT
    }
}

export const createUser = user => {
    return dispatch => {
        dispatch(loadingUser())
        firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
            .then(res => {
                if (res.additionalUserInfo.isNewUser) {
                    axios.put(`/users/${res.user.uid}.json`, {
                        name: user.name
                    })
                    .then(() => {
                        dispatch(login(user))
                    })
                    .catch(err => {
                        dispatch(setMessage({
                            title: 'Erro',
                            text: 'Ocorreu um erro inesperado!'
                        }))
                    })
                }             
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    dispatch(setMessage({
                        title: 'Erro',
                        text: 'That email address is already in use!'
                    }))
                }

                if (error.code === 'auth/invalid-email') {
                    dispatch(setMessage({
                        title: 'Erro',
                        text: 'That email address is invalid!'
                    }))
                }

                console.error(error);
            })
        }
    }
    
export const loadingUser = () => {
    return {
        type: LOADING_USER
    }
}

export const userLoaded = () => {
    return {
        type: USER_LOADED
    }
}

export const login = user => {
    return dispatch => {
        dispatch(loadingUser())
        firebase.auth().signInWithEmailAndPassword(user.email, user.password)
            .then(res => {
                if (!res.additionalUserInfo.isNewUser) {
                    user.token = res.user.uid
                    console.log(res.user)
                    axios.get(`/users/${res.user.uid}.json`)
                        .then(res => {
                            delete user.password
                            user.name = res.data.name
                            dispatch(userLogged(user))
                            dispatch(userLoaded())
                        } )
                        .catch(err => {
                            dispatch(setMessage({
                                title: 'Erro',
                                text: 'Ocorreu um erro inesperado!'
                            }))
                        })
                }
            })
            .catch(error => {
                if (error.code === 'auth/wrong-password') {
                    dispatch(setMessage({
                        title: 'Erro',
                        text: 'The password is invalid or the user does not have a password!'
                    }))
                }

                if (error.code === 'auth/invalid-email') {
                    console.log('That email address is invalid!');
                }
            })
    }
}

    // return {
    //     type: USER_LOGGED_IN,
    //     payload: user
    // }
    // return dispatch => {
    //     dispatch(loadingUser())
    //     axios.post(`${authBaseURL}/verifyPassword?key=${API_KEY}`, {
    //         email: user.email,
    //         password: user.password,
    //         returnSecureToken: true
    //     })
    //         .catch(err => {
    //             dispatch(setMessage({
    //                 title: 'Erro',
    //                 text: 'Ocorreu um erro inesperado!'
    //             }))
    //         })
    //         .then(res => {
    //             if (res.data.localId) {
    //                 user.token = res.data.idToken
    //                 axios.get(`/users/${res.data.localId}.json`)
    //                     .catch(err => {
    //                         dispatch(setMessage({
    //                             title: 'Erro',
    //                             text: 'Ocorreu um erro inesperado!'
    //                         }))
    //                     })
    //                     .then(res => {
    //                         delete user.password
    //                         user.name = res.data.name
    //                         dispatch(userLogged(user))
    //                         dispatch(userLoaded())
    //                     })
    //             }
    //         })
    // }
//}