function qs(s) { return document.querySelector(s) }
function qsa(s) { return document.querySelectorAll(s) }


class Produkt { // To jest jak w bazach danych nazwy kolumn
    constructor(id, nazwa, kategoria, cena) {
        this.id = id
        this.nazwa = nazwa
        this.kategoria = kategoria
        this.cena = cena
    }
}

const LISTA_PRODUKTOW = [ // Rekordy
    new Produkt(1, 'Koszulka The Black Parade', 'odziez', 100),
    new Produkt(2, 'Przypinka Hatsune Miku', 'dodatki', 19.99),
    new Produkt(3, 'Płyta Persona 3 Reload MEGAMIX', 'plyta', 203.05),
    new Produkt(4, 'Koszulka NeX GEn', 'odziez', 99.99),
    new Produkt(5, 'Płyta NeX GEn', 'plyta', 90),
    new Produkt(6, 'Koszulka Survival Horror', 'odziez', 100),
    new Produkt(7, `Płyta That's The Spirit`,'plyta', 70),
    new Produkt(8, 'Bluza HUNTRIX','odziez', 119.99),
    new Produkt(9, 'Przypinka My Chemical Romance', 'dodatki', 10),
    new Produkt(10, 'Płyta Tsunami Sea', 'plyta', 95.55),
    new Produkt(11, 'Kubek Hatsune Miku', 'kubek', 25.01),
    new Produkt(12, 'Płyta Three Cheers for Sweet Revenge', 'plyta', 100),
    new Produkt(13, 'Bluza Hatsune Miku', 'odziez', 149.99),
    new Produkt(14, 'Płyta The Black Parade', 'plyta', 65.85),
    new Produkt(15, 'Płyta Niepowstrzymany', 'plyta', 200),
]

// Pobranie wartości z pamięci albo wartość bazowa
let koszyk = JSON.parse(localStorage.getItem('koszyk')) || [] // Zapisuje nawet po odświeżeniu
let portfel = parseFloat(sessionStorage.getItem('portfel')) || 100 // Resetuje po odświeżeniu

function wyswietlProdukty() {
    const MIEJSCE_NA_PRODUKTY = qs('#produkty')
    if (MIEJSCE_NA_PRODUKTY) {
    } else {
        return
    }
    MIEJSCE_NA_PRODUKTY.innerHTML = "" // Ważne, dzięki temu nie duplikuje produktów

    const FILTRY_CHECKED = qsa('.filtr:checked')
    const AKTYWNE_FILTRY = Array.from(FILTRY_CHECKED).map(
        function(e) {
            return e.value
        }
    )

    const WYSZUKIWANE = qs('#wyszukiwarka').value.toLowerCase()

    LISTA_PRODUKTOW.forEach(el => { // Za każdy produkt, nazwa lowercase dopasowuje do wyszukiwania
        const PASUJACA_NAZWA = el.nazwa.toLowerCase().includes(WYSZUKIWANE)
        const PASUJACA_KATEGORIA = AKTYWNE_FILTRY.length === 0 || AKTYWNE_FILTRY.includes(el.kategoria) // Żaden filtr albo pasujące, bez tego 0 nie działa

        if (PASUJACA_NAZWA && PASUJACA_KATEGORIA) {
            const PRODUKT = document.createElement('div')
            PRODUKT.className = 'produkt'

            PRODUKT.innerHTML = `
                <h2>${el.nazwa}</h2>
                <img src="./img/${el.nazwa}.png">
                <p>Cena: <b>${el.cena}zł</b></p>
                <button class="dokoszyka">Do koszyka</button>
            ` // To w sumie tak jak na lekcjach, patrz pliki ze zbrojownia

            PRODUKT.querySelector('.dokoszyka').addEventListener('click', function() {
                dodajDoKoszyka(el)
            }) // Pobiera przycisk z nowoutworzonego diva z klasą dokoszyka i robi onclick, nie działa ze skrótem qs, bo??? chyba dlatego, że jestem wewnątrz funkcji
        
            MIEJSCE_NA_PRODUKTY.appendChild(PRODUKT) // Dodaje tego diva
        }
    })
}

wyswietlProdukty() // Wywołuje te funkcje, nic innego tego nie robi
qs('#wyszukiwarka').addEventListener('input', wyswietlProdukty)
qsa('.filtr').forEach(el => {
    el.addEventListener('change', wyswietlProdukty)
})

function odswiezenieKoszyka() {
    localStorage.setItem('koszyk', JSON.stringify(koszyk)) // Zamienia tablicę na tekst i zapisuje go w pamięci
} 

function odswiezeniePortfela() {
    sessionStorage.setItem('portfel', portfel)
}

function dodajDoKoszyka(produkt) {
    koszyk.push(produkt) // Przesuwa do koszyka, zbrojownia 
    odswiezenieKoszyka()
    odswiezenieKonta()
}

window.usunZKoszyka = function(index) {
    koszyk.splice(index, 1)
    odswiezenieKoszyka()
    odswiezenieKonta()
}

function zakup() {
    let suma_w_koszyku = 0
    koszyk.forEach(el => {
        suma_w_koszyku += el.cena
    });

    if (koszyk.length === 0) {
        return alert("Koszyk jest pusty!")
    } else if (portfel >= suma_w_koszyku) {
        portfel -= suma_w_koszyku
        alert(`Zakupiono produkty za ${suma_w_koszyku.toFixed(2)}zł!`)
        koszyk = []
        odswiezenieKoszyka()
        odswiezeniePortfela()
        odswiezenieKonta()
    } else {
        alert("Nie masz wystarczająco pieniędzy!")
    }
}

qs('#kup').addEventListener('click', zakup)

function odswiezenieKonta() {
    qs('#portfel').innerText = portfel.toFixed(2)
    
    const MIEJSCE_W_KOSZYKU = qs('#zawartosc-koszyka')
    MIEJSCE_W_KOSZYKU.innerHTML = ""
    let suma_w_koszyku = 0

    koszyk.forEach((el, i) => {
        suma_w_koszyku += el.cena
        const PRODUKT_W_KOSZYKU = document.createElement('div')
        PRODUKT_W_KOSZYKU.innerHTML = `${el.nazwa} - ${el.cena}zł <button onclick="usunZKoszyka(${i})">X</button>`
        MIEJSCE_W_KOSZYKU.appendChild(PRODUKT_W_KOSZYKU)
    })

    qs('#cena').innerText = suma_w_koszyku.toFixed(2)
}

qs('#generator-kasy').addEventListener('click', function() {
    portfel += 100
    sessionStorage.setItem('portfel', portfel)
    odswiezenieKonta()
})

qs('#reset').addEventListener('click', function() {
    koszyk = []
    localStorage.setItem('koszyk', JSON.stringify(koszyk))
    odswiezenieKonta()
})

odswiezenieKonta() // Wykonanie odświeżenia zawsze