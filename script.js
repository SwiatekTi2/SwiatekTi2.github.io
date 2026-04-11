function qs(s) { return document.querySelector(s) }
function qsa(s) { return document.querySelectorAll(s) }


class Produkt {
    constructor(id, nazwa, kategoria, cena) {
        this.id = id
        this.nazwa = nazwa
        this.kategoria = kategoria
        this.cena = cena
    }
}

const LISTA_PRODUKTOW = [
    new Produkt(1, 'Koszulka The Black Parade', 'odziez', 100),
    new Produkt(2, 'Przypinka Hatsune Miku', 'dodatki', 19.99),
    new Produkt(3, 'Płyta Persona 3 Reload MEGAMIX', 'plyta', 203.05),
    new Produkt(4, 'Koszulka NeX GEn', 'odziez', 99.99),
    new Produkt(5, 'Płyta NeX GEn', 'plyta', 90),
    new Produkt(6, 'Koszulka Survival Horror', 'odziez', 100),
    new Produkt(7, `Płyta That's The Spirit`,'plyta', 70),
    new Produkt(8, `Bluza HUNTRIX`,'odziez', 119.99),
    new Produkt(9, 'Przypinka My Chemical Romance', 'dodatki', 10),
    new Produkt(10, 'Płyta Tsunami Sea', 'plyta', 95.50),
    new Produkt(11, 'Kubek Hatsune Miku', 'kubek', 25.01),
    new Produkt(12, 'Płyta Three Cheers for Sweet Revenge', 'plyta', 100),
    new Produkt(13, 'Bluza Hatsune Miku', 'odziez', 149.99),
    new Produkt(14, 'Płyta The Black Parade', 'plyta', 65.85),
    new Produkt(15, 'Płyta Niepowstrzymany', 'plyta', 200),
]

let koszyk = JSON.parse(localStorage.getItem('koszyk')) || []
let portfel = parseFloat(sessionStorage.getItem('portfel')) || 300

function wyswietlProdukty() {
    const MIEJSCE_NA_PRODUKTY = qs('#produkty')

    if (MIEJSCE_NA_PRODUKTY) {
    } else {
        return
    }
    MIEJSCE_NA_PRODUKTY.innerHTML = "" // Ważne, żeby nie duplikowało produktów

    const WYSZUKIWANE = qs('#wyszukiwarka').value.toLowerCase()

    const AKTYWNE_FILTRY = Array.from(qsa('.filtr:checked')).map(el => el.value) // Chyba ok, działa, chociaż nigdy nie używałem nic z tego

    LISTA_PRODUKTOW.forEach(el => {
        const PASUJACA_NAZWA = el.nazwa.toLowerCase().includes(WYSZUKIWANE)
        const PASUJACA_KATEGORIA = AKTYWNE_FILTRY.length === 0 || AKTYWNE_FILTRY.includes(el.kategoria) // Żaden filtr albo pasujące

        if (PASUJACA_NAZWA && PASUJACA_KATEGORIA) {
            const PRODUKT = document.createElement('div')
            PRODUKT.className = 'produkt'

            PRODUKT.innerHTML = `
                <h2>${el.nazwa}</h2>
                <img src="./img/${el.nazwa}.png">
                <p>Cena: <b>${el.cena}zł</b></p>
                <button class="dokoszyka">Do koszyka</button>
            `

            PRODUKT.querySelector('.dokoszyka').addEventListener('click', function() {
                dodajDoKoszyka(el)
            })
        
            MIEJSCE_NA_PRODUKTY.appendChild(PRODUKT)
        }
    })
}

wyswietlProdukty()

function dodajDoKoszyka(produkt) {
    koszyk.push(produkt)
    localStorage.setItem('koszyk', JSON.stringify(koszyk)) // Zamienia tablicę na tekst
    odswiezenieKonta()
}

window.usunZKoszyka = function(index) {
    koszyk.splice(index, 1)
    localStorage.setItem('koszyk', JSON.stringify(koszyk))
    odswiezenieKonta()
}

function zakup() {
    let suma = 0
    koszyk.forEach(el => {
        suma += el.cena
    });

    if (koszyk.length === 0) {
        return alert("Koszyk jest pusty!")
    }
    if (portfel >= suma) {
        portfel -= suma
        alert(`Zakupiono produkty za ${suma}zł!`)
        koszyk = []
        localStorage.setItem('koszyk', JSON.stringify(koszyk))
        sessionStorage.setItem('portfel', portfel)
        odswiezenieKonta()
    } else {
        alert("Nie masz wystarczająco kasy!")
    }
}

function odswiezenieKonta() {
    qs('#portfel').innerText = portfel.toFixed(2)
    
    const MIEJSCE_W_KOSZYKU = qs('#zawartosc-koszyka')
    MIEJSCE_W_KOSZYKU.innerHTML = ""
    let suma = 0

    koszyk.forEach((el, i) => {
        suma += el.cena
        const PRODUKT_W_KOSZYKU = document.createElement('div')
        PRODUKT_W_KOSZYKU.innerHTML = `${el.nazwa} - ${el.cena}zł <button onclick="usunZKoszyka(${i})">X</button>`
        MIEJSCE_W_KOSZYKU.appendChild(PRODUKT_W_KOSZYKU)
    })

    qs('#cena').innerText = suma.toFixed(2)
}

qs('#wyszukiwarka').addEventListener('input', wyswietlProdukty)
qsa('.filtr').forEach(el => {
    el.addEventListener('change', wyswietlProdukty)
})

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

qs('#kup').addEventListener('click', zakup)

odswiezenieKonta()