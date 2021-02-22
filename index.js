var message = document.querySelector("#message");

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;

var grammar = "#JSGF V1.0;";

var recognition = new SpeechRecognition();
var grammarList = new SpeechGrammarList();
grammarList.addFromString(grammar,1);

recognition.grammars = grammarList;
recognition.lang = "hr";
recognition.interimResults = false;

recognition.onresult = async function(event){
    var last = await event.results.length -1;
    var command = await event.results[last][0].transcript;
    message.textContent = await document.getElementById("message").value + "\n" + command;
};

recognition.onspeechend = function(event){
    document.getElementById("microphone").style.backgroundColor = "#3689e6";
    document.getElementById("mic-icon").style.color = "#fafafa";
    document.getElementById("microphone").style.borderColor = "#1a1a1a";

};

recognition.onend = function(event){
    if(document.getElementById("textEditSwitch").checked){
        document.getElementById("message").readOnly = false;
    }else{
        document.getElementById("message").readOnly = true;
    }

    if(document.getElementById("numberSwitch").checked){
        message.textContent = document.getElementById("message").value.replaceAll(` 0 `,` nula `).replaceAll(` 1 `,` jedan `).replaceAll(` 2 `,` dva `).replaceAll(` 3 `,` tri `).replaceAll(` 4 `,` četiri `).replaceAll(` 5 `,` pet `).replaceAll(` 6 `,` šest `).replaceAll(` 7 `,` sedam `).replaceAll(` 8 `,` osam `).replaceAll(` 9 `,` devet `);
    };

    if(document.getElementById("functionSwitch").checked){
        message.textContent = document.getElementById("message").value.replaceAll("insert točka",".").replaceAll("insert zarez",",").replaceAll("insert točka zarez",";").replaceAll("insert navodnik",'"').replaceAll("insert lijeva zagrada","(").replaceAll("insert desna zagrada",")").replaceAll("insert povlaka","-").replaceAll("insert dvije točke",":").replaceAll("insert tri točke","...").replaceAll("insert novi red","\n");
    };

    if (document.getElementById("message").value[0] === "\n"){
        message.textContent = document.getElementById("message").value.slice(1);
    };
};

recognition.onerror = function(event){
    document.getElementById("microphone").style.backgroundColor = "#3689e6";
    document.getElementById("mic-icon").style.color = "#fafafa";
    document.getElementById("microphone").style.borderColor = "#1a1a1a";
};

document.querySelector("#microphone").addEventListener("click", function(){
    
    recognition.start();

    document.getElementById("microphone").style.backgroundColor = "#fafafa";
    document.getElementById("mic-icon").style.color = "#3689e6";
    document.getElementById("microphone").style.borderColor = "#3689e6";

});

function deleteMessage(){
    document.getElementById("message").innerHTML = "";
};

let saveFile = () => {
    	
    const msg = document.getElementById("message");
    
    let data = msg.value;
    
    const textToBLOB = new Blob([data], { type: 'text/plain' });
    const sFileName = 'gotekst.txt';

    let newLink = document.createElement("a");
    newLink.download = sFileName;

    if (window.webkitURL != null) {
        newLink.href = window.webkitURL.createObjectURL(textToBLOB);
    }
    else {
        newLink.href = window.URL.createObjectURL(textToBLOB);
        newLink.style.display = "none";
        document.body.appendChild(newLink);
    }

    newLink.click(); 
};

function showInfo(){
    document.getElementById("message").style.display = "none";
    document.getElementById("info").style.display = "block";
    
    document.getElementById("info").innerHTML = "Upute za korištenje\n\nPritiskom gumba mikrofona ili tipke 'SPACE' pokreće se snimanje glasa\nDok mikrofon prepoznaje glas, mijenja mu se boja, kada prestane s snimanjem vraća se u prvobitno stanje\nNakon završetka snimanja, u desnom pravokutniku, ispisuje se izgovoreni tekst\nIspod gumba mikrofona, nalaze se tri gumba koja uključuju ili isključuju, određene pojedinosti programa\nOdabirom 'Omogući uređivanje teksta' dobiva se mogućnost ručnog uređivanja teksta nakon što se on ispiše na ekranu\nOdabirom 'Zamijeni znamenke tekstom' sve samostalne znamenke od 0 do 9 koje se pojave u tekstu biti će zamijenjene svojim tekstualnim oblikom\nOdabirom 'Omogući korištenje naredbi' dobiva se mogućnost da u tekstu izgovorite sintagmu 'INSERT --ime naredbe--' što će pokrenuti određenu naredbu\nMoguće naredbe su 'točka, zarez, točka zarez, navodnik, lijeva zagrada, desna zagrada, povlaka, dvije točke, tri točke i novi red'\nTako će se npr. izgovaranjem naredbe 'INSERT TOČKA' u tekst umetnuti točka\nVažno je da svi gumbi za odabir koje želite uključiti, uključite prije pokretanja programa, a ne tijekom njegovog izvršavanja\nSa desne se strane nalaze još dva gumba 'Obriši' i 'Preuzimanje .txt datoteke'\nGumb 'Obriši' obrisati će sav dosad ispisani tekst, dok će drugi gumb na vaše računalo preuzeti datoteku pod nazivom 'gotekst.txt' u koju će biti pohranjen zapis koji se u tom trenutku nalazi ispisan na ekranu\nU bilo kojem trenutku, možete otvoriti ovaj prozor pritiskom tipke F2\nTakođer, za zatvaranje ovog prozora, pritisnite tipku F2";
};

document.body.onkeyup = function(key){
    if(key.keyCode == 113){
        if(document.getElementById("info").style.display == "none"){
            showInfo();
        }else{
            document.getElementById("info").style.display = "none";
            document.getElementById("message").style.display = "block";
        }
    }

    if(key.keyCode == 32){
        recognition.start();

        document.getElementById("microphone").style.backgroundColor = "#fafafa";
        document.getElementById("mic-icon").style.color = "#3689e6";
        document.getElementById("microphone").style.borderColor = "#3689e6";
    }
}