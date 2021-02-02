 
import {request} from './requests';
export const encodeList=(list,selected)=>{
    
    let result = "";
    for(let k=0;k<list.length;k++)
    {
        result += "0";
    }
    if (!selected){
        return result   
    }
    // console.log(result)
    for(let i = 0;i<selected.length;i++)
    {
        const condition = (element) => element.value === selected[i].value;
        let index = list.findIndex(condition)
        // console.log( selected[i] ," index is ",index)
        result = result.substring(0, index) + '1' + result.substring(index + 1);
    }
    return result;
}
export const decodeList=(list,selected)=>{
    let result = [];
    for(let k=0;k<list.length;k++)
    {
        if(selected.charAt(k)==='1')
            result.push(list[k])
    }
    return result;
    // console.log(result)
}
export const getUserAvatar= async (id)=>{
    // console.log("inside get user avatar")
    const config = {
        url:"http://127.0.0.1:8000/api/show_profile_picture/",
        needToken:true,
        type:"post",
        formKey:[
            "id"
        ],
        formValue:[
            id
        ]
    }
    let data = null
    data = await request(config)
    // console.log(data)
    if (data.Base64)
        sessionStorage.setItem(id+":avatar",data.Base64)
    else
        sessionStorage.setItem(id+":avatar",
        "data:image/png;base64,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"
    )
    // console.log("received : ",data.Base64)
    // console.log(sessionStorage.getItem(id+":avatar"))
}
export const getActiveNav= ()=>{
    if(window.location.pathname.includes("qanda"))
        return "qanda"
    if(window.location.pathname.includes("discussion"))
        return "discussion"
    else 
    return "qanda"
}
export const getActiveChannel= ()=>{
    let temp = window.location.pathname.split(getActiveNav());
    if(temp[1])
        return parseInt(temp[1]);
    else
        return -1
}