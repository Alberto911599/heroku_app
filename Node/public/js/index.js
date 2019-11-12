let url = 'http://localhost:8080/api/pets';
    // let settings = {
    //     method: 'GET'
    // };
    // fetch(url, settings)
    //     .then(response => {
    //         if(response.ok){
    //             return response.json();
    //         }
    //         throw new Error(response.statusText);
    //     })
    //     .then( responseJSON => {
    //         // console.log(responseJSON);
    //         for(let i = 0; i < responseJSON.length; i++){
    //             $(".listOfPets").append(`<li>
    //                                         ${responseJSON[i].name}
    //                                      </li>`)
    //         }
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     })

function init(){
    newPet = {name : "rosco", typeOfPet : "iguana"};
    addPet(newPet);
    getAllPets();
}

function getAllPets(){
    $.ajax({
        url:(url), //url/endpointToAPI,
        method: "GET", 
        data: {}, //Info sent to the API
        dataType : "json", //Returned type od the response
        ContentType : "application/json", //Type of sent data in the request (optional)
        success : function(responseJSON){
            for(let i = 0; i < responseJSON.length; i++){
                $(".listOfPets").append(`<li> ${responseJSON[i].name} </li>`);
            }
        }, 
        error: function(err){
            console.log("error");
            console.log(err);
        }
    });
}

function addPet(newPet){
    console.log("adding");
    console.log(newPet.name);
    console.log(newPet.typeOfPet);
    $.ajax({
        url:(url), //url/endpointToAPI,
        type: "POST", 
        data: JSON.stringify(newPet),
        contentType: "application/json; charset=utf-8"
    });
}

init();