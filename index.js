const form = document.querySelector('.donate-form');
const input = document.querySelector('.search');
const submitBtn = document.querySelectorAll('.submit-button');
const orgContainer = document.querySelector('.org-container');
const searchForm = document.querySelector('.search-form');
const search = document.querySelector('.search');
const prevBtn = document.querySelector('.previous-button');
const nextBtn = document.querySelector('.next-button');
let buttonId ='';
let query = '';
let pgCounter = 0;
const baseURL = 'http://127.0.0.1:5001/pledge-test-aa5d1/us-central1/api'

function renderResults(results){
    console.log("The results>>>",results);
    results.forEach(item =>{
        if(item.name && item.website_url && item.logo_url){
            const orgCard = document.createElement('div');
            orgCard.classList.add('org-card')
            orgCard.innerHTML = `
            <h1 class="org-name">${item.name}</h1>
            <div class ="logo-container">
                <a href = ${item.website_url} target="_blank"><img class = "org-logo" src = "${item.logo_url}" alt = logo width="250" height="250" /></a>
            </div>
            `;
            orgContainer.appendChild(orgCard)
        }
        else{
            const orgCard = document.createElement('div');
            orgCard.classList.add('org-card')
            orgCard.innerHTML = `
            <h1 class="org-name">${item.name}</h1>
            <div class ="logo-container">
               <p>logo unavailable</p>
            </div>
            `;
            orgContainer.appendChild(orgCard)
        }
       
    })
}

function fetchInfo(endpoint){
    console.log("Hey Baus");
    return fetch(endpoint,{
       method:'GET'
   },
   ).then((response)=>{
        console.log(response);
       return response.json();
   }).then((jsonResponse)=>{
    //use .childElementCount to check if a parent container has child elements
        if(orgContainer.childElementCount > 0){
            orgContainer.innerHTML = '';
        }
       try{
           console.log(jsonResponse);
           renderResults(jsonResponse.results);
           return "good to go!";
       }catch(error){
           console.log("there is an error>>>",error);
       }
   });
}

function handleClick(e){
    e.preventDefault();
    const idNum = e.target.id;
    query =''
    pgCounter = 1;
    // if (buttonId == idNum){
    //     console.log("same id. exiting");
    //     return;
    // }
        buttonId = idNum;
        console.log("the id of button is >>>",buttonId);
        const endpoint = `${baseURL}/organizations?cause_id=${idNum}`;
        fetchInfo(endpoint);
}

const handleSubmit = (e) => {
    e.preventDefault();
    //console.log('hey baus. final query is>>>',query);
    const queryEndpoint = `${baseURL}/searchOrg?q=${query}`;
    fetchInfo(queryEndpoint)
    setTimeout(()=>{
        search.value = '';

    },3000)
}

const handleChange=(e) =>{
    query = e.target.value;
    buttonId = '';
    pgCounter = 1;
    //console.log("The searched term is>>>", query);
    const queryEndpointInt = `${baseURL}/searchOrg?q=${query}`;
    fetchInfo(queryEndpointInt)
}
const handleNext = (e) =>{
    pgCounter++;
    console.log("the counter is now>>>", pgCounter);
    if(!query && !buttonId){
        const endpoint = `${baseURL}/next?page=${pgCounter}`;
        fetchInfo(endpoint);
    }
    if(query){
        //buttonId='';
        const endpoint = `${baseURL}/next?page=${pgCounter}&q=${query}`;
        fetchInfo(endpoint);
    }
    if(buttonId){
        //query ='';
        console.log("There is a buttonId>>",buttonId);
        const endpoint = `${baseURL}/next?page=${pgCounter}&cause_id=${buttonId}`; 
        fetchInfo(endpoint);
    }

}
const handlePrev = (e) => {
    //console.log(e);
    if(pgCounter ==1){
        console.log("number is one");
        pgCounter=1;
        return;
    }
    else{
        pgCounter--;
        console.log("the counter is now>>>", pgCounter);
    }
    
    if(!query && !buttonId){
        const endpoint = `${baseURL}/next?page=${pgCounter}`;
        fetchInfo(endpoint);
    }
    // if(!query && buttonId){
    //     const endpoint = `http://localhost:4001/next?page=${pgCounter}&cause_id=${buttonId}`;
    //     fetchInfo(endpoint);
    // }

    if(query){
        //buttonId='';
        const endpoint = `${baseURL}/next?page=${pgCounter}&q=${query}`;
        fetchInfo(endpoint);
    }
    if(buttonId){
        //query='';
        const endpoint = `${baseURL}/next?page=${pgCounter}&cause_id=${buttonId}`; 
        fetchInfo(endpoint);
    }

}

submitBtn.forEach(button => button.addEventListener('click', handleClick));
prevBtn.addEventListener('click', handlePrev);
nextBtn.addEventListener('click',handleNext);
searchForm.addEventListener('submit', handleSubmit);
search.addEventListener('input',handleChange);


