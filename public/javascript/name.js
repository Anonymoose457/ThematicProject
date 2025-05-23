document.addEventListener("DOMContentLoaded", function() {
    const nameForm = document.getElementById("name-form");

    const name1 = document.getElementById("placeholder1");
    const name2 = document.getElementById("placeholder2");
    const name3 = document.getElementById("placeholder3");
    const name4 = document.getElementById("placeholder4");
    const name5 = document.getElementById("placeholder5");
    const name6 = document.getElementById("placeholder6");
    const name7 = document.getElementById("placeholder7");
    const name8 = document.getElementById("placeholder8");
    
    const userName = document.getElementById("name-input");
    const nameArray = [name1,name2,name3,name4,name5,name6,name7,name8];
    
    const error = document.getElementById("error-container");
    const errorMsg = document.getElementById("error-msg");

    //Array in local storage
    let playerNames = JSON.parse(localStorage.getItem("playerNames")) || [];
    let playersNum = 0;

    nameForm.addEventListener("submit", function(e){
        let updated = false;
        e.preventDefault();

        //Name length validation check as long names will overflow onto the adjacent div
        if(userName.value.length > 16 || userName.value == ""){ 
            error.style.visibility = "visible";

            errorMsg.textContent = "Name must be shorter than 16 characters!";
            userName.textContent = "";
            return;
        }
        else{
            error.style.visibility = "hidden";
        }

        nameArray.forEach((name) => {
            if(updated !== true && name.textContent === "placeholder"){
                    name.textContent = userName.value;
                    name.style.visibility= "visible";

                    playersNum++;
                    updated = true;

                    //User input will be pushed into array, which is then stored into local storage.
                    playerNames.push(userName.value);
                    localStorage.setItem("playerNames", JSON.stringify(playerNames));
                }           
        });
        userName.value = "";  
    });    
    document.getElementById("name-btn").addEventListener("click", numOfPlayers);

    //Number of players validation check
    function numOfPlayers(){
        if(playersNum < 3){
            error.style.visibility = "visible";

            errorMsg.textContent = "Player number is insufficient to start the game.";
            userName.textContent = "";
        }
        else{
            window.location.href='categories.html';
        }
    }

    
});


