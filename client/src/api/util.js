import {getToken} from './auth'

export function getAxiosConfig(){
    return {
        headers: {
            "Content-Type": 'application/json',
            "Authorization": `Bearer ${getToken()}`
        },
        responseType: "json",
        baseURL: '/api'
    }
}

export function getDownloadConfig(){
    return {
        ...getAxiosConfig(),
        responseType: 'blob'
    }
}

export function formatDate(date){
    var options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return date.toLocaleDateString('en-US', options)
}

export function downloadFile(data, fileName){
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.style.display = 'none'
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    setTimeout(function() {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }, 200)
}