var message = document.querySelector("#message");   //definira prostor u koji će se ispisivati rezultati 

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;   //poziva SpeechRecognition kao sučelje kojim se koristi Web Speech API, zapravo skup predefiniranih funkcija koje omogućavaju hvatanje event-a tj. rezultata mikrofona
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;   //poziva SpeechGrammarList kao listu riječi kojima se koristi Web Speech API kako bi prepoznao riječi koje korisnik izgovara

var grammar = "#JSGF V1.0;";    //Program će koristiti standardnu listu riječi pohranjenu na Web Speech API-u, zapravo sadrži sve riječi koje prepoznaje Google Translate

var recognition = new SpeechRecognition();
var grammarList = new SpeechGrammarList();  //Stvaraju se dva objekta, kojima će se pozivati funkcije iz pozvanih komponenti Web Speech API-a
grammarList.addFromString(grammar,1); //Već definiranu listu riječi koja je inače ogroman string riječi odvojenih razmakom, koristiti ćemo kao listu za lakše dohvaćanje pojedinih elemenata indeksima

recognition.grammars = grammarList; //našu listu iz prethodnog reda pridodaje objektu recognition kako bi ju mogao koristiti za povlačenje riječi  
recognition.lang = "hr";    //glavni jezik prepoznavanja postaje hrvatski (hr), to znači da će u listi prvo gledati sve hrvatske riječi i da pretpostavlja da će većina izgovorenih riječi biti na hrvatskom
recognition.interimResults = false; //program će rezultate slušanja ispisati tek nakon izvršenja radnje, da je postavljeno true, uživo bi se ispisivao tekst dok korisnik govori, odabrali smo ovu opciju zbog jednostavnijih operacija sa stringovima koje ćemo kasnije koristiti

recognition.onresult = async function(event){   //funkcija će se pokrenuti kada objekt recognition prepozna određeni zvučni signal, preduvijet je da je objekt pokrenut metodom start (vidi liniju 51) tj. da je pritisnut gumb za mikrofon
    var last = await event.results.length -1;   //nakon svakog novog zvučnog signala, zadnji postaje onaj element koji ima index za 1 manji od dužine stringa rezultata inputa, pozivanjem event.results gledaju se rezultati isključivo one radnje koja je pokrenula program tj. korisnikovog glasa
    var command = await event.results[last][0].transcript;  //program korištenjem metode .transcript pretvara sakupljeni zvučni zapis u logičan string počevši od onoga što je zadnje čuo prema početku, razlog tome je što ukoliko korisnik kaže još nešto nakon što se izvrši ova radnja to će se lako nadodati
    document.getElementById("message").value = await document.getElementById("message").value + "\n" + command; //u element #message dodaje se tekst na način da se na postojeću vrijednost u elementu .value dodaje rezultat linije command, tako se zapravo dodaje linija na liniju korisnikovog govora s jednim redom razmaka između

    //funkcija je zadana kao async, to omogućuje korištenje riječi await koja zapravo sačeka potpuno izvršenje radnje prije prelaska na novu liniju, tj. ne ide dalje sve dok korisnik govori i dok se mijenja duljina stringa i indeks zadnjeg elementa
};

recognition.onspeechend = function(event){  //funkcija se izvršava kada program po prvi puta primjeti tišinu tj. kada korisnik prestane s izgovorom, event je u ovom slučaju nepotreban, no nepisano je pravilo da se uvijek koristi u ovakvim funkcijama kako bi naglasio da njihovo pokretanje ovisi o akciji korisnika
    document.getElementById("microphone").style.backgroundColor = "#3689e6";
    document.getElementById("mic-icon").style.color = "#fafafa";
    document.getElementById("microphone").style.borderColor = "#1a1a1a";
    // prethodne tri linije mijenjaju CSS obilježja za odabrane elemente, korisnik to vidi na način da se kada prestane s izgovaranjem teksta boja mikrofona vrati na početnu
};

