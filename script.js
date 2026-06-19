function predictSoilLoss(){

    const rainfall =
        parseFloat(
            document.getElementById("rainfall").value
        );

    if(isNaN(rainfall)){

        alert("Enter Monthly Rainfall");

        return;
    }

    const R = 0.5 * rainfall;

    const K = 0.3;
    const LS = 2.0;
    const C = 0.4;
    const P = 0.8;

    const soilLoss =
        R * K * LS * C * P;

    let risk = "";
    let recommendation = "";

    if(soilLoss < 20){

        risk = "Low";
        recommendation =
        "Maintain current farming practices.";

    }
    else if(soilLoss < 50){

        risk = "Moderate";
        recommendation =
        "Increase vegetation cover.";

    }
    else if(soilLoss < 100){

        risk = "High";
        recommendation =
        "Use contour farming and mulching.";

    }
    else{

        risk = "Severe";
        recommendation =
        "Immediate soil conservation measures required.";

    }

    document.getElementById(
        "soilLoss"
    ).innerText =
    soilLoss.toFixed(2);

    document.getElementById(
        "riskLevel"
    ).innerText =
    risk;

    document.getElementById(
        "recommendation"
    ).innerText =
    recommendation;
}
