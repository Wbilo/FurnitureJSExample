let jsonSofaFile = 'jsonSofaData.json';
let jsonChairFile = 'jsonChairData.json';

class furniture {

    constructor(model, manufacturer, weight, price) {
        this.model = model;
        this.manufacturer = manufacturer;
        this.weight = weight;
        this.price = price;
    }

    get weightAndPrice() {
        return `This furniture costs ${this.price} kr. and weighs ${this.weight} kg.`;
    }

}



class sofa extends furniture {

    constructor(model, manufacturer, weight, price, seatSpaceCount) {

        // super kalder parent class constructoren.
        super(model, manufacturer, weight, price);
        this.seatSpaceCount = seatSpaceCount;
    }

}

class chair extends furniture {

    constructor(model, manufacturer, weight, price, legCount) {

        super(model, manufacturer, weight, price);
        this.legCount = legCount;
    }

}



// Følgende er en async helper function, der har til formål 
// at skabe object promises ved at hente data fra en json fil
// hvilket jeg gennemføre ved at benytte Fetch API'et 

const createObjectPromiseAsync = (fileName, type) => {

    // Promise objektet representere den eventuelle gennemførelse eller fejltagelse
    // af en asynkron process og dens resultat
    return new Promise((resolve, reject) => {
        fetch(fileName)
            .then(response => {
                return response.json()
            })
            .then(data => {
                resolve({
                    [type]: data[type]
                });
            })
            .catch(reject);
    });
}


const onRejected = (rejectReason) => {
    console.log(rejectReason);
};




// konvertere array af Objects om til et array af class instances
const createClassInstanceArray = (objectArray, classInstanceCallback) => {

    // .map kan man kalde på et array og så skabe et nyt array med ændringer.
    // Ændringerne bliver lavet via et funktion kald, som man kalder på vær 
    // element i arrayet og så putter resultaterne ind i det nye array.
    return objectArray.map(element => {

        let classInstance = Object.assign(classInstanceCallback(), element);
        return classInstance;
    });

}




let chairArrayPromise = createObjectPromiseAsync(jsonChairFile, 'chairs');

let sofaArrayPromise = createObjectPromiseAsync(jsonSofaFile, 'sofas');

// Promise.all tager et array af promises som input
// Promise.all vil så udføre de forskellige promises parallelt altså asynkront
// Så her henter vi altså data fra to forskellige kilder på samme tid
// Promise.all vil blive "resolved", når alle promises i array'et er "resolved"

Promise.all([chairArrayPromise, sofaArrayPromise])
    .then((objectArrays) => {

        let chairOb = objectArrays[0]["chairs"][0];

        let chairInstance = new chair(chairOb.model, chairOb.manufacturer,
            chairOb.weight, chairOb.price, chairOb.legCount);

        console.log(chairInstance);

        // Nu kan vi ta de object arrays, som vi skabte ud fra det json data vi hentede
        // og lave et array af class instances og kopier object dataen over i de class instances.  
        let chairInstanceArray =
            createClassInstanceArray(objectArrays[0]["chairs"], () => new chair());

        let sofaInstanceArray =
            createClassInstanceArray(objectArrays[1]["sofas"], () => new sofa());

        
        let furnitureArray = [];
        // Her benytter rest parameter (...) til at få fat i alle elementerne i arrayet 
        // og benytter så .push til at skubbe elementerne ind i furnitureArray
        furnitureArray.push(...chairInstanceArray, ...sofaInstanceArray);

        console.log(furnitureArray);

        for (let furn of furnitureArray) {
            // her kan vi tilgå den get metode (weightAndPrice)
            // som både sofa og chair instancerne nedarver fra furniture klassen.
            console.log(furn.weightAndPrice);
        }

        console.table(chairInstanceArray);
        console.table(sofaInstanceArray);
    })
    .catch(onRejected);


console.log("Denne kommentar kan ses øverst i konsollen, selvom den console.log kommando som udskriver den, er den sidste linje kode i script.js, hvilket beviser at resten af koden er Non-blocking");