recognition.onend = function(event){    //funkcija se pokreće kada se isključi objekt recognition tj. ne samo nakon prestanka govora nego i nakon ispisivanja rezultata u za to predviđeno mjesto
    if(document.getElementById("numberSwitch").checked){
        document.getElementById("message").value = document.getElementById("message").value.replaceAll(` 0 `,` nula `).replaceAll(` 1 `,` jedan `).replaceAll(` 2 `,` dva `).replaceAll(` 3 `,` tri `).replaceAll(` 4 `,` četiri `).replaceAll(` 5 `,` pet `).replaceAll(` 6 `,` šest `).replaceAll(` 7 `,` sedam `).replaceAll(` 8 `,` osam `).replaceAll(` 9 `,` devet `);
    };  //ovaj dio se pokreće ako je u tom trenutku uključen switch gumb za promjenu znamenaka u tekst, izvršava se da vrijednosti polja za ispisivanje rezultata .value zamijeni istom vrijednosti na koju je primjenjeno 10 metoda .replaceAll(old, new) koje umjesto parametra old postavljaju parametar new npr. umjetsto '1' napiše se 'jedan'
    // također je korištena metoda za stringove s kosim navodncima umjesto klasične, riječ je o novoj verziji Javascripta koja je izašla u siječnju 2021. i radi na način da prepoznaje točan broj razmaka između dva znaka za razliku od klasične koja je sve razmake jedan do drugoga tretirala kao jedan
    // koristi se kako nebi broj '456' zapisalo kao 'četiripetšest'

    if(document.getElementById("functionSwitch").checked){
        document.getElementById("message").value = document.getElementById("message").value.replaceAll("insert točka",".").replaceAll("insert zarez",",").replaceAll("insert točka zarez",";").replaceAll("insert navodnik",'"').replaceAll("insert lijeva zagrada","(").replaceAll("insert desna zagrada",")").replaceAll("insert povlaka","-").replaceAll("insert dvije točke",":").replaceAll("insert tri točke","...").replaceAll("insert novi red","\n");
    };  //ovaj dio se pokreće ako je u tom trenutku switch gumb za korištenje naredbi uključen, radi na istom principu kao i gornji primjer, samo što koristi klasične stringove
    // mogućnosti tj. naredbe koje prepoznaje su INSERT + ime znaka poput točke, zareza, itd.

    if (document.getElementById("message").value[0] === "\n"){
        document.getElementById("message").value = document.getElementById("message").value.slice(1);
    }; //ukoliko je prvi element stringa rezultata prazan tj. ako string započinje oznakom novog reda, on se uklanja metodom .slice(start,end) koja reže string počevši od elementa s indeksom 1 pa do kraja, dakle sve osim prvoga
};

recognition.onerror = function(event){  //funckija se pokreće kada objekt recognition primjeti grešku u radu kao što su blokirani pristup ili nedovoljno zvučnih signala
    document.getElementById("microphone").style.backgroundColor = "#3689e6";
    document.getElementById("mic-icon").style.color = "#fafafa";
    document.getElementById("microphone").style.borderColor = "#1a1a1a";
};  //vraća gumb mikrofona u prvobitno stanje kako bi obavijestio korisnika da se snimanje prekinulo

document.querySelector("#microphone").addEventListener("click", function(){
    //ova se funkcija pokreće kada se klikom miša klikne gumb mikrofona
    recognition.start();    //pokreće objekt recognition tj. on počinje tražiti zvučne signale, prije početka obavezno traži dopuštenje za korištenje mikrofona

    document.getElementById("microphone").style.backgroundColor = "#fafafa";
    document.getElementById("mic-icon").style.color = "#3689e6";
    document.getElementById("microphone").style.borderColor = "#3689e6";
    // mijenja boje mikrofona u one koje simboliziraju da je snimanje u tijeku
});

function textEdit(){    //funkcija se pokreće klikom na element #textEditSwitch, kod tog elementa u HTML-u označeno je onclick = textEdit() što znači da će pokrenuti ovu funkciju kada ga se pritisne klikom miša

    if(document.getElementById("textEditSwitch").checked){
        document.getElementById("message").readOnly = false;
    }else{
        document.getElementById("message").readOnly = true;
    } //ovisno o tome je li korisnik zatražio mogućnost uređivanja teksta ili ju je isključio mijenja vrijednost metode .readOnly koja određuje hoće li navedeni element biti tipa READ ONLY što znači da se neće moći uređivati tekst u njemu već samo čitati
}

function deleteMessage(){   //funkcija se pokreće klikom gumba OBRIŠI SVE što je vidljivo iz HTML-a
    document.getElementById("message").value = "";  //vrijednost .value odabranog elementa postavlja kao prazan string tj. ništa
};

let saveFile = () => {  //navedena funkcija pokreće se pritiskom na gumb za preuzimanje .txt datoteke koja na računalo skida datoteku gotekst.txt u kojoj se nalazi trenutni zapis u polju #message tj. trenutni rezultat
    	
    const msg = document.getElementById("message"); //postavlja varijablu msg kao mjesto s kojega će čitati vrijednost teksta
    
    let data = msg.value;   //vrijednost teksta pohranjuje se u varijablu data
    
    const textToBLOB = new Blob([data], { type: 'text/plain' });    //vrijednosti varijable data korištenjem objekta Blob() pretvaraju se iz stringa u tekst koji smo navikli gledati u .txt datotekama

    const sFileName = 'gotekst.txt';    //određuje da će ime datoteke biti 'gotekst.txt'

    let newLink = document.createElement("a"); //stvara se novi link s kojega če se na računalo preuzeti .txt datoteka, u tu se svrhu u HTML-u stvara element <a> koji inače simbolizira linkove, samo što je ovaj prazan i na stranici nevidljiv te služi kako bi se posao skidanja odvio u pozadini.
    newLink.download = sFileName; //na kreirani link pridružuje se vrijednost imena buduće tekstualne datoteke

    if (window.webkitURL != null) {
        newLink.href = window.webkitURL.createObjectURL(textToBLOB);
    }
    else {
        newLink.href = window.URL.createObjectURL(textToBLOB);
        newLink.style.display = "none";
        document.body.appendChild(newLink);
    } //ovisno o postojanju linka za skidanje datoteke, stvara se novi ili se koristi stari URL toga linka kao bi mu se moglo pristupiti

    newLink.click(); //program 'klikne' na nevidljivi link čime pokreće naredbe vezane na njega što ga odvodi na dodjeljeni URL, na kraju kao rezultat, vidimo da se preuzela nova datoteka 
};

