const form = document.querySelector('.donate-form');
const input = document.querySelector('.search');
const submitBtn = document.querySelector('.form-button');
const endpoint = 'http://localhost:4001/organizations';
const orgContainer = document.querySelector('.org-container');


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

submitBtn.addEventListener('click', handleClick);
