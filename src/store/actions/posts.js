import {
    SET_POSTS,
    ADD_COMMENT,
    CREATING_POST,
    POST_CREATED
} from './actionTypes'
import { setMessage } from './message'
import axios from 'axios'

export const addPost = post => {
    return (dispatch, getState) => {
        dispatch(creatingPost())
        axios({
            url: 'uploadImage',
            baseURL: 'https://us-central1-lambe-d5175.cloudfunctions.net/uploadImage',
            method: 'post',
            data: {
                image: post.image.base64
            }
        })
        .catch(err => {
            dispatch(setMessage({
                title: 'Erro',
                text: 'Ocorreu um erro inesperado!'
            }))
        })              
        .then(resp => {
            post.image = resp.data.imageUrl
            // axios.post('/posts.json', { ...post })
            //axios.post(`/posts.json?auth=${getState().user.token}`, { ...post })
            axios.post('/posts.json', { ...post })
                .then(res => {
                    dispatch(fetchPosts())
                    dispatch(postCreated())
                })
                .catch(err => {
                    dispatch(setMessage({
                        title: 'Erro',
                        text: err
                    }))
                })    
        })      
    }
}

export const addComment = payload => {
    return (dispatch, getState) => {
        axios.get(`/posts/${payload.postId}.json`)
            .then(res => {
                const comments = res.data.comments || []
                comments.push(payload.comment)
                // console.log(comments)
                // console.log(getState().user.token)
                // console.log(`/posts/${payload.postId}.json?auth=${getState().user.token}`)
                axios.patch(`/posts/${payload.postId}.json`, { comments })
                    .then(res => {
                        dispatch(fetchPosts())
                    })
                    .catch(err => {
                        console.log(err)
                        dispatch(setMessage({
                            title: 'Erro',
                            text: 'Ocorreu um erro inesperado!'
                        }))
                    })
                    
            })
            .catch(err => console.log(err))
    }
}

export const setPosts = posts => {
    return {
        type: SET_POSTS,
        payload: posts
    }
}

export const fetchPosts = () => {
    return dispatch => {
        axios.get('/posts.json')
            .then(res => {
                const rawPosts = res.data
                const posts = []
                for (let key in rawPosts) {
                    posts.push({
                        ...rawPosts[key],
                        id: key
                    })
                }

                dispatch(setPosts(posts.reverse()))
            })
            .catch(err => {
                dispatch(setMessage({
                    title: 'Erro',
                    text: 'Ocorreu um erro inesperado!'
                }))
            })
            
    }
}

export const creatingPost = () => {
    return {
        type: CREATING_POST
    }
}

export const postCreated = () => {
    return {
        type: POST_CREATED
    }
}