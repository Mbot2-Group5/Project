// Labels (der x-Achse) setzen
const labels = ['-5', '-4', '-3', '-2', '-1', '0'];

/* Geschwindigkeit-CHART*/

//Daten in den Beschleunigungs-Chart einfügen
const dataBeschleunigung = {
    labels: labels,
    datasets: [{
        label: 'Geschwindigkeit [m/s^2]',
        backgroundColor: 'rgb(0,0,0)',
        borderColor: 'rgb(0,0,0)',
        data: localStorage.getItem('beschleunigungsChartData'),
        fill: false,
    }]
};

// Konfiguration des Beschleunigung-Charts
const configBeschleunigung = {
    type: 'line',
    data: dataBeschleunigung,
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Beschleunigung'
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            }
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Zeit'
                }
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'm/s^2'
                }
            }
        }
    },
};

// Beschleunigungs-Chart erstellen
new Chart(
    document.getElementById('beschleunigungsChart'),
    configBeschleunigung
);


/* ABSTAND ZUR WAND-CHART*/

//Daten in den Abstand-Chart einfügen
const dataAbstand = {
    labels: labels,
    datasets: [{
        label: 'Abstand zu Wand',
        backgroundColor: 'rgb(0,0,0)',
        borderColor: 'rgb(0,0,0)',
        data: localStorage.getItem('abstandChartData'),
        fill: false,
    }]
};

// Konfiguration des Abstand-Charts
const configAbstand = {
    type: 'line',
    data: dataAbstand,
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Abstand'
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            }
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Zeit'
                }
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'cm'
                }
            }
        }
    },
};

// Abstand-Chart erstellen
new Chart(
    document.getElementById('abstandsChart'),
    configAbstand
);

//Chart updaten
setInterval(async function () {
    //Beschleunigungsdaten erhalten/auslesen
    configBeschleunigung.data.datasets[0].data = localStorage.getItem('beschleunigungsChartData').split(',').map(Number);

    //Abstanddaten erhalten/auslesen
    configAbstand.data.datasets[0].data = localStorage.getItem('abstandChartData').split(',').map(Number);
}, 500);