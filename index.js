const form = document.querySelector('.donate-form')
const input = document.querySelector('.search')
const submitBtn = document.querySelector('.form-button')
const endpoint = 'http://localhost:4001/organizations'

function handleClick(e){
    e.preventDefault();

    console.log("Hey Baus");
     return fetch(endpoint,{
        method:'GET'
    },
    ).then((response)=>{
        console.log(response);
        return response.json();
    }).then((jsonResponse)=>{
        try{
            console.log(jsonResponse);

        }catch(error){
            console.log("there is an error>>>",error);
        }
    });
}

submitBtn.addEventListener('click', handleClick);
