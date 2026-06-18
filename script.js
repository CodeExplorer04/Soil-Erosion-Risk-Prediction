let riskChart;
let scatterChart;

document.getElementById("analyzeBtn").addEventListener("click", () => {

    const file = document.getElementById("fileInput").files[0];

    if (!file) {
        alert("Select CSV File");
        return;
    }

    Papa.parse(file, {
        header: true,
        delimiter: ";",
        skipEmptyLines: true,

        complete: function(results) {

            const data = results.data;

            processData(data);
        }
    });

});

function processData(data) {

    let processed = [];

    data.forEach(row => {

        const keys = Object.keys(row);

        let rainfallValues = [];

        for(let i=3;i<keys.length;i++){

            rainfallValues.push(
                Number(row[keys[i]]) || 0
            );
        }

        const monthlyRainfall =
            rainfallValues.reduce((a,b)=>a+b,0);

        const R = 0.5 * monthlyRainfall;

        const K = 0.3;
        const LS = 2.0;
        const C = 0.4;
        const P = 0.8;

        const soilLoss =
            R*K*LS*C*P;

        let risk = "";

        if(soilLoss < 20)
            risk = "Low";

        else if(soilLoss < 50)
            risk = "Moderate";

        else if(soilLoss < 100)
            risk = "High";

        else
            risk = "Severe";

        processed.push({

            state:
                row.state || row.State || "-",

            district:
                row.district || row.District || "-",

            rainfall:
                monthlyRainfall,

            soilLoss:
                soilLoss,

            risk:
                risk
        });

    });

    updateStats(processed);

    updateCharts(processed);

    updateTable(processed);
}

function updateStats(data){

    document.getElementById(
        "totalRecords"
    ).innerText = data.length;

    const avg =
        data.reduce((s,r)=>s+r.soilLoss,0)
        / data.length;

    document.getElementById(
        "avgSoilLoss"
    ).innerText = avg.toFixed(2);

    const max =
        Math.max(...data.map(x=>x.soilLoss));

    document.getElementById(
        "maxSoilLoss"
    ).innerText = max.toFixed(2);

    const high =
        data.filter(x =>
            x.risk==="High" ||
            x.risk==="Severe"
        ).length;

    document.getElementById(
        "highRiskCount"
    ).innerText = high;
}

function updateCharts(data){

    const riskCounts = {
        Low:0,
        Moderate:0,
        High:0,
        Severe:0
    };

    data.forEach(x=>{
        riskCounts[x.risk]++;
    });

    if(riskChart)
        riskChart.destroy();

    if(scatterChart)
        scatterChart.destroy();

    riskChart =
        new Chart(
            document.getElementById("riskChart"),
            {
                type:"pie",
                data:{
                    labels:Object.keys(riskCounts),
                    datasets:[{
                        data:Object.values(riskCounts)
                    }]
                }
            }
        );

    scatterChart =
        new Chart(
            document.getElementById("scatterChart"),
            {
                type:"scatter",
                data:{
                    datasets:[{
                        label:"Districts",
                        data:data.map(r=>({
                            x:r.rainfall,
                            y:r.soilLoss
                        }))
                    }]
                }
            }
        );
}

function updateTable(data){

    const top10 =
        [...data]
        .sort(
            (a,b)=>
            b.soilLoss-a.soilLoss
        )
        .slice(0,10);

    const tbody =
        document.getElementById(
            "tableBody"
        );

    tbody.innerHTML = "";

    top10.forEach(row=>{

        tbody.innerHTML += `
        <tr>
            <td>${row.state}</td>
            <td>${row.district}</td>
            <td>${row.soilLoss.toFixed(2)}</td>
            <td>${row.risk}</td>
        </tr>
        `;

    });

}