function showInfo(){ //funkcija se pokreće pritiskom linka za otvaranje uputa za korištenje ili tipke F2 (vidi liniju 110)
    document.getElementById("message").style.display = "none";
    document.getElementById("info").style.display = "block"; //na stranici zapravo postoje dva 'message box-a' jedan za ispisivanje rezultata, drugi za ove upute, ovim se linijama mijenja njigova vidljivost putem CSS-a
    
    document.getElementById("info").innerHTML = "Upute za korištenje\n\nPritiskom gumba mikrofona ili tipke 'SPACE' pokreće se snimanje glasa\nDok mikrofon prepoznaje glas, mijenja mu se boja, kada prestane s snimanjem vraća se u prvobitno stanje\nNakon završetka snimanja, u desnom pravokutniku, ispisuje se izgovoreni tekst\nIspod gumba mikrofona, nalaze se tri gumba koja uključuju ili isključuju, određene pojedinosti programa\nOdabirom 'Omogući uređivanje teksta' dobiva se mogućnost ručnog uređivanja teksta nakon što se on ispiše na ekranu\nOdabirom 'Zamijeni znamenke tekstom' sve samostalne znamenke od 0 do 9 koje se pojave u tekstu biti će zamijenjene svojim tekstualnim oblikom\nOdabirom 'Omogući korištenje naredbi' dobiva se mogućnost da u tekstu izgovorite sintagmu 'INSERT --ime naredbe--' što će pokrenuti određenu naredbu\nMoguće naredbe su 'točka, zarez, točka zarez, navodnik, lijeva zagrada, desna zagrada, povlaka, dvije točke, tri točke i novi red'\nTako će se npr. izgovaranjem naredbe 'INSERT TOČKA' u tekst umetnuti točka\nVažno je da svi gumbi za odabir koje želite uključiti, uključite prije pokretanja programa, a ne tijekom njegovog izvršavanja\nSa desne se strane nalaze još dva gumba 'Obriši' i 'Preuzimanje .txt datoteke'\nGumb 'Obriši' obrisati će sav dosad ispisani tekst, dok će drugi gumb na vaše računalo preuzeti datoteku pod nazivom 'gotekst.txt' u koju će biti pohranjen zapis koji se u tom trenutku nalazi ispisan na ekranu\nU bilo kojem trenutku, možete otvoriti ovaj prozor pritiskom tipke F2\nTakođer, za zatvaranje ovog prozora, pritisnite tipku F2";
    // u #info element ispisuju se slijdeće upute 
};

document.body.onkeyup = function(key){ //ova se funkcija pokreće kada korisnik pritisne bilo koju tipku na tipkovnici u bilo kojem dijelu stranice
    if(key.keyCode == 113){ //ukoliko je pritisnuo tipku s kodom 113 tj. tipku F2 pokreće se daljni dio koda
        if(document.getElementById("info").style.display == "none"){
            showInfo(); //ukoliko nisu otvorene upute za uporabu, otvara ih, ukoliko već jesu onda ih zatvara [else dio]
        }else{
            document.getElementById("info").style.display = "none";
            document.getElementById("message").style.display = "block";
        }
        //na ovaj se način pritiskom tipke F2 mogu otvarati i zatvarati upute za korištenje
    }

    if(key.keyCode == 32){ //ukoliko je pritisnuo tipku s kodom 32 tj. tipku SPACE izvršavaju se iste naredbe kao i kada se pritisne gumb mikrofona što znači da se program osim pritiska tog gumba može pokretati i pritiskom tipke SPACE
        recognition.start();

        document.getElementById("microphone").style.backgroundColor = "#fafafa";
        document.getElementById("mic-icon").style.color = "#3689e6";
        document.getElementById("microphone").style.borderColor = "#3689e6";
    }
    // ukoliko pritisne bilo koju drugu tipku osim navedenih neće se dogoditi apsolutno ništa
};