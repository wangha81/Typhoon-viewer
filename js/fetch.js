export default function (url) {
    return new Promise((res, rej) => {
        fetch(url, {
            method: 'GET',
            mode: 'cors',
            redirect: 'follow',
            headers: new Headers({
                'Content-Type': 'text/json'
            })
        }).then(function (response) {
            //處理 response    .json()/.text() 
            return response.json();
        }).then(r => {
            res(r);
        })
    });
}