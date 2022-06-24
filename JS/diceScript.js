// Event listener so the rollDicemethod is only called when that button is clicked
//if rollDiced had "()" after it in this call, then when the page is first opened, rolleDice would be called
//but we only want it called onclick
document.getElementById("diceListener").addEventListener("click", rollDice1);
document.getElementById("diceListener").addEventListener("click", rollDice2);
document.getElementById("diceListener").addEventListener("click", rollDice3);



//This function returns a promise after a timeout. IE)Thread.sleep(ms)
//NOTE: this propbably could've used the built in "SetInterval()" function to provide similiar functionality
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//The following three functions cause the dice to "roll", with the second and third dice "rolling" longer
async function rollDice1()
{  
    for(var i=0;i<20;i++)
    {
        await sleep(50);
        var ran = Math.floor(Math.random() * 6 + 1);
        document.getElementById(`dice${1}`).src=`images/Dice${ran}.jpg`;
    }  
}

async function rollDice2()
{  
    for(var i=0;i<35;i++)
    {
        await sleep(50);
        var ran = Math.floor(Math.random() * 6 + 1);
        document.getElementById(`dice${2}`).src=`images/Dice${ran}.jpg`;
    }
}

async function rollDice3()
{  
    for(var i=0;i<50;i++)
    {
        await sleep(50);
        var ran = Math.floor(Math.random() * 6 + 1);
        document.getElementById(`dice${3}`).src=`images/Dice${ran}.jpg`;
    }
}
