 
import axios from 'axios';
import { isExpired } from "react-jwt";


export const renewToken= async ()=>{
    console.log("Renewing Token")
    if (!sessionStorage.getItem("refresh"))
    {
      console.log("Can't renew Token:no Refresh token found maybe try loging in first!")
      return false
    }
    const form = new FormData()
    form.set('refresh', sessionStorage.getItem("refresh"));
    const response = await axios.post('http://localhost:8000/api/token/refresh/', form, {
      headers: { 'Content-Type': 'multipart/form-data'
      },
    })

    if (!response){
      console.log("Can't reach server or request rejected")
      return false
    }
    if(!response.data)
      return handleError(response.error)
    sessionStorage.setItem("access",response.data.access)
    return response.data.access
    
}

export const handleError= async (error)=>{
  if(!error)
  {
    console.log("Server unavailable")
  }
  else if (error.response) {
    // Request made and server responded
    console.log("Request made and server responded an error")
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    console.log("The request was made but no response was received")
    console.log(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log("Something happened in setting up the request that triggered an Error")
    console.log('Error', error.message);
  }
}

export const request= async (config)=>{
  let token = null;
  if(config.needToken){
    token = sessionStorage.getItem("access")
    if(isExpired(sessionStorage.getItem("access"))){
      console.log("token expired")
      token=await renewToken()
      // console.log("received token:",token)
      if(!token)
        return false
    }
    token = "Bearer "+token;
  }
  let form = new FormData();
  for(let i=0;i<config.formKey.length;i++){
    form.set(config.formKey[i], config.formValue[i]);
  }



  if(config.type==="post"){
    const response = await axios.post(config.url, form, {
    headers: { 'Content-Type': 'multipart/form-data',
            'Authorization': token
    },
    })
    if (!response){
      console.log("Can't reach server or request rejected")
      return false
    }
    if(!response.data)
      return handleError(response.error)
    return response.data
  }
  else if(config.type==="get"){
    // console.log(config.url,":", form.get("ChatroomID"), token)
    const response = await axios.get(config.url, form, {
    headers: { 'Content-Type': 'multipart/form-data',
            'Authorization': token
    },
    })
    if (!response){
      console.log("Can't reach server or request rejected")
      return false
    }
    if(!response.data)
      return handleError(response.error)
    return response.data
    
  }
  else{
    console.log("Type is incorrect")
    return false
  }
}
