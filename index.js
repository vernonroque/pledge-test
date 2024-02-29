const form = document.querySelector('.donate-form');
const input = document.querySelector('.search');
const submitBtn = document.querySelectorAll('.submit-button');
const orgContainer = document.querySelector('.org-container');

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
            console.log("items erased");
            orgContainer.innerHTML = '';
        }
       try{
           console.log(jsonResponse.results);
          
           jsonResponse.results.forEach(item =>{
               const orgCard = document.createElement('div');
               orgCard.classList.add('org-card')
               orgCard.innerHTML = `
               <h1 class="org-name">${item.name}</h1>
               <div class ="logo-container">
                   <img class = "org-logo" src = "${item.logo_url}" alt = logo />
               </div>
               `;
               orgContainer.appendChild(orgCard)
           })

       }catch(error){
           console.log("there is an error>>>",error);
       }
   });
}

function handleClick(e){
    e.preventDefault();
    const idNum = e.target.id;
    const endpoint = `http://localhost:4001/organizations?cause_id=${idNum}`;

    fetchInfo(endpoint)

}

submitBtn.forEach(button => button.addEventListener('click', handleClick));


